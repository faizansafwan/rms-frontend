'use client';

import React, { useState } from 'react';

export default function AddStock(): JSX.Element {
    const [productId, setProductId] = useState('');
    const [costPrice, setCostPrice] = useState('');
    const [sellingPrice, setSellingPrice] = useState('');
    const [stockAdjustment, setStockAdjustment] = useState('');
    const [currentStock, setCurrentStock] = useState(0); // This would be fetched if needed

    const newInventory = currentStock + Number(stockAdjustment || 0);
    const total = Number(costPrice || 0) * Number(stockAdjustment || 0);

    const handleSubmit = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/Stock`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`, // Add token logic if needed
                },
                body: JSON.stringify({
                    productId: parseInt(productId),
                    costPrice: parseFloat(costPrice),
                    sellingPrice: parseFloat(sellingPrice),
                    stockAdjustment: parseInt(stockAdjustment),
                }),
            });

            const data = await response.json();

            if (response.ok) {
                alert('Stock added successfully!');
                console.log(data);
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
                        {/* Existing rows ... */}

                        <tr className="border-b">
                            <td className="py-1 text-center">
                                <input
                                    type="text"
                                    value={productId}
                                    onChange={(e) => setProductId(e.target.value)}
                                    className="w-15 p-1 border rounded"
                                />
                            </td>
                            <td className="py-1 text-center">
                                <input
                                    type="text"
                                    value={costPrice}
                                    onChange={(e) => setCostPrice(e.target.value)}
                                    className="w-20 p-1 border rounded"
                                />
                            </td>
                            <td className="py-1 text-center">
                                <input
                                    type="text"
                                    value={sellingPrice}
                                    onChange={(e) => setSellingPrice(e.target.value)}
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
                                    type="text"
                                    value={stockAdjustment}
                                    onChange={(e) => setStockAdjustment(e.target.value)}
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

            <div className="flex justify-start m-10">
                <input
                    type="submit"
                    onClick={handleSubmit}
                    className="p-2 bg-black text-white rounded transition ease-in-out cursor-pointer duration-300 hover:opacity-75"
                    value="Save Stock"
                />
            </div>
        </div>
    );
}
