import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import ContactModal from '../Contacts/ContactModal';

const { FiUserPlus, FiPhone, FiMail, FiCalendar } = FiIcons;

function QuickActions() {
  const [showContactModal, setShowContactModal] = useState(false);

  const actions = [
    {
      title: 'Add Contact',
      icon: FiUserPlus,
      color: 'bg-blue-500',
      onClick: () => setShowContactModal(true)
    },
    {
      title: 'Make Call',
      icon: FiPhone,
      color: 'bg-green-500',
      onClick: () => {}
    },
    {
      title: 'Send Email',
      icon: FiMail,
      color: 'bg-purple-500',
      onClick: () => {}
    },
    {
      title: 'Schedule Meeting',
      icon: FiCalendar,
      color: 'bg-orange-500',
      onClick: () => {}
    }
  ];

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="space-y-3">
          {actions.map((action, index) => (
            <motion.button
              key={action.title}
              onClick={action.onClick}
              className="w-full flex items-center space-x-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className={`p-2 rounded-lg ${action.color}`}>
                <SafeIcon icon={action.icon} className="text-white text-lg" />
              </div>
              <span className="font-medium text-gray-700">{action.title}</span>
            </motion.button>
          ))}
        </div>
      </div>

      {showContactModal && (
        <ContactModal
          isOpen={showContactModal}
          onClose={() => setShowContactModal(false)}
        />
      )}
    </>
  );
}

export default QuickActions;