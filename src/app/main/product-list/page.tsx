'use client';

import React, { JSX, useEffect, useState } from 'react';

type Product = {
    productId: number;  // Changed from string to number
    productName: string;
    category: string;
    totalStock: number;
    costPrice: number;
    sellingPrice: number;
    total: number;
};

export default function ProductList(): JSX.Element {
    const [productList, setProductList] = useState<Product[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [filters, setFilters] = useState({
        productId: '',
        productName: '',
        category: ''
    });

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/product/product-stock`, 
                    {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem('token')}`,
                            'Content-Type': 'application/json',
                        },
                    }
                );

                if (!response.ok) {
                    throw new Error('Failed to fetch products');
                }

                const data = await response.json();
                setProductList(data);
                setFilteredProducts(data);

            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };

        fetchProducts();
    }, []);

    useEffect(() => {
        const filtered = productList.filter(product => {
            // Convert productId to string for comparison
            const productIdStr = product.productId.toString();
            const matchesId = productIdStr.toLowerCase().includes(filters.productId.toLowerCase());
            const matchesName = product.productName.toLowerCase().includes(filters.productName.toLowerCase());
            const matchesCategory = filters.category === '' || product.category === filters.category;
            
            return matchesId && matchesName && matchesCategory;
        });
        setFilteredProducts(filtered);
    }, [filters, productList]);

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { id, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [id]: value
        }));
    };

    // Get unique categories for dropdown
    const categories = [...new Set(productList.map(product => product.category))];

    return (
        <div className="m-5">
            <div className="mx-10">
                <table className="w-full border-collapse">
                    <thead className="space-y-4">
                        <tr className="h-12">
                            <th className="pr-4 text-left">
                                <label htmlFor="productId">Product ID:</label>
                            </th>
                            <td>
                                <input
                                    id="productId"
                                    type="text"
                                    placeholder="Enter ID"
                                    className="border border-black p-2 rounded w-full"
                                    value={filters.productId}
                                    onChange={handleFilterChange}
                                />
                            </td>

                            <th className="px-4 text-left">
                                <label htmlFor="productName">Product Name:</label>
                            </th>
                            <td>
                                <input
                                    id="productName"
                                    type="text"
                                    placeholder="Enter Name"
                                    className="border border-black p-2 rounded w-full"
                                    value={filters.productName}
                                    onChange={handleFilterChange}
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
                                    value={filters.category}
                                    onChange={handleFilterChange}
                                >
                                    <option value="">All Categories</option>
                                    {categories.map(category => (
                                        <option key={category} value={category}>{category}</option>
                                    ))}
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
                        {filteredProducts.map((product) => (
                            <tr key={product.productId} className="even:bg-gray-100">
                                <td className="py-1 text-center">P{product.productId}</td>
                                <td className="py-1 text-center">{product.productName}</td>
                                <td className="py-1 text-center">{product.category}</td>
                                <td className="py-1 text-center">{product.totalStock}</td>
                                <td className="py-1 text-center">{product.costPrice.toFixed(2)}</td>
                                <td className="py-1 text-center">{product.sellingPrice.toFixed(2)}</td>
                                <td className="py-1 text-center">{product.total.toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}