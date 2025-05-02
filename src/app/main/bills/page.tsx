'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Invoice {
  id: number;
  invoiceDate: string;
  total: number;
  paid: number;
  balance: number;
  customerName: string;
  customerId: number;
  invoiceProducts: {
    productId: number;
    productName: string;
    quantity: number;
    sellingPrice: number;
    discount: number;
    subTotal: number;
  }[];
  invoiceStocks: {
    stockId: number;
  }[];
}

export default function Bills() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/Invoice`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch invoices');
        }

        const data = await response.json();
        setInvoices(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchInvoices();
  }, []);

  const filteredInvoices = invoices.filter(invoice =>
    invoice.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice.id.toString().includes(searchTerm)
  );

  const openInvoiceModal = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedInvoice(null), 300); // Wait for animation to complete
  };

  if (loading) {
    return (
      <div className="m-5 flex items-center justify-center space-x-2">
        <div className="w-4 h-4 rounded-full bg-brown animate-bounce"></div>
        <div className="w-4 h-4 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        <div className="w-4 h-4 rounded-full bg-secondary animate-bounce" style={{ animationDelay: '0.4s' }}></div>
        <span>Loading invoices...</span>
      </div>
    );
  }

  if (error) {
    return <div className="m-5 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="m-5">
      <div className="mx-10">
        <table className="w-full border-collapse">
          <thead className="space-y-1">
            <tr className="h-12">
              <th className="pr-1 text-left">
                <label>Search: </label>
              </th>
              <td colSpan={3}>
                <input
                  type="text"
                  placeholder="Search by Invoice ID or Customer Name"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="border border-black p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                />
              </td>
            </tr>
          </thead>
        </table>
      </div>

      <div className="mx-10 my-5 overflow-x-auto">
        <table className="w-full border-collapse">
          <thead className="border-b">
            <tr>
              <th className="p-2 text-center">Invoice ID</th>
              <th className="p-2 text-center">Billing Date</th>
              <th className="p-2 text-center">Amount</th>
              <th className="p-2 text-center">Customer</th>
              <th className="p-2 text-center">Action</th> 
            </tr>
          </thead>

          <tbody className="border-b">
            {filteredInvoices.length > 0 ? (
              filteredInvoices.map((invoice, index) => (
                <tr 
                  key={invoice.id} 
                  className="even:bg-gray-100 hover:bg-gray-50"
                  style={{
                    animation: `fadeIn 0.7s ease-out ${index * 0.1}s`,
                    animationFillMode: 'both'
                  }}
                >
                  <td className="py-2 text-center">I{invoice.id.toString().padStart(3, '0')}</td>
                  <td className="py-2 text-center">{new Date(invoice.invoiceDate).toLocaleDateString()}</td>
                  <td className="py-2 text-center">{invoice.total.toFixed(2)}</td>
                  <td className="py-2 text-center">{invoice.customerName}</td>
                  <td className="py-2 text-center">
                    <button
                      className="rounded bg-secondary transition ease-in-out duration-1000 p-2 hover:bg-black hover:text-white hover:scale-105"
                      onClick={() => openInvoiceModal(invoice)}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="py-4 text-center text-gray-500">
                  No invoices found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Invoice Detail Modal */}
      <AnimatePresence>
        {isModalOpen && selectedInvoice && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-transparent bg-opacity-50"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.9, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 50 }}
              transition={{ type: 'spring', damping: 25 }}
              className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="bg-secondary text-brown p-4 rounded-t-lg">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold">
                    Invoice #{selectedInvoice.id.toString().padStart(3, '0')}
                  </h2>
                  <button 
                    onClick={closeModal}
                    className="text-white hover:text-gray-200 text-2xl"
                  >
                    &times;
                  </button>
                </div>
                <div className="flex justify-between mt-2">
                  <p>Date: {new Date(selectedInvoice.invoiceDate).toLocaleDateString()}</p>
                  <p>Customer: {selectedInvoice.customerName}</p>
                </div>
              </div>

              {/* Modal Body */}
              <div className="p-6">
                {/* Products Table */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3 text-brown">Products</h3>
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="p-2 text-left">Product</th>
                        <th className="p-2 text-center">Qty</th>
                        <th className="p-2 text-center">Price</th>
                        <th className="p-2 text-center">Discount</th>
                        <th className="p-2 text-center">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedInvoice.invoiceProducts.map((product, index) => (
                        <motion.tr
                          key={product.productId}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="border-b hover:bg-gray-50"
                        >
                          <td className="p-2">{product.productName}</td>
                          <td className="p-2 text-center">{product.quantity}</td>
                          <td className="p-2 text-center">{product.sellingPrice.toFixed(2)}</td>
                          <td className="p-2 text-center">{product.discount.toFixed(2)}</td>
                          <td className="p-2 text-center">{product.subTotal.toFixed(2)}</td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Summary Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-brown mb-2">Payment Summary</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Total:</span>
                        <span>{selectedInvoice.total.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Paid:</span>
                        <span>{selectedInvoice.paid.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between font-bold">
                        <span>Balance:</span>
                        <span className={selectedInvoice.balance > 0 ? 'text-red-600' : 'text-green-600'}>
                          {selectedInvoice.balance.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>

                  
                </div>
              </div>

              {/* Modal Footer */}
              <div className="bg-gray-100 p-4 rounded-b-lg flex justify-end space-x-3">
                <button
                  onClick={closeModal}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition"
                >
                  Close
                </button>
                <button
                  className="px-4 py-2 bg-brown text-white rounded hover:bg-brown/90 cursor-pointer transition"
                  onClick={() => {
                    console.log('Print invoice:', selectedInvoice.id);
                  }}
                >
                  Print Invoice
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
    </div>
  );
}