import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';

const { FiHome, FiBarChart2, FiSettings, FiTarget } = FiIcons;

const navItems = [
  { to: '/', icon: FiHome, label: 'Dashboard' },
  { to: '/reports', icon: FiBarChart2, label: 'KPI Reports' },
  { to: '/settings', icon: FiSettings, label: 'Settings' },
];

function Sidebar() {
  return (
    <motion.div 
      className="w-64 bg-white shadow-lg border-r border-gray-200"
      initial={{ x: -250 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <SafeIcon icon={FiTarget} className="text-white text-xl" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">KPI Reporter</h1>
            <p className="text-sm text-gray-500">Performance tracking</p>
          </div>
        </div>
      </div>

      <nav className="mt-6 px-3">
        {navItems.map((item, index) => (
          <motion.div
            key={item.to}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <NavLink
              to={item.to}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-4 py-3 rounded-lg mb-2 transition-all duration-200 ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`
              }
            >
              <SafeIcon icon={item.icon} className="text-xl" />
              <span className="font-medium">{item.label}</span>
            </NavLink>
          </motion.div>
        ))}
      </nav>
    </motion.div>
  );
}

export default Sidebar;