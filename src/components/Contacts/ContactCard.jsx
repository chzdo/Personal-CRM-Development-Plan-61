import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';

const { FiMail, FiPhone, FiMapPin, FiBuilding } = FiIcons;

function ContactCard({ contact }) {
  return (
    <motion.div
      className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-200"
      whileHover={{ y: -2 }}
    >
      <Link to={`/contacts/${contact.id}`}>
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-primary-700 font-semibold text-lg">
              {contact.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 truncate">{contact.name}</h3>
            <p className="text-sm text-gray-500 mb-3">{contact.title}</p>
            
            <div className="space-y-2">
              {contact.email && (
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <SafeIcon icon={FiMail} className="text-xs" />
                  <span className="truncate">{contact.email}</span>
                </div>
              )}
              {contact.phone && (
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <SafeIcon icon={FiPhone} className="text-xs" />
                  <span>{contact.phone}</span>
                </div>
              )}
              {contact.company && (
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <SafeIcon icon={FiBuilding} className="text-xs" />
                  <span className="truncate">{contact.company}</span>
                </div>
              )}
              {contact.location && (
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <SafeIcon icon={FiMapPin} className="text-xs" />
                  <span className="truncate">{contact.location}</span>
                </div>
              )}
            </div>
            
            <div className="mt-4 pt-3 border-t border-gray-100">
              <p className="text-xs text-gray-400">
                Added {format(new Date(contact.createdAt), 'MMM d, yyyy')}
              </p>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export default ContactCard;