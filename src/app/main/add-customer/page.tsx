
export default function AddCustomer() {

    return (
        <div className="m-5">
            <div className="mx-10">
                <div className="border-b p-1 text-[18px]">
                    <strong><h1>Customer Personal Details</h1></strong>
                </div>

                <div className="m-5">
                    <table className="w-full border-collapse">
                        <thead className="space-y-4">
                            <tr className="h-12">
                                <th className="pr-4  text-left"><label>Customer ID:</label></th>
                                <td><input type="text" placeholder="Enter Name" className="border border-black p-2 rounded w-full" /></td>

                                <th className="px-4 text-left"><label>Customer Name:</label></th>
                                <td><input type="text" placeholder="ID" className="border border-black p-2 rounded w-full" /></td>
                            </tr>

                            <tr className="h-12">
                                <th className="pr-4 text-left"><label>Email:</label></th>
                                <td><input type="text" placeholder="Address" className="border border-black p-2 rounded w-full" /></td>

                                <th className="px-4 text-left"><label>Phone:</label></th>
                                <td><input type="text" placeholder="Contact No." className="border border-black p-2 rounded w-full" /></td>
                            </tr>  

                            <tr className="h-12 w-full">
                                <th className="pr-4 text-left w-1/4"><label>Address:</label></th>
                                <td colSpan={3}><input type="text" placeholder="Address" className="border border-black p-2 rounded w-full" /></td>
                            </tr>
                        </thead>
                    </table>
                </div>    

                <div className="border-b p-1 text-[18px]">
                    <strong><h1>Customer Accounting</h1></strong>
                </div>

                <div className="m-5">
                    <table className="w-full border-collapse">
                        <thead className="space-y-4">
                            <tr className="h-12">
                                <th className="pr-4  text-left"><label>Credit Limit:</label></th>
                                <td><input type="text" placeholder="50000.00" className="border border-black p-2 rounded w-full" /></td>

                                <th className="px-4 text-left"><label>Opening Balance:</label></th>
                                <td><input type="text" placeholder="33500.00" className="border border-black p-2 rounded w-full" /></td>
                            </tr> 
                        </thead>
                    </table>

                    
                </div>

                <div className="flex justify-end m-5">
                    <input type="submit" value={'Add Customer'} className="rounded bg-secondary transition ease-in-out cursor-pointer duration-300 p-2 hover:bg-black hover:text-white" />
                </div>

            </div>
        </div>
    )
}