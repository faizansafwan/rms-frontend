"use client";

import Link from "next/link";
import { FC, useState } from "react";
import { ChevronDown, LogOut } from "lucide-react";
import { usePathname, useRouter  } from "next/navigation";
import "./index.css";

interface NavOpenState {
  invoice: boolean;
  product: boolean;
  customer: boolean;
  report: boolean;
}

export const NavBar: FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState<NavOpenState>({
    invoice: false,
    product: false,
    customer: false,
    report: false,
  });

  const [showLogoutModal, setShowLogoutModal] = useState(false);


  const toggleDropdown = (section: keyof NavOpenState) => {
    setOpen((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleLogout = () => {
    // Clear authentication tokens
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Redirect to login page
    router.push('/auth/login');
 
  
  };

  const isActive = (path: string) => pathname === path;

  const activeClass = "text-[rgba(0, 0, 0, 0.14)] font-semibold";

  return (
    <div className="text-[18px] h-full flex flex-col">

      <div className="p-8 bg-gray-50 shadow-lg ">
        
      </div>
      <nav className="flex-1 mt-2 px-4">
        <div>
          <ul>
            {/* Invoice Section */}
            <li
              className="py-1 border-b flex items-center justify-between cursor-pointer"
              onClick={() => toggleDropdown("invoice")} >
              <strong>Invoice</strong>
              <ChevronDown
                size={24}
                className={`transition-transform duration-300 ${
                  open.invoice ? "rotate-180" : ""
                }`} />
            </li>

            <div
              className={`transition-all duration-500 overflow-hidden ${
                open.invoice ? "max-h-[500px]" : "max-h-0"
              }`} >
              <ul className="p-1 pl-2">
                <li>
                  <Link
                    href="/main/invoice"
                    className={isActive("/main/invoice") ? activeClass : ""}>
                    New Invoice
                  </Link>
                </li>
                <li>
                  <Link
                    href="/main/bills"
                    className={isActive("/main/bills") ? activeClass : ""} >
                    Bills
                  </Link>
                </li>
              </ul>
            </div>

            {/* Product Section */}
            <li
              className="py-2 border-b flex items-center justify-between cursor-pointer"
              onClick={() => toggleDropdown("product")} >
              <strong>Product</strong>
              <ChevronDown
                size={24}
                className={`transition-transform duration-300 ${
                  open.product ? "rotate-180" : ""
                }`}
              />
            </li>
            <div
              className={`transition-all duration-500 overflow-hidden ${
                open.product ? "max-h-[500px]" : "max-h-0"
              }`}>
              <ul className="p-1 pl-2">
                <li>
                  <Link
                    href="/main/product-list"
                    className={isActive("/main/product-list") ? activeClass : ""}>
                    Product List
                  </Link>
                </li>
                <li>
                  <Link
                    href="/main/add-product"
                    className={isActive("/main/add-product") ? activeClass : ""} >
                    Add Product
                  </Link>
                </li>
                <li>
                  <Link
                    href="/main/add-stock"
                    className={isActive("/main/add-stock") ? activeClass : ""} >
                    Add Stock
                  </Link>
                </li>
              </ul>
            </div>

            {/* Customer Section */}
            <li
              className="py-2 border-b flex items-center justify-between cursor-pointer"
              onClick={() => toggleDropdown("customer")} >
              <strong>Customer</strong>
              <ChevronDown
                size={24}
                className={`transition-transform duration-300 ${
                  open.customer ? "rotate-180" : ""
                }`}
              />
            </li>

            <div
              className={`transition-all duration-500 overflow-hidden ${
                open.customer ? "max-h-[500px]" : "max-h-0"
              }`} >
              <ul className="p-1 pl-2">
                <li>
                  <Link
                    href="/main/customer-list"
                    className={isActive("/main/customer-list") ? activeClass : ""}>
                    Customer List
                  </Link>
                </li>
                <li>
                  <Link
                    href="/main/add-customer"
                    className={isActive("/main/add-customer") ? activeClass : ""} >
                    Add Customer
                  </Link>
                </li>
              </ul>
            </div>

            {/* Reports Section */}
            <li
              className="py-2 border-b flex items-center justify-between cursor-pointer"
              onClick={() => toggleDropdown("report")}
            >
              <strong>Reports</strong>
              <ChevronDown
                size={24}
                className={`transition-transform duration-300 ${
                  open.report ? "rotate-180" : ""
                }`}
              />
            </li>
          </ul>
        </div>
      </nav>

      {/* Settings Link at Bottom */}
      <div className="mt-auto py-4 px-4">
        <ul>
          <li>
            <Link
              href="/main/settings"
              className={`block py-2 hover:text-brown ${
                isActive("/main/settings") ? activeClass : ""
              }`}
            >
              Account Settings
            </Link>
          </li>
          <li>
            <button
              onClick={() => setShowLogoutModal(true)}
              className="flex items-center gap-2 w-full py-2 text-left hover:text-brown transition-colors"
            >
              <LogOut size={18} />
              Log Out
            </button>
          </li>
        </ul>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-sm w-full mx-4">
            <h3 className="text-lg font-bold mb-4">Confirm Logout</h3>
            <p className="mb-6">Are you sure you want to log out?</p>
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setShowLogoutModal(false)}
                className="px-4 py-2 border rounded hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleLogout}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
              >
                Log Out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};