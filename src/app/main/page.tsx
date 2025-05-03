'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';

const navItems = [
  { name: 'New Invoice', path: 'main/invoice', icon: '📝' },
  { name: 'Bills', path: 'main/bills', icon: '🧾' },
  { name: 'Product List', path: 'main/product-list', icon: '📦' },
  { name: 'Add Product', path: 'main/add-product', icon: '➕' },
  { name: 'Add Stock', path: 'main/add-stock', icon: '📊' },
  { name: 'Customer List', path: 'main/customer-list', icon: '👥' },
  { name: 'Add Customer', path: 'main/add-customer', icon: '➕' },
  { name: 'Settings', path: 'main/settings', icon: '⚙️' },
];

export default function Home() {
  const pathname = usePathname();

  return (
    <div className="min-h-screen  font-[family-name:var(--font-geist-sans)] bg-gray-50">
      

      {/* Navigation Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.05, duration: 0.5 }}
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 m-8"
      >
        {navItems.map((item, index) => {
          const isActive = pathname === item.path;
          
          return (
            <Link href={item.path} key={item.path} passHref>
              <motion.div
                whileHover={{ 
                  y: -5,
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.3 }}
                className={`relative p-6 rounded-xl cursor-pointer transition-all duration-300 ${
                  isActive ? 'bg-primary text-white' : 'bg-white hover:bg-gray-100'
                }`}
              >
                <div className="flex flex-col items-center text-center">
                  <motion.span 
                    className="text-3xl mb-3"
                    animate={{
                      scale: [1, 1.1, 1],
                      transition: { repeat: Infinity, duration: 1 }
                    }}
                  >
                    {item.icon}
                  </motion.span>
                  <h2 className="text-lg font-semibold">{item.name}</h2>
                </div>
                
                {isActive && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute bottom-0 left-0 right-0 h-1 bg-secondary"
                    initial={false}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
              </motion.div>
            </Link>
          );
        })}
      </motion.div>

    </div>
  );
}