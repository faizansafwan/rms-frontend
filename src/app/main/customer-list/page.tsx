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
};

export default function CustomerList(): JSX.Element {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/Customer/customer-list`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        const data = await response.json();

        if (response.ok) {
          setCustomers(data);
        } else {
          alert(data.message || 'Failed to fetch customers');
        }
      } catch (error) {
        console.error('Error fetching customers:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  return (
    <div className="m-5">
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
                  placeholder="c213"
                  className="border border-black p-2 rounded w-full"
                />
              </td>

              <th className="px-4 text-left">
                <label htmlFor="customerName">Customer Name:</label>
              </th>
              <td>
                <input
                  id="customerName"
                  type="text"
                  placeholder="smith"
                  className="border border-black p-2 rounded w-full"
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
                  placeholder="0711234567"
                  className="border border-black p-2 rounded w-full"
                />
              </td>

              <th className="px-4 text-left">
                <label htmlFor="email">Email:</label>
              </th>
              <td>
                <input
                  id="email"
                  type="text"
                  placeholder="abc@gmail.com"
                  className="border border-black p-2 rounded w-full"
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
                  placeholder="15000.00"
                  className="border border-black p-2 rounded w-full"
                />
              </td>

              <th className="px-4 text-left">
                <label htmlFor="lastBill">Last Bill:</label>
              </th>
              <td>
                <input
                  id="lastBill"
                  type="text"
                  placeholder="6000.00"
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
            {loading ? (
              <tr>
                <td colSpan={7} className="text-center py-4">Loading...</td>
              </tr>
            ) : customers.length > 0 ? (
              customers.map((customer) => (
                <tr key={customer.id} className="even:bg-gray-100">
                  <td className="py-1 px-2 text-left">{`c${customer.id}`}</td>
                  <td className="py-1 px-2 text-left">{customer.customerName}</td>
                  <td className="py-1 px-2 text-left">{customer.email}</td>
                  <td className="py-1 px-2 text-left">{customer.phoneNumber}</td>
                  <td className="py-1 text-left">{customer.address}</td>
                  <td className="py-1 px-2 text-right">{customer.openingBalance.toFixed(2)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="text-center py-4">No customers found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
