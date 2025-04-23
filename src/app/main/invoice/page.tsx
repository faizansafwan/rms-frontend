'use client';

import React, { useState, useEffect } from 'react';

type ProductItem = {
  id: number;
  productId: number;
  productName: string;
  quantity: number;
  sellingPrice: number;
  discount: number;
  total: number;
};

type CustomerInfo = {
  customerId: number;
  name?: string;
  address?: string;
  contactNumber?: string;
};

export default function NewInvoice() {
  const [customer, setCustomer] = useState<CustomerInfo>({
    customerId: 0,
  });
  
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [newProduct, setNewProduct] = useState<Omit<ProductItem, 'id'>>({
    productId: 0,
    productName: '',
    quantity: 0,
    sellingPrice: 0,
    discount: 0,
    total: 0
  });

  const [subTotal, setSubTotal] = useState(0);
  const [paid, setPaid] = useState(0);
  const [balance, setBalance] = useState(0);
  const [totalOutstanding, setTotalOutstanding] = useState(0);

  // Calculate totals whenever products change
  useEffect(() => {
    const newSubTotal = products.reduce((sum, product) => sum + product.total, 0);
    setSubTotal(newSubTotal);
    setBalance(newSubTotal - paid);
  }, [products, paid]);

  const handleAddProduct = () => {
    if (!newProduct.productId || !newProduct.productName || newProduct.quantity <= 0) {
      alert('Please fill in required product fields');
      return;
    }

    const productTotal = (newProduct.quantity * newProduct.sellingPrice) - newProduct.discount;
    
    setProducts([...products, {
      ...newProduct,
      id: products.length + 1,
      total: productTotal
    }]);

    // Reset new product form
    setNewProduct({
      productId: 0,
      productName: '',
      quantity: 0,
      sellingPrice: 0,
      discount: 0,
      total: 0
    });
  };

  const handleSubmitInvoice = async () => {
    if (!customer.customerId) {
      alert('Please select a customer');
      return;
    }

    if (products.length === 0) {
      alert('Please add at least one product');
      return;
    }

    try {
      const invoiceData = {
        customerId: customer.customerId,
        paid: paid,
        invoiceProducts: products.map(product => ({
          productId: product.productId,
          quantity: product.quantity,
          sellingPrice: product.sellingPrice,
          discount: product.discount
        })),
        invoiceStocks: [] // Add stock items if needed
      };

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/Invoice`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(invoiceData)
      });

      if (response.ok) {
        const data = await response.json();
        alert('Invoice created successfully!');
        // Reset form
        setCustomer({
          customerId: 0
        });
        setProducts([]);
        setPaid(0);
        setNewProduct({
          productId: 0,
          productName: '',
          quantity: 0,
          sellingPrice: 0,
          discount: 0,
          total: 0
        });
      } else {
        const error = await response.json();
        alert(error.message || 'Failed to create invoice');
      }
    } catch (error) {
      console.error('Error creating invoice:', error);
      alert('Error creating invoice');
    }
  };

  return (
    <div className="m-5">
      <div className="mx-10">
        <table className="w-full border-collapse">
          <thead className="space-y-4">
            <tr className="h-12">
              <th className="pr-4 text-left">
                <label>Customer Name:</label>
              </th>
              <td>
                <input
                  type="text"
                  placeholder="Enter Name"
                  value={customer.name || ''}
                  onChange={(e) => setCustomer({...customer, name: e.target.value})}
                  className="border border-black p-2 rounded w-full"
                />
              </td>

              <th className="px-4 text-left">
                <label>Customer ID:</label>
              </th>
              <td>
                <input
                  type="number"
                  placeholder="ID"
                  value={customer.customerId || ''}
                  onChange={(e) => setCustomer({...customer, customerId: parseInt(e.target.value) || 0})}
                  className="border border-black p-2 rounded w-full"
                />
              </td>
            </tr>

            <tr className="h-12">
              <th className="pr-4 text-left">
                <label>Customer Address:</label>
              </th>
              <td>
                <input
                  type="text"
                  placeholder="Address"
                  value={customer.address || ''}
                  onChange={(e) => setCustomer({...customer, address: e.target.value})}
                  className="border border-black p-2 rounded w-full"
                />
              </td>

              <th className="px-4 text-left">
                <label>Contact Number:</label>
              </th>
              <td>
                <input
                  type="text"
                  placeholder="Contact No."
                  value={customer.contactNumber || ''}
                  onChange={(e) => setCustomer({...customer, contactNumber: e.target.value})}
                  className="border border-black p-2 rounded w-full"
                />
              </td>
            </tr>
          </thead>
        </table>
      </div>

      <div className="mx-10 my-5">
        <p>
          <strong>Invoice No.: </strong> {/* Will be generated by backend */}
        </p>
      </div>

      <div className="mx-10 my-5 overflow-x-auto">
        <table className="w-full border-collapse">
          <thead className="border-b">
            <tr>
              <th className="p-2 text-center">No.</th>
              <th className="p-2 text-center">Product ID</th>
              <th className="p-2 text-center">Product Name</th>
              <th className="p-2 text-center">Qty</th>
              <th className="p-2 text-center">Unit Price</th>
              <th className="p-2 text-center">Discount</th>
              <th className="p-2 text-center">Total</th>
            </tr>
          </thead>

          <tbody className="border-b">
            {products.map((product, index) => (
              <tr key={product.id} className="even:bg-gray-100">
                <td className="py-1 text-center">{index + 1}</td>
                <td className="py-1 text-center">{product.productId}</td>
                <td className="py-1 text-center">{product.productName}</td>
                <td className="py-1 text-center">{product.quantity}</td>
                <td className="py-1 text-center">{product.sellingPrice.toFixed(2)}</td>
                <td className="py-1 text-center">{product.discount.toFixed(2)}</td>
                <td className="py-1 text-center">{product.total.toFixed(2)}</td>
              </tr>
            ))}

            <tr>
              <td className="py-1 text-center">
                <input type="text" disabled className="w-10 p-1 rounded" />
              </td>
              <td className="py-1 text-center">
                <input
                  type="number"
                  value={newProduct.productId || ''}
                  onChange={(e) => setNewProduct({...newProduct, productId: parseInt(e.target.value) || 0})}
                  className="w-20 p-1 border rounded"
                  placeholder="Product ID"
                />
              </td>
              <td className="py-1 text-center">
                <input
                  type="text"
                  value={newProduct.productName}
                  onChange={(e) => setNewProduct({...newProduct, productName: e.target.value})}
                  className="w-30 p-1 border rounded"
                  placeholder="Product Name"
                />
              </td>
              <td className="py-1 text-center">
                <input
                  type="number"
                  value={newProduct.quantity || ''}
                  onChange={(e) => setNewProduct({...newProduct, quantity: parseInt(e.target.value) || 0})}
                  className="w-20 p-1 border rounded"
                  placeholder="Qty"
                />
              </td>
              <td className="py-1 text-center">
                <input
                  type="number"
                  value={newProduct.sellingPrice || ''}
                  onChange={(e) => setNewProduct({...newProduct, sellingPrice: parseFloat(e.target.value) || 0})}
                  className="w-20 p-1 border rounded"
                  placeholder="Price"
                />
              </td>
              <td className="py-1 text-center">
                <input
                  type="number"
                  value={newProduct.discount || ''}
                  onChange={(e) => setNewProduct({...newProduct, discount: parseFloat(e.target.value) || 0})}
                  className="w-20 p-1 border rounded"
                  placeholder="Discount"
                />
              </td>
              <td className="py-1 text-center">
                <button
                  onClick={handleAddProduct}
                  className="p-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Add
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="mx-10">
        <div className="flex items-center justify-between p-1">
          <p>Sub Total</p>
          <p>{subTotal.toFixed(2)}</p>
        </div>

        <div className="flex items-center justify-between p-1">
          <p>Paid</p>
          <input
            type="number"
            value={paid || ''}
            onChange={(e) => setPaid(parseFloat(e.target.value) || 0)}
            className="border border-black p-1 rounded w-32 text-right"
          />
        </div>

        <div className="border-y flex items-center justify-between p-1">
          <p>Balance</p>
          <p>{balance.toFixed(2)}</p>
        </div>
      </div>

      <div className="m-10">
        <p>Total Outstanding: {totalOutstanding.toFixed(2)}</p>
      </div>

      <div className="flex justify-end m-10">
        <button
          onClick={handleSubmitInvoice}
          className="p-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Create Invoice
        </button>
      </div>
    </div>
  );
}