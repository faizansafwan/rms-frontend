"use client";

import Link from "next/link";
import { FC, useState } from "react";
import { ChevronDown } from "lucide-react";
import { usePathname } from "next/navigation";
import "./index.css";

interface NavOpenState {
  invoice: boolean;
  product: boolean;
  customer: boolean;
  report: boolean;
}

export const NavBar: FC = () => {
  const pathname = usePathname();
  const [open, setOpen] = useState<NavOpenState>({
    invoice: false,
    product: false,
    customer: false,
    report: false,
  });

  const toggleDropdown = (section: keyof NavOpenState) => {
    setOpen((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const isActive = (path: string) => pathname === path;

  const activeClass = "text-[rgba(0, 0, 0, 0.14)] font-semibold";

  return (
    <div className="text-[18px] h-full flex flex-col">
      <nav className="flex-1">
        <div>
          <ul>
            {/* Invoice Section */}
            <li
              className="py-1 border-b flex items-center justify-between cursor-pointer"
              onClick={() => toggleDropdown("invoice")}
            >
              <strong>Invoice</strong>
              <ChevronDown
                size={24}
                className={`transition-transform duration-300 ${
                  open.invoice ? "rotate-180" : ""
                }`}
              />
            </li>

            <div
              className={`transition-all duration-500 overflow-hidden ${
                open.invoice ? "max-h-[500px]" : "max-h-0"
              }`}
            >
              <ul className="p-1 pl-2">
                <li>
                  <Link
                    href="/main/invoice"
                    className={isActive("/main/invoice") ? activeClass : ""}
                  >
                    New Invoice
                  </Link>
                </li>
                <li>
                  <Link
                    href="/main/bills"
                    className={isActive("/main/bills") ? activeClass : ""}
                  >
                    Bills
                  </Link>
                </li>
              </ul>
            </div>

            {/* Product Section */}
            <li
              className="py-2 border-b flex items-center justify-between cursor-pointer"
              onClick={() => toggleDropdown("product")}
            >
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
              }`}
            >
              <ul className="p-1 pl-2">
                <li>
                  <Link
                    href="/main/product-list"
                    className={isActive("/main/product-list") ? activeClass : ""}
                  >
                    Product List
                  </Link>
                </li>
                <li>
                  <Link
                    href="/main/add-product"
                    className={isActive("/main/add-product") ? activeClass : ""}
                  >
                    Add Product
                  </Link>
                </li>
                <li>
                  <Link
                    href="/main/add-stock"
                    className={isActive("/main/add-stock") ? activeClass : ""}
                  >
                    Add Stock
                  </Link>
                </li>
              </ul>
            </div>

            {/* Customer Section */}
            <li
              className="py-2 border-b flex items-center justify-between cursor-pointer"
              onClick={() => toggleDropdown("customer")}
            >
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
              }`}
            >
              <ul className="p-1 pl-2">
                <li>
                  <Link
                    href="/main/customer-list"
                    className={isActive("/main/customer-list") ? activeClass : ""}
                  >
                    Customer List
                  </Link>
                </li>
                <li>
                  <Link
                    href="/main/add-customer"
                    className={isActive("/main/add-customer") ? activeClass : ""}
                  >
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
      <div className="mt-auto py-4">
        <ul>
          <li>
            <Link
              href="/main/settings"
              className={`block py-2 ${
                isActive("/main/settings") ? activeClass : ""
              }`}
            >
              Account Settings
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};