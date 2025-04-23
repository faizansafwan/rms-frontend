'use client';

import { ChangeEvent, useState } from 'react';

type Product = {
    productName: string;
    description: string;
    category: string;
    supplier: string;
};



export default function AddProduct() {
    const [productList, setProductList] = useState<Product[]>([]);
    const [formData, setFormData] = useState<Product>({
        productName: '',
        description: '',
        category: '',
        supplier: '',
    });

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleAddProduct = () => {
        const { productName, category, supplier } = formData;
        if (!productName || !category || !supplier) {
            alert('Please fill in all fields!');
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
    
        try {
            const token = localStorage.getItem("token"); // Or wherever you're storing it
    
            for (const product of productList) {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/Product`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`, // if you're using JWT Auth
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
                    console.error("Failed to save product:", errorData);
                    alert(`Failed to save: ${errorData.message}`);
                    return;
                }
            }
    
            alert("All products saved successfully!");
            setProductList([]); // Clear list after saving
        } catch (error) {
            console.error("Error during product submission:", error);
            alert("Something went wrong while saving.");
        }
    };
    


    return (
        <div className="m-5">
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
                                    className="border border-black p-2 rounded w-full"
                                />
                            </td>
                            <th className="px-4 text-left"><label>Category:</label></th>
                            <td>
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    className="border border-black p-2 rounded w-full"
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
                                    className="border border-black p-2 rounded w-full"
                                />
                            </td>
                            <th className="px-4 text-left"><label>Supplier:</label></th>
                            <td>
                                <select
                                    name="supplier"
                                    value={formData.supplier}
                                    onChange={handleChange}
                                    className="border border-black p-2 rounded w-full"
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
                    <input
                        type="button"
                        value="Add product"
                        onClick={handleAddProduct}
                        className="rounded bg-secondary transition ease-in-out cursor-pointer duration-300 p-2 hover:bg-black hover:text-white"
                    />
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
                            <tr key={index} className="even:bg-gray-100">
                                <td className="py-1 text-center">{product.productName}</td>
                                <td className="py-1 text-center">{product.description}</td>
                                <td className="py-1 text-center">{product.category}</td>
                                <td className="py-1 text-center">{product.supplier}</td>
                                <td className="py-1 text-center">
                                    <button className="rounded text-brown border border-brown transition ease-in-out cursor-pointer duration-300 p-1 px-2 hover:bg-primary hover:border-primary">
                                        View
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="flex justify-start m-10">
                <input
                    type="submit"
                    onClick={handleSubmit}
                    className="p-2 bg-black text-white rounded transition ease-in-out cursor-pointer duration-300 hover:opacity-75"
                    value="Save product"
                />
            </div>
        </div>
    );
}
