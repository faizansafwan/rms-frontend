'use client';
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface Shop {
  id: number;
  shopName: string;
  ownerName: string;
  phone: string;
  email?: string;
  address: string;
  username: string;
  isActive: boolean;
  createdAt: string;
}

export default function ShopProfile() {
  const [shop, setShop] = useState<Shop | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchShopData = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/Shop/me`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch shop data');
        }
        
        const data = await response.json();
        setShop(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchShopData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-primary border-t-secondary rounded-full"
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-red-100 text-red-700 rounded-lg"
        >
          {error}
        </motion.div>
      </div>
    );
  }

  if (!shop) {
    return (
      <div className="flex justify-center items-center h-screen">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-brown text-lg"
        >
          No shop data found
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-3xl mx-auto"
      >
        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          {/* Header */}
          <motion.div
            initial={{ backgroundColor: 'var(--color-primary)' }}
            animate={{ backgroundColor: 'var(--color-secondary)' }}
            transition={{ duration: 3, repeat: Infinity, repeatType: 'reverse' }}
            className="bg-primary py-6 px-6"
          >
            <h1 className="text-3xl font-bold text-white">{shop.shopName}</h1>
            <p className="text-white opacity-90 mt-1">Owned by {shop.ownerName}</p>
          </motion.div>

          {/* Details */}
          <div className="p-6">
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mb-6"
            >
              <h2 className="text-xl font-semibold text-brown mb-4">Shop Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <DetailCard label="Owner" value={shop.ownerName} />
                <DetailCard label="Phone" value={shop.phone} />
                <DetailCard label="Email" value={shop.email || 'Not provided'} />
                <DetailCard label="Address" value={shop.address} />
                <DetailCard label="Username" value={shop.username} />
                <DetailCard 
                  label="Status" 
                  value={shop.isActive ? 'Active' : 'Inactive'} 
                  valueColor={shop.isActive ? 'text-green-600' : 'text-red-600'}
                />
                <DetailCard label="Member Since" value={new Date(shop.createdAt).toLocaleDateString()} />
              </div>
            </motion.div>

            
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function DetailCard({ label, value, valueColor = 'text-gray-700' }: { label: string; value: string; valueColor?: string }) {
  return (
    <motion.div 
      whileHover={{ scale: 1.02 }}
      className="bg-gray-50 p-4 rounded-lg border border-gray-200"
    >
      <p className="text-sm text-gray-500">{label}</p>
      <p className={`mt-1 font-medium ${valueColor}`}>{value}</p>
    </motion.div>
  );
}

