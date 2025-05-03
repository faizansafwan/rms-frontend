"use client";

import { motion } from 'framer-motion';

export default function Header() {

    return (
        <div className="">
            {/* Header */}
            <motion.header
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex justify-between items-center shadow-lg p-4 ">

                <div className="flex items-center space-x-4">
                <h1 className="text-2xl font-bold text-brown">Retail Management System</h1>
                </div>

                <div className="text-sm text-gray-500">
                {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
            </motion.header>

        </div>
    )
}