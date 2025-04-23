'use client';

import React, { JSX, useEffect, useState } from 'react';

type Product = {
    productId: number;
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
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

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
                setError(error instanceof Error ? error.message : 'An unknown error occurred');
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    useEffect(() => {
        const filtered = productList.filter(product => {
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

    const categories = [...new Set(productList.map(product => product.category))];

    if (loading) {
        return (
            <div className="m-5 flex items-center justify-center space-x-2">
                <div className="w-4 h-4 rounded-full bg-brown animate-bounce"></div>
                <div className="w-4 h-4 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-4 h-4 rounded-full bg-secondary animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                <span>Loading products...</span>
            </div>
        );
    }

    if (error) {
        return <div className="m-5 text-red-500">Error: {error}</div>;
    }

    return (
        <div className="m-5">
            <style jsx global>{`
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                        transform: translateY(10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `}</style>

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
                                    className="border border-black p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
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
                                    className="border border-black p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
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
                                    className="border border-black p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
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
                        {filteredProducts.length > 0 ? (
                            filteredProducts.map((product, index) => (
                                <tr 
                                    key={product.productId} 
                                    className="even:bg-gray-100 hover:bg-gray-50"
                                    style={{
                                        animation: `fadeIn 0.5s ease-out ${index * 0.05}s`,
                                        animationFillMode: 'both'
                                    }}
                                >
                                    <td className="py-2 text-center">P{product.productId}</td>
                                    <td className="py-2 text-center">{product.productName}</td>
                                    <td className="py-2 text-center">{product.category}</td>
                                    <td className="py-2 text-center">{product.totalStock}</td>
                                    <td className="py-2 text-center">{product.costPrice.toFixed(2)}</td>
                                    <td className="py-2 text-center">{product.sellingPrice.toFixed(2)}</td>
                                    <td className="py-2 text-center">{product.total.toFixed(2)}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={7} className="py-4 text-center text-gray-500">
                                    No products found matching your criteria
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}