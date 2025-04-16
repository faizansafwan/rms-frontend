'use client';

import React from 'react';

export default function CustomerList(): JSX.Element {
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
              <th className="p-2 text-center">Customer ID</th>
              <th className="p-2 text-center">Name</th>
              <th className="p-2 text-center">Email</th>
              <th className="p-2 text-center">Phone</th>
              <th className="p-2 text-center">Address</th>
              <th className="p-2 text-center">Credit Balance</th>
              <th className="p-2 text-center">Last Bill</th>
            </tr>
          </thead>

          <tbody>
            <tr className="even:bg-gray-100">
              <td className="py-1 text-center">c108</td>
              <td className="py-1 text-center">Customer1</td>
              <td className="py-1 text-center">customer1@gmail.com</td>
              <td className="py-1 text-center">075342342</td>
              <td className="py-1 text-center">G 23, Colombo road, Kandy</td>
              <td className="py-1 text-right">15000.00</td>
              <td className="py-1 text-right">7800.00</td>
            </tr>

            <tr className="even:bg-gray-100">
              <td className="py-1 text-center">c109</td>
              <td className="py-1 text-center">Customer2</td>
              <td className="py-1 text-center">customer2@gmail.com</td>
              <td className="py-1 text-center">0748563552</td>
              <td className="py-1 text-center">G 23, Colombo road, Kandy</td>
              <td className="py-1 text-right">37300.00</td>
              <td className="py-1 text-right">13700.00</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
