'use client';

import React from 'react';

export default function ProductList(): JSX.Element {
    return (
        <div className="m-5">
            <div className="mx-10">
                <table className="w-full border-collapse">
                    <thead className="space-y-4">
                        <tr className="h-12">
                            <th className="pr-4 text-left">
                                <label htmlFor="customerName">Customer Name:</label>
                            </th>
                            <td>
                                <input
                                    id="customerName"
                                    type="text"
                                    placeholder="Enter Name"
                                    className="border border-black p-2 rounded w-full"
                                />
                            </td>

                            <th className="px-4 text-left">
                                <label htmlFor="customerId">Customer ID:</label>
                            </th>
                            <td>
                                <input
                                    id="customerId"
                                    type="text"
                                    placeholder="ID"
                                    className="border border-black p-2 rounded w-full"
                                />
                            </td>
                        </tr>

                        <tr className="h-12">
                            <th className="pr-4 text-left">
                                <label htmlFor="customerAddress">Customer Address:</label>
                            </th>
                            <td>
                                <input
                                    id="customerAddress"
                                    type="text"
                                    placeholder="Address"
                                    className="border border-black p-2 rounded w-full"
                                />
                            </td>

                            <th className="px-4 text-left">
                                <label htmlFor="contactNumber">Contact Number:</label>
                            </th>
                            <td>
                                <input
                                    id="contactNumber"
                                    type="text"
                                    placeholder="Contact No."
                                    className="border border-black p-2 rounded w-full"
                                />
                            </td>
                        </tr>

                        <tr className="h-12">
                            <th className="text-left">
                                <label htmlFor="category">Category:</label>
                            </th>
                            <td>
                                <select
                                    id="category"
                                    className="border border-black p-2 rounded w-full"
                                >
                                    <option value="Option 1">Option 1</option>
                                    <option value="Option 2">Option 2</option>
                                    <option value="Option 3">Option 3</option>
                                    <option value="Option 4">Option 4</option>
                                </select>
                            </td>
                        </tr>
                    </thead>
                </table>
            </div>

            <div className="mx-10 my-5 overflow-x-auto">
                <table className="w-full border-collapse">
                    <thead className="border-b">
                        <tr>
                            <th className="p-2 text-center">Product ID</th>
                            <th className="p-2 text-center">Product</th>
                            <th className="p-2 text-center">Category</th>
                            <th className="p-2 text-center">Stock</th>
                            <th className="p-2 text-center">Cost Price</th>
                            <th className="p-2 text-center">Selling Price</th>
                            <th className="p-2 text-center">Total</th>
                        </tr>
                    </thead>

                    <tbody>
                        <tr className="even:bg-gray-100">
                            <td className="py-1 text-center">p108</td>
                            <td className="py-1 text-center">Product1</td>
                            <td className="py-1 text-center">Category1</td>
                            <td className="py-1 text-center">30</td>
                            <td className="py-1 text-center">400.00</td>
                            <td className="py-1 text-center">500.00</td>
                            <td className="py-1 text-center">12000.00</td>
                        </tr>

                        <tr className="even:bg-gray-100">
                            <td className="py-1 text-center">p109</td>
                            <td className="py-1 text-center">Product2</td>
                            <td className="py-1 text-center">Category2</td>
                            <td className="py-1 text-center">10</td>
                            <td className="py-1 text-center">1000</td>
                            <td className="py-1 text-center">1200</td>
                            <td className="py-1 text-center">10000.00</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}
