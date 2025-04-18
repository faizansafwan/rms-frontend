'use client';

import React, { useState, KeyboardEvent, useRef } from 'react';

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

    // Create refs for each input
    const productIdRef = useRef<HTMLInputElement>(null);
    const costPriceRef = useRef<HTMLInputElement>(null);
    const sellingPriceRef = useRef<HTMLInputElement>(null);
    const stockAdjustmentRef = useRef<HTMLInputElement>(null);

    const newInventory = currentStock + Number(stockAdjustment || 0);
    const total = Number(costPrice || 0) * Number(stockAdjustment || 0);

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
                console.log(data);
                setStockList([]);
            } else {
                alert(data.message || 'Failed to add stock');
            }
        } catch (error) {
            console.error('Error submitting stock:', error);
        }
    };

    return (
        <div className="m-5">
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
                            <tr key={index} className="border-b text-sm text-center">
                                <td className='py-1'>{item.productId}</td>
                                <td className='py-1'>{item.costPrice.toFixed(2)}</td>
                                <td className='py-1'>{item.sellingPrice.toFixed(2)}</td>
                                <td className='py-1'>{currentStock}</td>
                                <td className='py-1'>{item.stockAdjustment}</td>
                                <td className='py-1'>{currentStock + item.stockAdjustment}</td>
                                <td className='py-1'>{(item.costPrice * item.stockAdjustment).toFixed(2)}</td>
                            </tr>
                        ))}

                        {/* Input Row */}
                        <tr className="border-b">
                            <td className="py-1 text-center">
                                <input
                                    ref={productIdRef}
                                    type="text"
                                    value={productId}
                                    onChange={(e) => setProductId(e.target.value)}
                                    onKeyDown={(e) => handleKeyPress(e, 'productId')}
                                    className="w-15 p-1 border rounded"
                                />
                            </td>
                            <td className="py-1 text-center">
                                <input
                                    ref={costPriceRef}
                                    type="text"
                                    value={costPrice}
                                    onChange={(e) => setCostPrice(e.target.value)}
                                    onKeyDown={(e) => handleKeyPress(e, 'costPrice')}
                                    className="w-20 p-1 border rounded"
                                />
                            </td>
                            <td className="py-1 text-center">
                                <input
                                    ref={sellingPriceRef}
                                    type="text"
                                    value={sellingPrice}
                                    onChange={(e) => setSellingPrice(e.target.value)}
                                    onKeyDown={(e) => handleKeyPress(e, 'sellingPrice')}
                                    className="w-30 p-1 border rounded"
                                />
                            </td>
                            <td className="py-1 text-center">
                                <input
                                    type="text"
                                    className="w-20 p-1 border rounded"
                                    value={currentStock}
                                    disabled
                                />
                            </td>
                            <td className="py-1 text-center">
                                <input
                                    ref={stockAdjustmentRef}
                                    type="text"
                                    value={stockAdjustment}
                                    onChange={(e) => setStockAdjustment(e.target.value)}
                                    onKeyDown={(e) => handleKeyPress(e, 'stockAdjustment')}
                                    className="w-20 p-1 border rounded"
                                />
                            </td>
                            <td className="py-1 text-center">
                                <input
                                    type="text"
                                    className="w-20 p-1 border rounded"
                                    value={newInventory}
                                    disabled
                                />
                            </td>
                            <td className="py-1 text-center">{total.toFixed(2)}</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div className="flex gap-4 m-10">
                <button 
                    onClick={handleSubmit}
                    className="p-2 bg-black text-white rounded transition duration-300 hover:opacity-75" >
                    Save Stock
                </button>
            </div>
        </div>
    );
}