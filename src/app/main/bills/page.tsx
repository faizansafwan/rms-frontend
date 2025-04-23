'use client';

import React, { useState, useEffect } from 'react';

interface Invoice {
  id: number;
  invoiceDate: string;
  total: number;
  customerName: string;
}

export default function Bills() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

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
        setInvoices(data.map((invoice: any) => ({
          id: invoice.id,
          invoiceDate: new Date(invoice.invoiceDate).toLocaleDateString(),
          total: invoice.total,
          customerName: invoice.customerName
        })))
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

  if (loading) {
    return <div className="m-5">Loading invoices...</div>;
  }

  if (error) {
    return <div className="m-5 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="m-5">
      <div className="mx-10">
        <table className="w-full border-collapse">
          <thead className="space-y-4">
            <tr className="h-12">
              <th className="pr-4 text-left">
                <label>Search: </label>
              </th>
              <td colSpan={3}>
                <input
                  type="text"
                  placeholder="Search by Invoice ID or Customer Name"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="border border-black p-2 rounded w-full"
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
              filteredInvoices.map((invoice) => (
                <tr key={invoice.id} className="even:bg-gray-100 hover:bg-gray-50">
                  <td className="py-2 text-center">I{invoice.id.toString().padStart(3, '0')}</td>
                  <td className="py-2 text-center">{invoice.invoiceDate}</td>
                  <td className="py-2 text-center">{invoice.total.toFixed(2)}</td>
                  <td className="py-2 text-center">{invoice.customerName}</td>
                  <td className="py-2 text-center">
                    <button
                      className="rounded bg-secondary transition ease-in-out duration-300 p-2 hover:bg-black hover:text-white"
                      onClick={() => {
                        // Handle view action
                        console.log('View invoice:', invoice.id);
                      }}
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
    </div>
  );
}