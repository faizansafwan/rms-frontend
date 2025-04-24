'use client';

import { ChangeEvent, useState, useEffect } from 'react';

type Product = {
    productName: string;
    description: string;
    category: string;
    supplier: string;
};

export default function AddProduct() {
    const [productList, setProductList] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState<Product>({
        productName: '',
        description: '',
        category: '',
        supplier: '',
    });

    const [selectedProductIndex, setSelectedProductIndex] = useState<number | null>(null);
    const [showModal, setShowModal] = useState(false);


    useEffect(() => {
        // Simulate data loading
        const timer = setTimeout(() => {
            setLoading(false);
        }, 1000);
        return () => clearTimeout(timer);
    }, []);

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleView = (index: number) => {
        setSelectedProductIndex(index);
        setShowModal(true);
    };

    const handleModify = () => {
        if (selectedProductIndex !== null) {
            const productToEdit = productList[selectedProductIndex];
            setFormData(productToEdit);
            setShowModal(false);
        }
    };
    
    const handleDelete = () => {
        if (selectedProductIndex !== null) {
            const updatedList = productList.filter((_, idx) => idx !== selectedProductIndex);
            setProductList(updatedList);
            setShowModal(false);
        }
    };
    

    const handleAddProduct = () => {
        const { productName, category, supplier } = formData;
        if (!productName || !category || !supplier) {
            alert('Please fill in all required fields!');
            return;
        }

        setProductList([...productList, { ...formData }]);
        setFormData({
            productName: '',
            description: '',
            category: '',
            supplier: '',
        });
    };

    const handleSubmit = async () => {
        if (productList.length === 0) {
            alert("No products to save!");
            return;
        }

        setSubmitting(true);
        try {
            const token = localStorage.getItem("token");
            
            for (const product of productList) {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/Product`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        productName: product.productName,
                        productDescription: product.description,
                        productCategory: product.category,
                        supplierName: product.supplier,
                    }),
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || "Failed to save product");
                }
            }

            alert("All products saved successfully!");
            setProductList([]);
        } catch (error) {
            console.error("Error during product submission:", error);
            alert(error instanceof Error ? error.message : "Something went wrong while saving.");
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
                <p className="text-lg">Loading product form...</p>
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
                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.5; }
                }
            `}</style>

            <div className="mx-10">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="h-12">
                            <th className="pr-4 text-left"><label>Product Name:</label></th>
                            <td>
                                <input
                                    type="text"
                                    name="productName"
                                    value={formData.productName}
                                    onChange={handleChange}
                                    placeholder="Enter Product Name"
                                    className="border border-black p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                />
                            </td>
                            <th className="px-4 text-left"><label>Category:</label></th>
                            <td>
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    className="border border-black p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                >
                                    <option value="">Select</option>
                                    <option value="Category 1">Category 1</option>
                                    <option value="Category 2">Category 2</option>
                                    <option value="Category 3">Category 3</option>
                                </select>
                            </td>
                        </tr>

                        <tr className="h-12">
                            <th className="pr-4 text-left"><label>Product Description:</label></th>
                            <td>
                                <input
                                    type="text"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    placeholder="Enter Description"
                                    className="border border-black p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                />
                            </td>
                            <th className="px-4 text-left"><label>Supplier:</label></th>
                            <td>
                                <select
                                    name="supplier"
                                    value={formData.supplier}
                                    onChange={handleChange}
                                    className="border border-black p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                >
                                    <option value="">Select</option>
                                    <option value="Supplier 1">Supplier 1</option>
                                    <option value="Supplier 2">Supplier 2</option>
                                    <option value="Supplier 3">Supplier 3</option>
                                </select>
                            </td>
                        </tr>
                    </thead>
                </table>

                <div className="flex justify-end my-5">
                    <button
                        onClick={handleAddProduct}
                        className="rounded bg-secondary transition ease-in-out duration-300 p-2 px-4 hover:bg-black hover:text-white hover:scale-105"
                    >
                        Add product
                    </button>
                </div>
            </div>

            <div className="mx-10 my-5 overflow-x-auto">
                <table className="w-full border-collapse">
                    <thead className="border-b">
                        <tr>
                            <th className="p-2 text-center">Product Name</th>
                            <th className="p-2 text-center">Description</th>
                            <th className="p-2 text-center">Category</th>
                            <th className="p-2 text-center">Supplier</th>
                            <th className="p-2 text-center">Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {productList.map((product, index) => (
                            <tr 
                                key={index} 
                                className="even:bg-gray-100 hover:bg-gray-50"
                                style={{
                                    animation: `fadeIn 0.3s ease-out ${index * 0.05}s`,
                                    animationFillMode: 'both'
                                }}
                            >
                                <td className="py-2 text-center">{product.productName}</td>
                                <td className="py-2 text-center">{product.description}</td>
                                <td className="py-2 text-center">{product.category}</td>
                                <td className="py-2 text-center">{product.supplier}</td>
                                <td className="py-2 text-center">
                                    <button 
                                    onClick={() => handleView(index)}
                                    className="rounded text-brown border border-brown transition ease-in-out duration-300 p-1 px-2 hover:bg-primary hover:border-primary hover:text-white">
                                        View
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="flex justify-start m-10">
                <button
                    onClick={handleSubmit}
                    disabled={submitting || productList.length === 0}
                    className={`p-2 px-6 rounded transition-all duration-300 flex items-center justify-center
                        ${submitting 
                            ? 'bg-gray-400 cursor-not-allowed' 
                            : 'bg-black text-white hover:bg-gray-800 hover:shadow-md'}
                        ${productList.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}
                    `}
                >
                    {submitting ? (
                        <>
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Saving...
                        </>
                    ) : (
                        'Save product'
                    )}
                </button>
            </div>

            {showModal && selectedProductIndex !== null && (
                <div className="fixed inset-0  bg-opacity-90 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-lg p-4 w-[90%] max-w-sm animate-fadeIn">
                        <h2 className="text-xl font-semibold mb-4 text-center">Product Options</h2>
                        <p className="mb-2"><strong>Name:</strong> {productList[selectedProductIndex].productName}</p>
                        <p className="mb-2"><strong>Description:</strong> {productList[selectedProductIndex].description}</p>
                        <p className="mb-2"><strong>Category:</strong> {productList[selectedProductIndex].category}</p>
                        <p className="mb-4"><strong>Supplier:</strong> {productList[selectedProductIndex].supplier}</p>

                        <div className="flex justify-between gap-4">
                            <button onClick={handleModify} className="flex-1 bg-secondary hover:opacity-80 text-white p-2 rounded">Modify</button>
                            <button onClick={handleDelete} className="flex-1 bg-brown hover:opacity-80 text-white p-2 rounded">Delete</button>
                        </div>

                        <button
                            onClick={() => setShowModal(false)}
                            className="mt-4 w-full bg-gray-300 hover:bg-gray-400 text-black p-2 rounded"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}

        </div>
    );
}