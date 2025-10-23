'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Home } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface BackButtonProps {
  title?: string;
  showHome?: boolean;
  className?: string;
  onClick?: () => void;
}

const BackButton: React.FC<BackButtonProps> = ({ 
  title = "Geri Dön", 
  showHome = false, 
  className = "",
  onClick 
}) => {
  const router = useRouter();

  const handleBack = () => {
    if (onClick) {
      onClick();
    } else {
      router.back();
    }
  };

  const handleHome = () => {
    router.push('/dashboard');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`mb-6 ${className}`}
    >
      <div className="flex items-center space-x-3">
        <motion.button
          onClick={handleBack}
          className="group flex items-center space-x-2 px-4 py-2 bg-white hover:bg-gray-50 border border-gray-200 hover:border-gray-300 rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <ArrowLeft className="w-4 h-4 text-gray-600 group-hover:text-gray-900 transition-colors" />
          <span className="font-medium text-gray-700 group-hover:text-gray-900 transition-colors">
            {title}
          </span>
        </motion.button>

        {showHome && (
          <motion.button
            onClick={handleHome}
            className="group flex items-center space-x-2 px-4 py-2 bg-red-50 hover:bg-red-100 border border-red-200 hover:border-red-300 rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Home className="w-4 h-4 text-red-600 group-hover:text-red-700 transition-colors" />
            <span className="font-medium text-red-700 group-hover:text-red-800 transition-colors">
              Ana Sayfa
            </span>
          </motion.button>
        )}
      </div>
    </motion.div>
  );
};

export default BackButton;
