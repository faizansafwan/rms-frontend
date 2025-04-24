'use client';

import React, { useState, KeyboardEvent, useRef, useEffect, JSX } from 'react';

type Product = {
    productId: number;
    costPrice: number;
    sellingPrice: number;
    stockAdjustment: number;
    currentStock: number;  // Add this field
};

type ProductSuggestion = {
    id: number;  // Matches your Product model's Id
    productName: string;  // Matches your Product model's ProductName
    
};

// Add a type for the stock data we'll fetch
type StockData = {
    costPrice: number;
    sellingPrice: number;
    newStock: number;
};

export default function AddStock(): JSX.Element {
    const [productId, setProductId] = useState('');
    const [costPrice, setCostPrice] = useState('');
    const [sellingPrice, setSellingPrice] = useState('');
    const [stockAdjustment, setStockAdjustment] = useState('');
    const [currentStock, setCurrentStock] = useState(0);
    const [stockList, setStockList] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [products, setProducts] = useState<ProductSuggestion[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<ProductSuggestion[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1);
    const [fetchingStock, setFetchingStock] = useState(false);

    // Create refs for each input
    const productIdRef = useRef<HTMLInputElement>(null);
    const costPriceRef = useRef<HTMLInputElement>(null);
    const sellingPriceRef = useRef<HTMLInputElement>(null);
    const stockAdjustmentRef = useRef<HTMLInputElement>(null);
    const suggestionsRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Fetch products when component mounts
        const fetchProducts = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/Product/product-list`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                
                if (response.ok) {
                    const data = await response.json();
                    if (Array.isArray(data)) {
                        // Transform the data to match our ProductSuggestion type
                        const formattedProducts = data.map(product => ({
                            id: product.id,
                            productName: product.productName,
                            // Add other fields you might need
                        }));
                        setProducts(formattedProducts);
                    } else {
                        console.error('Unexpected API response format');
                        setProducts([]);
                    }
                }
            } catch (error) {
                console.error('Error fetching products:', error);
                setProducts([]);
            }
        };
        
        fetchProducts();
    }, []);

    const handleProductInputChange = (value: string) => {
        setProductId(value);
        
        if (value.length > 0 && products.length > 0) {
            const searchTerm = value.toLowerCase();
            const filtered = products.filter(p => 
                p.id.toString().includes(searchTerm) || 
                p.productName.toLowerCase().includes(searchTerm)
            );
            setFilteredProducts(filtered);
            setShowSuggestions(filtered.length > 0);
        } else {
            setShowSuggestions(false);
        }
    };

    const handleProductKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (showSuggestions) {
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                setActiveSuggestionIndex(prev => 
                    Math.min(prev + 1, filteredProducts.length - 1)
                );
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                setActiveSuggestionIndex(prev => Math.max(prev - 1, -1));
            } else if (e.key === 'Enter') {
                e.preventDefault();
                if (activeSuggestionIndex >= 0 && activeSuggestionIndex < filteredProducts.length) {
                    selectProduct(filteredProducts[activeSuggestionIndex]);
                }
            } else if (e.key === 'Escape') {
                setShowSuggestions(false);
            }
        } else {
            if (e.key === 'Enter') {
                handleKeyPress(e, 'productId');
            }
        }
    };

    const selectProduct = async (product: ProductSuggestion) => {

        setFetchingStock(true);
        try {
            // Fetch stock data for the selected product
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/Stock/stock/${product.id}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
    
            if (response.ok) {
                const stockData = await response.json();
                if (stockData && stockData.length > 0) {
                    // Get the most recent stock entry (assuming the API returns an array sorted by date)
                    const latestStock = stockData[0];
                    
                    // Update the form fields
                    setProductId(product.id.toString());
                    setCostPrice(latestStock.costPrice.toString());
                    setSellingPrice(latestStock.sellingPrice.toString());
                    setCurrentStock(latestStock.newStock);
                } else {
                    // No stock data found, set defaults
                    setProductId(product.id.toString());
                    setCostPrice('0');
                    setSellingPrice('0');
                    setCurrentStock(0);
                }
            } else {
                console.error('Failed to fetch stock data');
                // Fallback to just setting the product ID
                setProductId(product.id.toString());
            }
        } catch (error) {
            console.error('Error fetching stock data:', error);
            alert('Failed to load product stock information');
            setProductId(product.id.toString());

        } finally {
            setShowSuggestions(false);
            setActiveSuggestionIndex(-1);
            setFetchingStock(false);
            costPriceRef.current?.focus();
        }
    };

    const handleClickOutside = (e: MouseEvent) => {
        if (suggestionsRef.current && !suggestionsRef.current.contains(e.target as Node)) {
            setShowSuggestions(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const newInventory = currentStock + Number(stockAdjustment || 0);
    const total = Number(costPrice || 0) * Number(stockAdjustment || 0);

    useEffect(() => {
        // Simulate loading data (replace with actual data fetching)
        setLoading(true);
        const timer = setTimeout(() => {
            setLoading(false);
        }, 1000);
        return () => clearTimeout(timer);
    }, []);

    const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>, fieldName: string) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            
            // Validate current field before proceeding
            const currentValue = e.currentTarget.value.trim();
            if (!currentValue) {
                alert(`Please fill in ${fieldName.replace(/([A-Z])/g, ' $1').toLowerCase()} before proceeding`);
                return;
            }

            if (fieldName === 'stockAdjustment') {
                addItemToList();
            } else {
                // Move focus to next field
                switch (fieldName) {
                    case 'productId':
                        costPriceRef.current?.focus();
                        break;
                    case 'costPrice':
                        sellingPriceRef.current?.focus();
                        break;
                    case 'sellingPrice':
                        stockAdjustmentRef.current?.focus();
                        break;
                }
            }
        }
    };

    const addItemToList = () => {
        if (!productId || !costPrice || !sellingPrice || !stockAdjustment) {
            alert('Please fill all fields before adding');
            return;
        }
    
        const newItem: Product = {
            productId: parseInt(productId),
            costPrice: parseFloat(costPrice),
            sellingPrice: parseFloat(sellingPrice),
            stockAdjustment: parseInt(stockAdjustment),
            currentStock: currentStock,  // Store the current stock with the product
        };
    
        setStockList([...stockList, newItem]);
    
        // Clear input fields after adding (but keep currentStock)
        setProductId('');
        setCostPrice('');
        setSellingPrice('');
        setStockAdjustment('');
        
        // Return focus to first field
        productIdRef.current?.focus();
    };

    const handleSubmit = async () => {
        if (stockList.length === 0) {
            alert('Please add at least one stock item before submitting.');
            return;
        }

        setSubmitting(true);
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/Stock/bulk`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify(stockList),
            });

            const data = await response.json();

            if (response.ok) {
                alert('Stock added successfully!');
                setStockList([]);
            } else {
                alert(data.message || 'Failed to add stock');
            }
        } catch (error) {
            console.error('Error submitting stock:', error);
            alert('An error occurred while submitting stock');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="m-5 flex flex-col items-center justify-center min-h-[300px]">
                <div className="flex space-x-2 mb-4">
                    <div className="w-4 h-4 rounded-full bg-brown animate-bounce"></div>
                    <div className="w-4 h-4 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-4 h-4 rounded-full bg-secondary animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
                <p className="text-lg">Loading stock form...</p>
            </div>
        );
    }

    return (
        <div className="m-5 animate-fadeIn">
            <style jsx global>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.5s ease-out;
                }
                .table-row-enter {
                    opacity: 0;
                    transform: translateY(10px);
                }
                .table-row-enter-active {
                    opacity: 1;
                    transform: translateY(0);
                    transition: all 0.3s ease-out;
                }
            `}</style>

            <div className="mx-10 my-5 overflow-x-auto">
                <table className="w-full border-collapse">
                    <thead className="border-b">
                        <tr>
                            <th className="p-2 text-center">Product ID</th>
                            <th className="p-2 text-center">Cost</th>
                            <th className="p-2 text-center">Selling Price</th>
                            <th className="p-2 text-center">Current Inventory</th>
                            <th className="p-2 text-center">Stock Adjustment</th>
                            <th className="p-2 text-center">New Inventory</th>
                            <th className="p-2 text-center">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* List of added products */}
                        {stockList.map((item, index) => (
                            <tr 
                                key={index} 
                                className="border-b text-sm text-center hover:bg-gray-50 transition-colors"
                                style={{
                                    animation: `fadeIn 0.3s ease-out ${index * 0.05}s`,
                                    animationFillMode: 'both'
                                }}
                            >
                                <td className='py-2'>{item.productId}</td>
                                <td className='py-2'>{item.costPrice.toFixed(2)}</td>
                                <td className='py-2'>{item.sellingPrice.toFixed(2)}</td>
                                <td className='py-2'>{item.currentStock}</td>  {/* Use item's currentStock */}
                                <td className='py-2'>{item.stockAdjustment}</td>
                                <td className='py-2'>{item.currentStock + item.stockAdjustment}</td>
                                <td className='py-2'>{(item.costPrice * item.stockAdjustment).toFixed(2)}</td>
                            </tr>
                        ))}

                        {/* Input Row */}
                        <tr className="border-b">
                        <td className="py-2 text-center relative" style={{ height: 'auto' }}>
                        <div className="relative" ref={suggestionsRef}>
                        <input
                            ref={productIdRef}
                            type="text"
                            value={productId}
                            onChange={(e) => handleProductInputChange(e.target.value)}
                            onKeyDown={handleProductKeyDown}
                            onFocus={() => {
                                if (productId && filteredProducts.length > 0) {
                                    setShowSuggestions(true);
                                }
                            }}
                            className="w-40 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                            placeholder={fetchingStock ? "Loading..." : "ID or Name"}
                            disabled={fetchingStock}/>
            
                                {showSuggestions && filteredProducts.length > 0 && (
                                    <div 
                                        className="absolute z-50 mt-1 left-0 right-0 bg-white border border-gray-300 rounded shadow-lg"
                                        style={{
                                            maxHeight: '200px',
                                            overflowY: 'auto',
                                            top: '100%',
                                            transform: 'translateY(4px)'
                                        }}>
                                        <ul>
                                            {filteredProducts.map((product, index) => (
                                                <li
                                                    key={product.id}
                                                    className={`p-2 cursor-pointer hover:bg-gray-100 ${
                                                        index === activeSuggestionIndex ? 'bg-gray-200' : ''
                                                    }`}
                                                    onClick={() => selectProduct(product)}
                                                    onMouseEnter={() => setActiveSuggestionIndex(index)}>
                                                    <div className="flex justify-between">
                                                        <span className="font-medium">{product.id}</span>
                                                        <span>{product.productName}</span>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                                </div>
                            </td>

                            <td className="py-2 text-center">
                                <input
                                    ref={costPriceRef}
                                    type="text"
                                    value={costPrice}
                                    onChange={(e) => setCostPrice(e.target.value)}
                                    onKeyDown={(e) => handleKeyPress(e, 'costPrice')}
                                    className="w-20 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                />
                            </td>
                            <td className="py-2 text-center">
                                <input
                                    ref={sellingPriceRef}
                                    type="text"
                                    value={sellingPrice}
                                    onChange={(e) => setSellingPrice(e.target.value)}
                                    onKeyDown={(e) => handleKeyPress(e, 'sellingPrice')}
                                    className="w-20 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                />
                            </td>
                            <td className="py-2 text-center">
                                <input
                                    type="text"
                                    className="w-20 p-2 border rounded bg-gray-100"
                                    value={currentStock}
                                    disabled
                                />
                            </td>
                            <td className="py-2 text-center">
                                <input
                                    ref={stockAdjustmentRef}
                                    type="text"
                                    value={stockAdjustment}
                                    onChange={(e) => setStockAdjustment(e.target.value)}
                                    onKeyDown={(e) => handleKeyPress(e, 'stockAdjustment')}
                                    className="w-20 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                />
                            </td>
                            <td className="py-2 text-center">
                                <input
                                    type="text"
                                    className="w-20 p-2 border rounded bg-gray-100"
                                    value={currentStock + Number(stockAdjustment || 0)}
                                    disabled
                                />
                            </td>
                            <td className="py-2 text-center">{total.toFixed(2)}</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div className="flex gap-4 m-10 z-0">
                <button 
                    onClick={handleSubmit}
                    disabled={submitting}
                    className={`p-2 rounded transition-all duration-300 flex items-center justify-center min-w-32
                        ${submitting 
                            ? 'bg-gray-400 cursor-not-allowed' 
                            : 'bg-black text-white hover:bg-gray-800 hover:shadow-md'}
                    `}
                >
                    {submitting ? (
                        <>
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Processing...
                        </>
                    ) : (
                        'Save Stock'
                    )}
                </button>
            </div>
        </div>
    );
}