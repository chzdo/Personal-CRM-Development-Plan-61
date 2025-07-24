import React from 'react';
import { motion } from 'framer-motion';
import { useCRM } from '../../context/CRMContext';
import { Link } from 'react-router-dom';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';

const { FiArrowRight, FiUsers } = FiIcons;

function ContactsOverview() {
  const { state } = useCRM();
  const recentContacts = state.contacts
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 6);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Recent Contacts</h3>
        <Link
          to="/contacts"
          className="flex items-center space-x-1 text-primary-600 hover:text-primary-700 text-sm font-medium"
        >
          <span>View all</span>
          <SafeIcon icon={FiArrowRight} className="text-xs" />
        </Link>
      </div>

      {recentContacts.length === 0 ? (
        <div className="text-center py-8">
          <SafeIcon icon={FiUsers} className="text-4xl text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No contacts yet</p>
          <p className="text-sm text-gray-400 mt-1">Add your first contact to get started</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recentContacts.map((contact, index) => (
            <motion.div
              key={contact.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link
                to={`/contacts/${contact.id}`}
                className="block p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:shadow-md transition-all"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-primary-700 font-semibold">
                      {contact.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{contact.name}</p>
                    <p className="text-xs text-gray-500 truncate">{contact.email}</p>
                    <p className="text-xs text-gray-400">{contact.company}</p>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ContactsOverview;