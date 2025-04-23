'use client';

import React, { useState, KeyboardEvent, useRef, useEffect } from 'react';

type Product = {
    productId: number;
    costPrice: number;
    sellingPrice: number;
    stockAdjustment: number;
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

    // Create refs for each input
    const productIdRef = useRef<HTMLInputElement>(null);
    const costPriceRef = useRef<HTMLInputElement>(null);
    const sellingPriceRef = useRef<HTMLInputElement>(null);
    const stockAdjustmentRef = useRef<HTMLInputElement>(null);

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
        };

        setStockList([...stockList, newItem]);

        // Clear input fields after adding
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
                                <td className='py-2'>{currentStock}</td>
                                <td className='py-2'>{item.stockAdjustment}</td>
                                <td className='py-2'>{currentStock + item.stockAdjustment}</td>
                                <td className='py-2'>{(item.costPrice * item.stockAdjustment).toFixed(2)}</td>
                            </tr>
                        ))}

                        {/* Input Row */}
                        <tr className="border-b">
                            <td className="py-2 text-center">
                                <input
                                    ref={productIdRef}
                                    type="text"
                                    value={productId}
                                    onChange={(e) => setProductId(e.target.value)}
                                    onKeyDown={(e) => handleKeyPress(e, 'productId')}
                                    className="w-20 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                />
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
                                    value={newInventory}
                                    disabled
                                />
                            </td>
                            <td className="py-2 text-center">{total.toFixed(2)}</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div className="flex gap-4 m-10">
                <button 
                    onClick={handleSubmit}
                    disabled={submitting}
                    className={`p-3 rounded transition-all duration-300 flex items-center justify-center min-w-32
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