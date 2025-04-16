'use client';

import React from 'react';

export default function AddStock(): JSX.Element {
    return (
        <div className="m-5">
            <div className="mx-10 my-5 overflow-x-auto">
                <table className="w-full border-collapse">
                    <thead className="border-b">
                        <tr>
                            <th className="p-2 text-center">Product ID</th>
                            <th className="p-2 text-center">Cost</th>
                            <th className="p-2 text-center">Selling Price</th>
                            <th className="p-2 text-center" >Current Inventory</th>
                            <th className="p-2 text-center">Stock Adjustment</th>
                            <th className="p-2 text-center">New Inventory</th>
                            <th className="p-2 text-center">Total</th>
                        </tr>
                    </thead>

                    <tbody>
                        <tr className="even:bg-gray-100">
                            <td className="py-1 text-center">P104</td>
                            <td className="py-1 text-center">200.00</td>
                            <td className="py-1 text-center">450.00</td>
                            <td className="py-1 text-center">8</td>
                            <td className="py-1 text-center">5</td>
                            <td className="py-1 text-center">13</td>
                            <td className="py-1 text-center">1000.00</td>
                        </tr>

                        <tr className="even:bg-gray-100">
                            <td className="py-1 text-center">P102</td>
                            <td className="py-1 text-center">540.00</td>
                            <td className="py-1 text-center">710.00</td>
                            <td className="py-1 text-center">9</td>
                            <td className="py-1 text-center">10</td>
                            <td className="py-1 text-center">19</td>
                            <td className="py-1 text-center">5400.00</td>
                        </tr>

                        <tr className="border-b">
                            <td className="py-1 text-center">
                                <input type="text" className="w-15 p-1 border rounded" />
                            </td>
                            <td className="py-1 text-center">
                                <input type="text" className="w-20 p-1 border rounded" />
                            </td>
                            <td className="py-1 text-center">
                                <input type="text" className="w-30 p-1 border rounded" />
                            </td>
                            <td className="py-1 text-center">
                                <input type="text" className="w-20 p-1 border rounded" disabled />
                            </td>
                            <td className="py-1 text-center">
                                <input type="text" className="w-20 p-1 border rounded" />
                            </td>
                            <td className="py-1 text-center">
                                <input type="text" className="w-20 p-1 border rounded" />
                            </td>
                            <td className="py-1 text-center"></td>
                        </tr>

                        <tr>
                            <td className="py-1 text-center"></td>
                            <td className="py-1 text-center"></td>
                            <td className="py-1 text-center"></td>
                            <td className="py-1 text-center">17</td>
                            <td className="py-1 text-center">15</td>
                            <td className="py-1 text-center">32</td>
                            <td className="py-1 text-center">6400.00</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div className="flex justify-start m-10">
                <input
                    type="submit"
                    className="p-2 bg-black text-white rounded transition ease-in-out cursor-pointer duration-300 hover:opacity-75"
                    value="Save Stock"
                />
            </div>
        </div>
    );
}
