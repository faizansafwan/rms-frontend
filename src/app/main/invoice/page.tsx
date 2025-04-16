// app/invoice/page.tsx
export default function NewInvoice() {
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
                    className="border border-black p-2 rounded w-full"
                  />
                </td>
  
                <th className="px-4 text-left">
                  <label>Customer ID:</label>
                </th>
                <td>
                  <input
                    type="text"
                    placeholder="ID"
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
                    className="border border-black p-2 rounded w-full"
                  />
                </td>
              </tr>
            </thead>
          </table>
        </div>
  
        <div className="mx-10 my-5">
          <p>
            <strong>Invoice No.: </strong>
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
              <tr className="even:bg-gray-100">
                <td className="py-1 text-center">1</td>
                <td className="py-1 text-center">112</td>
                <td className="py-1 text-center">Product1</td>
                <td className="py-1 text-center">10</td>
                <td className="py-1 text-center">210</td>
                <td className="py-1 text-center">10</td>
                <td className="py-1 text-center">2000</td>
              </tr>
  
              <tr className="even:bg-gray-100">
                <td className="py-1 text-center">2</td>
                <td className="py-1 text-center">113</td>
                <td className="py-1 text-center">Product2</td>
                <td className="py-1 text-center">10</td>
                <td className="py-1 text-center">510</td>
                <td className="py-1 text-center">10</td>
                <td className="py-1 text-center">5000</td>
              </tr>
  
              <tr>
                <td className="py-1 text-center">
                  <input type="text" disabled className="w-10 p-1 rounded" />
                </td>
                <td className="py-1 text-center">
                  <input type="text" className="w-20 p-1 border rounded" />
                </td>
                <td className="py-1 text-center">
                  <input type="text" className="w-30 p-1 border rounded" />
                </td>
                <td className="py-1 text-center">
                  <input type="text" className="w-20 p-1 border rounded" />
                </td>
                <td className="py-1 text-center">
                  <input type="text" className="w-20 p-1 border rounded" />
                </td>
                <td className="py-1 text-center">
                  <input type="text" className="w-20 p-1 border rounded" />
                </td>
                <td className="py-1 text-center">-</td>
              </tr>
            </tbody>
          </table>
        </div>
  
        <div className="mx-10">
          <div className="flex items-center justify-between p-1">
            <p>Sub Total</p>
            <p>4340.00</p>
          </div>
  
          <div className="flex items-center justify-between p-1">
            <p>Paid</p>
            <p>2000.00</p>
          </div>
  
          <div className="border-y flex items-center justify-between p-1">
            <p>Balance</p>
            <p>2340.00</p>
          </div>
        </div>
  
        <div className="m-10">
          <p>Total Outstanding: 34000.00</p>
        </div>
      </div>
    );
}
  