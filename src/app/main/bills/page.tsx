
export default function Bills() {

    return (
        <div className="m-5">
            <div className="mx-10">
                <table className="w-full border-collapse">
                    <thead className="space-y-4">
                        <tr className="h-12">
                            <th className="pr-4  text-left"><label>Invoice ID: </label></th>
                            <td><input type="text" placeholder="Enter Name" className="border border-black p-2 rounded w-full" /></td>

                            <th className="px-4 text-left"><label>Customer ID:</label></th>
                            <td><input type="text" placeholder="ID" className="border border-black p-2 rounded w-full" /></td>
                        </tr>

                        <tr className="h-12">
                            <th className="pr-4 text-left"><label>Customer Name: </label></th>
                            <td><input type="text" placeholder="Address" className="border border-black p-2 rounded w-full" /></td>
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

                    <tbody className="">
                        <tr className="even:bg-gray-100 ">
                            <td className="py-1 text-center">I103</td>
                            <td className="py-1 text-center">03/03/2025</td>
                            <td className="py-1 text-center">4500.00</td>
                            <td className="py-1 text-center">customer 1</td>
                            <td className="py-1 text-center"><input type="button" className="rounded bg-secondary transition ease-in-out duration-300 p-2 hover:bg-black hover:text-white" value={'View'} /></td>
                        </tr>

                        <tr className="even:bg-gray-100">
                            <td className="py-1 text-center">I102</td>
                            <td className="py-1 text-center">03/03/2025</td>
                            <td className="py-1 text-center">5045.00</td>
                            <td className="py-1 text-center">Customer 2</td>
                            <td className="py-1 text-center"><input type="button" className="rounded bg-secondary transition ease-in-out duration-300 p-2 hover:bg-black hover:text-white" value={'View'} /></td>     
                        </tr>
                    </tbody>
                </table>
            </div>  
        </div>
    )
}