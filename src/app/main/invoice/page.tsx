'use client';

import React, { useState, useEffect, useRef } from 'react';

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
  id: number;
  customerName: string;
  email?: string;
  phoneNumber: string;
  address: string;
  creditLimit: number;
  openingBalance: number;
};

type FormCustomer = {
  customerId: number;
  name?: string;
  address?: string;
  contactNumber?: string;
  email?: string;
  openingBalance?: number;
};

export default function NewInvoice() {
  const [customer, setCustomer] = useState<FormCustomer>({
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
  const [customersList, setCustomersList] = useState<CustomerInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [filteredCustomers, setFilteredCustomers] = useState<CustomerInfo[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1);
  const suggestionsRef = useRef<HTMLUListElement>(null);
  const [productsList, setProductsList] = useState<ProductItem[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<ProductItem[]>([]);
  const [showProductSuggestions, setShowProductSuggestions] = useState(false);
  const [activeProductSuggestionIndex, setActiveProductSuggestionIndex] = useState(-1);
  const productSuggestionsRef = useRef<HTMLUListElement>(null);
  const [editingProduct, setEditingProduct] = useState<ProductItem | null>(null);
  const [showProductActions, setShowProductActions] = useState(false);
  const [actionPosition, setActionPosition] = useState({ top: 0, left: 0 });
  const actionsRef = useRef<HTMLDivElement>(null);


  // Fetch customers on component mount
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/Customer/customer-list`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setCustomersList(data);
        }
      } catch (error) {
        console.error('Error fetching customers:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);


  // Add this effect to handle clicks outside the actions menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (actionsRef.current && !actionsRef.current.contains(event.target as Node)) {
        setShowProductActions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/Product/product-list`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setProductsList(data);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  // Calculate totals whenever products change
  useEffect(() => {
    const newSubTotal = products.reduce((sum, product) => sum + product.total, 0);
    setSubTotal(newSubTotal);
    setBalance(newSubTotal - paid);
  }, [products, paid]);

  const handleCustomerNameKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveSuggestionIndex(prev => 
        Math.min(prev + 1, filteredCustomers.length - 1)
      );
      scrollSuggestionIntoView(activeSuggestionIndex + 1);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveSuggestionIndex(prev => Math.max(prev - 1, -1));
      scrollSuggestionIntoView(activeSuggestionIndex - 1);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (activeSuggestionIndex >= 0 && activeSuggestionIndex < filteredCustomers.length) {
        selectCustomer(filteredCustomers[activeSuggestionIndex]);
      } else if (customer.name) {
        // Try to find exact match if no suggestion is selected
        const foundCustomer = customersList.find(c => 
          c.customerName.toLowerCase() === customer.name?.toLowerCase()
        );
        if (foundCustomer) {
          selectCustomer(foundCustomer);
        } else {
          alert('Customer not found');
        }
      }
      document.getElementById('productIdInput')?.focus();
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };


  const handleProductDoubleClick = (product: ProductItem, event: React.MouseEvent) => {
    setEditingProduct(product);
    setActionPosition({
      top: event.clientY,
      left: event.clientX
    });
    setShowProductActions(true);
  };

  const handleDeleteProduct = () => {
    if (editingProduct) {
      setProducts(products.filter(p => p.id !== editingProduct.id));
      setShowProductActions(false);
    }
  };

  const handleModifyProduct = () => {
    if (editingProduct) {
      // Remove the product from the list
      setProducts(products.filter(p => p.id !== editingProduct.id));
      
      // Set the new product form with the editing product's values
      setNewProduct({
        productId: editingProduct.productId,
        productName: editingProduct.productName,
        quantity: editingProduct.quantity,
        sellingPrice: editingProduct.sellingPrice,
        discount: editingProduct.discount,
        total: editingProduct.total
      });
      
      setShowProductActions(false);
      
      // Focus on the quantity field for quick editing
      document.getElementById('quantityInput')?.focus();
    }
  };

  // Handle product ID input key events
  const handleProductIdKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveProductSuggestionIndex(prev => 
        Math.min(prev + 1, filteredProducts.length - 1)
      );
      scrollProductSuggestionIntoView(activeProductSuggestionIndex + 1);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveProductSuggestionIndex(prev => Math.max(prev - 1, -1));
      scrollProductSuggestionIntoView(activeProductSuggestionIndex - 1);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (activeProductSuggestionIndex >= 0 && activeProductSuggestionIndex < filteredProducts.length) {
        selectProduct(filteredProducts[activeProductSuggestionIndex]);
      }
      document.getElementById('productNameInput')?.focus();
    } else if (e.key === 'Escape') {
      setShowProductSuggestions(false);
    }
  };

  const scrollProductSuggestionIntoView = (index: number) => {
    if (productSuggestionsRef.current && index >= 0) {
      const items = productSuggestionsRef.current.children;
      if (items.length > index) {
        items[index].scrollIntoView({
          block: 'nearest'
        });
      }
    }
  };

  const selectProduct = (product: ProductItem) => {
    setNewProduct(prev => ({
      ...prev,
      productId: product.id,
      productName: product.productName,
      sellingPrice: product.sellingPrice
    }));
    setShowProductSuggestions(false);
    setActiveProductSuggestionIndex(-1);
  };

  const scrollSuggestionIntoView = (index: number) => {
    if (suggestionsRef.current && index >= 0) {
      const items = suggestionsRef.current.children;
      if (items.length > index) {
        items[index].scrollIntoView({
          block: 'nearest'
        });
      }
    }
  };

  const selectCustomer = (cust: CustomerInfo) => {
    setCustomer({
      customerId: cust.id,
      name: cust.customerName,
      address: cust.address,
      contactNumber: cust.phoneNumber,
      email: cust.email,
      openingBalance: cust.openingBalance,
    });
    setShowSuggestions(false);
    setActiveSuggestionIndex(-1);
  };


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

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>, nextFieldId?: string) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      
      // If in customer name field, try to find customer
      if (e.currentTarget.id === 'customerNameInput' && customer.name) {
        const foundCustomer = customersList.find(c => 
          c.customerName.toLowerCase() === customer.name?.toLowerCase()
        );
        
        if (foundCustomer) {
          setCustomer({
            customerId: foundCustomer.id,
            name: foundCustomer.customerName,
            address: foundCustomer.address,
            contactNumber: foundCustomer.phoneNumber,
            email: foundCustomer.email,
            openingBalance: foundCustomer.openingBalance,
          });
          return;
        } else {
          alert('Customer not found');
        }
      }

      // Normal field navigation
      if (nextFieldId) {
        const nextField = document.getElementById(nextFieldId);
        if (nextField) {
          nextField.focus();
        }
      }
    }
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
        invoiceStocks: []
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
        setCustomer({ customerId: 0 });
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
                <div className="relative">
                  <input
                    id="customerNameInput"
                    type="text"
                    placeholder="Enter Name"
                    value={customer.name || ''}
                    onKeyDown={(e) => {
                      if (showSuggestions) {
                        handleCustomerNameKeyDown(e);
                      } else {
                        handleKeyDown(e, 'productIdInput');
                      }
                    }}
                    onChange={(e) => {
                      const inputValue = e.target.value;
                      setCustomer({ ...customer, name: inputValue });
                      setActiveSuggestionIndex(-1);

                      if (inputValue.length > 0) {
                        const suggestions = customersList.filter(c =>
                          c.customerName.toLowerCase().includes(inputValue.toLowerCase())
                        );
                        setFilteredCustomers(suggestions);
                        setShowSuggestions(true);
                      } else {
                        setFilteredCustomers([]);
                        setShowSuggestions(false);
                      }
                    }}
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                    onFocus={() => {
                      if (customer.name) {
                        const suggestions = customersList.filter(c =>
                          c.customerName.toLowerCase().includes(customer.name?.toLowerCase() || '')
                        );
                        setFilteredCustomers(suggestions);
                        setShowSuggestions(true);
                      }
                    }}
                    className="border border-black p-2 rounded w-full"
                  />

                  {showSuggestions && filteredCustomers.length > 0 && (
                    <ul 
                      ref={suggestionsRef}
                      className="absolute z-10 w-full bg-white border border-gray-300 rounded shadow-md max-h-40 overflow-y-auto"
                    >
                      {filteredCustomers.map((cust, index) => (
                        <li
                          key={cust.id}
                          className={`p-2 hover:bg-gray-100 cursor-pointer ${
                            index === activeSuggestionIndex ? 'bg-gray-200' : ''
                          }`}
                          onClick={() => selectCustomer(cust)}
                          onMouseEnter={() => setActiveSuggestionIndex(index)}
                        >
                          {cust.customerName} ({cust.phoneNumber})
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </td>

              <th className="px-4 text-left">
                <label>Customer ID:</label>
              </th>
              <td>
                <input
                  id="customerIdInput"
                  type="number"
                  placeholder="ID"
                  value={customer.customerId || ''}
                  onChange={(e) => setCustomer({...customer, customerId: parseInt(e.target.value) || 0})}
                  onKeyDown={(e) => handleKeyDown(e, 'productIdInput')}
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
                  id="customerAddressInput"
                  type="text"
                  placeholder="Address"
                  disabled
                  value={customer.address || ''}
                  onChange={(e) => setCustomer({...customer, address: e.target.value})}
                  onKeyDown={(e) => handleKeyDown(e, 'customerContactNumberInput')}
                  className="border border-black p-2 rounded w-full"
                />
              </td>

              <th className="px-4 text-left">
                <label>Contact Number:</label>
              </th>
              <td>
                <input
                  id="customerContactNumberInput"
                  type="text"
                  placeholder="Contact No."
                  disabled
                  value={customer.contactNumber || ''}
                  onChange={(e) => setCustomer({...customer, contactNumber: e.target.value})}
                  onKeyDown={(e) => handleKeyDown(e, 'productIdInput')}
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
              <tr 
                key={product.id} 
                className="even:bg-gray-100 hover:bg-gray-200 cursor-pointer"
                onDoubleClick={(e) => handleProductDoubleClick(product, e)}
              >
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
                <div className="relative">
                  <input
                    id="productIdInput"
                    
                    value={newProduct.productId || ''}
                    onChange={(e) => {
                      const inputValue = e.target.value;
                      const productId = parseInt(inputValue) || 0;
                      setNewProduct(prev => ({ ...prev, productId }));
                      
                      if (inputValue.length > 0) {
                        const suggestions = productsList.filter(p => 
                          p.id.toString().includes(inputValue) ||
                          p.productName.toLowerCase().includes(inputValue.toLowerCase())
                        );
                        setFilteredProducts(suggestions);
                        setShowProductSuggestions(true);
                      } else {
                        setFilteredProducts([]);
                        setShowProductSuggestions(false);
                      }
                    }}
                    onKeyDown={(e) => {
                      if (showProductSuggestions) {
                        handleProductIdKeyDown(e);
                      } else {
                        handleKeyDown(e, 'productNameInput');
                      }
                    }}
                    onBlur={() => setTimeout(() => setShowProductSuggestions(false), 150)}
                    onFocus={() => {
                      if (newProduct.productId) {
                        const suggestions = productsList.filter(p => 
                          p.id.toString().includes(newProduct.productId.toString()) ||
                          p.productName.toLowerCase().includes(newProduct.productName.toLowerCase())
                        );
                        setFilteredProducts(suggestions);
                        setShowProductSuggestions(true);
                      }
                    }}
                    className="w-20 p-1 border rounded"
                    placeholder="Product ID"
                  />
                  
                  {showProductSuggestions && filteredProducts.length > 0 && (
                    <ul 
                      ref={productSuggestionsRef}
                      className="absolute z-100 w-full bg-gray-100 border border-gray-300 rounded shadow-md max-h-40 overflow-y-auto"
                    >
                      {filteredProducts.map((product, index) => (
                        <li
                          key={product.id}
                          className={`p-2 hover:bg-gray-100 cursor-pointer ${
                            index === activeProductSuggestionIndex ? 'bg-gray-200' : ''
                          }`}
                          onClick={() => selectProduct(product)}
                          onMouseEnter={() => setActiveProductSuggestionIndex(index)}
                        >
                          {product.id} - {product.productName} (${product.sellingPrice?.toFixed(2) || 0.00})
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </td>

              <td className="py-1 text-center">
                <input
                  id="productNameInput"
                  type="text"
                  value={newProduct.productName}
                  onChange={(e) => setNewProduct({...newProduct, productName: e.target.value})}
                  onKeyDown={(e) => handleKeyDown(e, 'quantityInput')} 
                  className="w-30 p-1 border rounded"
                  placeholder="Product Name"
                />
              </td>
              <td className="py-1 text-center">
                <input
                  id="quantityInput"
                  type="number"
                  value={newProduct.quantity || ''}
                  onChange={(e) => setNewProduct({...newProduct, quantity: parseInt(e.target.value) || 0})}
                  onKeyDown={(e) => handleKeyDown(e, 'sellingPriceInput')} 
                  className="w-20 p-1 border rounded"
                  placeholder="Qty"
                />
              </td>
              <td className="py-1 text-center">
                <input
                  id="sellingPriceInput"
                  type="number"
                  value={newProduct.sellingPrice || ''}
                  onChange={(e) => setNewProduct({...newProduct, sellingPrice: parseFloat(e.target.value) || 0})}
                  onKeyDown={(e) => handleKeyDown(e, 'discountInput')} 
                  className="w-20 p-1 border rounded"
                  placeholder="Price"
                />
              </td>
              <td className="py-1 text-center">
                <input
                  id="discountInput"
                  type="number"
                  value={newProduct.discount || ''}
                  onChange={(e) => setNewProduct({...newProduct, discount: parseFloat(e.target.value) || 0})}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddProduct();
                      handleKeyDown(e, 'productIdInput');
                    }
                  }}
                  className="w-20 p-1 border rounded"
                  placeholder="Discount"
                />
              </td>
              
            </tr>
          </tbody>


          {/* Add this context menu for product actions */}
          {showProductActions && (
            <div
              ref={actionsRef}
              className="fixed bg-white shadow-lg rounded border border-gray-300 z-50 py-1"
              style={{
                top: `${actionPosition.top}px`,
                left: `${actionPosition.left}px`,
              }}
            >
              <button
                onClick={handleModifyProduct}
                className="block w-full text-left px-4 py-2 hover:bg-gray-100"
              >
                Modify Product
              </button>
              <button
                onClick={handleDeleteProduct}
                className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
              >
                Delete Product
              </button>
            </div>
          )}
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
            
            value={paid || ''}
            onChange={(e) => setPaid(parseFloat(e.target.value) || 0)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                document.getElementById('submitInvoice')?.focus();
              }
            }}
            className="border border-black p-1 rounded w-32 text-right"
          />
        </div>

        <div className="border-y flex items-center justify-between p-1">
          <p>Balance</p>
          <p>{balance.toFixed(2)}</p>
        </div>
      </div>

      <div className="m-10">
        <p>Total Outstanding: {customer.openingBalance?.toFixed(2) || '0.00'}</p>
      </div>

      <div className="flex justify-end m-10">
        <button
          id="submitInvoice"
          onClick={handleSubmitInvoice}
          className="p-2 bg-black text-white rounded hover:bg-gray-800 cursor-pointer transition-colors duration-300" >
          Create Invoice
        </button>
      </div>
    </div>
  );
}