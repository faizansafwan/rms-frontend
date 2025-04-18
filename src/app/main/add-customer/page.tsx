'use client';

import React, { useState, useRef, KeyboardEvent } from 'react';

type Customer = {
  customerName: string;
  email: string;
  phoneNumber: string;
  address: string;
  creditLimit: number;
  openingBalance: number;
};

export default function AddCustomer() {
  const [customerData, setCustomerData] = useState<Customer>({
    customerName: '',
    email: '',
    phoneNumber: '',
    address: '',
    creditLimit: 0,
    openingBalance: 0,
  });

  // Create refs for each input
  const customerNameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const phoneNumberRef = useRef<HTMLInputElement>(null);
  const addressRef = useRef<HTMLInputElement>(null);
  const creditLimitRef = useRef<HTMLInputElement>(null);
  const openingBalanceRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomerData({
      ...customerData,
      [e.target.name]: e.target.value,
    });
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, fieldName: string) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      
      // Validate customer name if moving from customerName field
      if (fieldName === 'customerName' && !customerData.customerName.trim()) {
        alert('Customer name is required!');
        return;
      }

      // Move focus to next field
      switch (fieldName) {
        case 'customerName':
          emailRef.current?.focus();
          break;
        case 'email':
          phoneNumberRef.current?.focus();
          break;
        case 'phoneNumber':
          addressRef.current?.focus();
          break;
        case 'address':
          creditLimitRef.current?.focus();
          break;
        case 'creditLimit':
          openingBalanceRef.current?.focus();
          break;
        case 'openingBalance':
          handleSubmit(); // Submit when Enter is pressed on last field
          break;
      }
    }
  };

  const handleSubmit = async () => {
    // Validate required fields
    if (!customerData.customerName.trim()) {
      alert('Customer name is required!');
      customerNameRef.current?.focus();
      return;
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/Customer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          customerName: customerData.customerName,
          email: customerData.email,
          phoneNumber: customerData.phoneNumber,
          address: customerData.address,
          creditLimit: Number(customerData.creditLimit),
          openingBalance: Number(customerData.openingBalance),
        }),
      });

      if (res.ok) {
        alert('Customer added successfully!');
        setCustomerData({
          customerName: '',
          email: '',
          phoneNumber: '',
          address: '',
          creditLimit: 0,
          openingBalance: 0,
        });
        // Return focus to first field
        customerNameRef.current?.focus();
      } else {
        const error = await res.json();
        alert(error.message || 'Failed to add customer.');
      }
    } catch (err) {
      console.error(err);
      alert('Error occurred while adding customer.');
    }
  };

  return (
    <div className="m-5">
      <div className="mx-10">
        <div className="border-b p-1 text-[18px]">
          <strong>
            <h1>Customer Personal Details</h1>
          </strong>
        </div>

        <div className="m-5">
          <table className="w-full border-collapse">
            <thead className="space-y-4">
              <tr className="h-12">
                <th className="pr-4 text-left"><label>Customer ID:</label></th>
                <td><input type="text" placeholder="Auto-generated" disabled className="border border-black p-2 rounded w-full bg-gray-100" /></td>

                <th className="px-4 text-left"><label>Customer Name:</label></th>
                <td>
                  <input 
                    type="text" 
                    name="customerName" 
                    ref={customerNameRef}
                    value={customerData.customerName} 
                    onChange={handleChange} 
                    onKeyDown={(e) => handleKeyDown(e, 'customerName')}
                    placeholder="John Doe" 
                    className="border border-black p-2 rounded w-full" 
                  />
                </td>
              </tr>

              <tr className="h-12">
                <th className="pr-4 text-left"><label>Email:</label></th>
                <td>
                  <input 
                    type="email" 
                    name="email" 
                    ref={emailRef}
                    value={customerData.email} 
                    onChange={handleChange} 
                    onKeyDown={(e) => handleKeyDown(e, 'email')}
                    placeholder="abc@gmail.com" 
                    className="border border-black p-2 rounded w-full" 
                  />
                </td>

                <th className="px-4 text-left"><label>Phone:</label></th>
                <td>
                  <input 
                    type="text" 
                    name="phoneNumber" 
                    ref={phoneNumberRef}
                    value={customerData.phoneNumber} 
                    onChange={handleChange} 
                    onKeyDown={(e) => handleKeyDown(e, 'phoneNumber')}
                    placeholder="0711234567" 
                    className="border border-black p-2 rounded w-full" 
                  />
                </td>
              </tr>

              <tr className="h-12 w-full">
                <th className="pr-4 text-left w-1/4"><label>Address:</label></th>
                <td colSpan={3}>
                  <input 
                    type="text" 
                    name="address" 
                    ref={addressRef}
                    value={customerData.address} 
                    onChange={handleChange} 
                    onKeyDown={(e) => handleKeyDown(e, 'address')}
                    placeholder="Galle Road, Colombo" 
                    className="border border-black p-2 rounded w-full" 
                  />
                </td>
              </tr>
            </thead>
          </table>
        </div>

        <div className="border-b p-1 text-[18px]">
          <strong>
            <h1>Customer Accounting</h1>
          </strong>
        </div>

        <div className="m-5">
          <table className="w-full border-collapse">
            <thead className="space-y-4">
              <tr className="h-12">
                <th className="pr-4 text-left"><label>Credit Limit:</label></th>
                <td>
                  <input 
                    type="text" 
                    name="creditLimit" 
                    ref={creditLimitRef}
                    value={customerData.creditLimit} 
                    onChange={handleChange} 
                    onKeyDown={(e) => handleKeyDown(e, 'creditLimit')}
                    placeholder="50000.00" 
                    className="border border-black p-2 rounded w-full" 
                  />
                </td>

                <th className="px-4 text-left"><label>Opening Balance:</label></th>
                <td>
                  <input 
                    type="text" 
                    name="openingBalance" 
                    ref={openingBalanceRef}
                    value={customerData.openingBalance} 
                    onChange={handleChange} 
                    onKeyDown={(e) => handleKeyDown(e, 'openingBalance')}
                    placeholder="33500.00" 
                    className="border border-black p-2 rounded w-full" 
                  />
                </td>
              </tr>
            </thead>
          </table>
        </div>

        <div className="flex justify-end m-5">
          <button 
            onClick={handleSubmit} 
            className="rounded bg-secondary transition ease-in-out cursor-pointer duration-300 p-2 hover:bg-black hover:text-white"
          >
            Add Customer
          </button>
        </div>
      </div>
    </div>
  );
}