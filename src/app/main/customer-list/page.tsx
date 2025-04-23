'use client';

import React, { useEffect, useState } from 'react';

type Customer = {
  id: number;
  customerName: string;
  email: string;
  phoneNumber: string;
  address: string;
  creditLimit: number;
  openingBalance: number;
  lastInvoice?: {
    id: number;
    total: number;
    invoiceDate: string;
  };
};

export default function CustomerList(): JSX.Element {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [filters, setFilters] = useState({
    customerId: '',
    customerName: '',
    phone: '',
    email: '',
    creditBalance: '',
    lastBill: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const customersResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/Customer/customer-list`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        );

        if (!customersResponse.ok) {
          throw new Error('Failed to fetch customers');
        }

        const customersData = await customersResponse.json();

        const customersWithInvoices = await Promise.all(
          customersData.map(async (customer: Customer) => {
            try {
              const invoiceResponse = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/Invoice?customerId=${customer.id}`,
                {
                  headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                  },
                }
              );

              if (invoiceResponse.ok) {
                const invoices = await invoiceResponse.json();
                if (invoices.length > 0) {
                  const lastInvoice = invoices.sort(
                    (a: any, b: any) =>
                      new Date(b.invoiceDate).getTime() - new Date(a.invoiceDate).getTime()
                  )[0];

                  return {
                    ...customer,
                    lastInvoice: {
                      id: lastInvoice.id,
                      total: lastInvoice.total,
                      invoiceDate: lastInvoice.invoiceDate,
                    },
                  };
                }
              }
              return customer;
            } catch (error) {
              console.error(`Error fetching invoices for customer ${customer.id}:`, error);
              return customer;
            }
          })
        );

        setCustomers(customersWithInvoices);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error instanceof Error ? error.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle filter change
  const handleFilterChange = (field: string, value: string) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const filteredCustomers = customers.filter((customer) => {
    return (
      (`c${customer.id}`.toLowerCase().includes(filters.customerId.toLowerCase())) &&
      customer.customerName.toLowerCase().includes(filters.customerName.toLowerCase()) &&
      customer.phoneNumber.includes(filters.phone) &&
      customer.email.toLowerCase().includes(filters.email.toLowerCase()) &&
      (filters.creditBalance === '' || customer.openingBalance.toFixed(2).includes(filters.creditBalance)) &&
      (filters.lastBill === '' ||
        (customer.lastInvoice &&
          customer.lastInvoice.total.toFixed(2).includes(filters.lastBill)))
    );
  });

  if (loading) {
    return (
      <div className="m-5 flex items-center justify-center space-x-2">
        <div className="w-4 h-4 rounded-full bg-brown animate-bounce"></div>
        <div className="w-4 h-4 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        <div className="w-4 h-4 rounded-full bg-secondary animate-bounce" style={{ animationDelay: '0.4s' }}></div>
        <span>Loading customers...</span>
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
        .skeleton-row {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
      `}</style>

      <div className="mx-10">
        <table className="w-full border-collapse">
          <thead>
            <tr className="h-12">
              <th className="pr-4 text-left">
                <label htmlFor="customerId">Customer ID:</label>
              </th>
              <td>
                <input
                  id="customerId"
                  type="text"
                  value={filters.customerId}
                  onChange={(e) => handleFilterChange('customerId', e.target.value)}
                  placeholder="c213"
                  className="border border-black p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                />
              </td>

              <th className="px-4 text-left">
                <label htmlFor="customerName">Customer Name:</label>
              </th>
              <td>
                <input
                  id="customerName"
                  type="text"
                  value={filters.customerName}
                  onChange={(e) => handleFilterChange('customerName', e.target.value)}
                  placeholder="smith"
                  className="border border-black p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                />
              </td>
            </tr>

            <tr className="h-12">
              <th className="pr-4 text-left">
                <label htmlFor="phone">Phone:</label>
              </th>
              <td>
                <input
                  id="phone"
                  type="text"
                  value={filters.phone}
                  onChange={(e) => handleFilterChange('phone', e.target.value)}
                  placeholder="0711234567"
                  className="border border-black p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                />
              </td>

              <th className="px-4 text-left">
                <label htmlFor="email">Email:</label>
              </th>
              <td>
                <input
                  id="email"
                  type="text"
                  value={filters.email}
                  onChange={(e) => handleFilterChange('email', e.target.value)}
                  placeholder="abc@gmail.com"
                  className="border border-black p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                />
              </td>
            </tr>

            <tr className="h-12">
              <th className="pr-4 text-left">
                <label htmlFor="creditBalance">Credit Balance:</label>
              </th>
              <td>
                <input
                  id="creditBalance"
                  type="text"
                  value={filters.creditBalance}
                  onChange={(e) => handleFilterChange('creditBalance', e.target.value)}
                  placeholder="15000.00"
                  className="border border-black p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                />
              </td>

              <th className="px-4 text-left">
                <label htmlFor="lastBill">Last Bill:</label>
              </th>
              <td>
                <input
                  id="lastBill"
                  type="text"
                  value={filters.lastBill}
                  onChange={(e) => handleFilterChange('lastBill', e.target.value)}
                  placeholder="6000.00"
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
              <th className="p-2 text-left">Customer ID</th>
              <th className="p-2 text-left">Name</th>
              <th className="p-2 text-left">Email</th>
              <th className="p-2 text-left">Phone</th>
              <th className="p-2 text-left">Address</th>
              <th className="p-2 text-right">Credit Balance</th>
              <th className="p-2 text-right">Last Bill</th>
            </tr>
          </thead>

          <tbody>
            {filteredCustomers.length > 0 ? (
              filteredCustomers.map((customer, index) => (
                <tr 
                  key={customer.id} 
                  className="even:bg-gray-100 hover:bg-gray-50"
                  style={{
                    animation: `fadeIn 0.5s ease-out ${index * 0.1}s`,
                    animationFillMode: 'both'
                  }}
                >
                  <td className="py-2 px-2 text-left">{`c${customer.id}`}</td>
                  <td className="py-2 px-2 text-left">{customer.customerName}</td>
                  <td className="py-2 px-2 text-left">{customer.email}</td>
                  <td className="py-2 px-2 text-left">{customer.phoneNumber}</td>
                  <td className="py-2 px-2 text-left">{customer.address}</td>
                  <td className="py-2 px-2 text-right">{customer.openingBalance.toFixed(2)}</td>
                  <td className="py-2 px-2 text-right">
                    {customer.lastInvoice ? (
                      <span 
                        className="inline-block transition-all hover:scale-105"
                        title={`Invoice #${customer.lastInvoice.id} (${new Date(customer.lastInvoice.invoiceDate).toLocaleDateString()})`}
                      >
                        {customer.lastInvoice.total.toFixed(2)}
                      </span>
                    ) : (
                      'N/A'
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td 
                  colSpan={7} 
                  className="text-center py-4 text-gray-500"
                  style={{
                    animation: 'fadeIn 0.5s ease-out',
                    animationFillMode: 'both'
                  }}
                >
                  No customers match your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}