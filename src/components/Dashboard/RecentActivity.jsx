import React from 'react';
import { motion } from 'framer-motion';
import { useCRM } from '../../context/CRMContext';
import { format } from 'date-fns';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';

const { FiPhone, FiMail, FiMessageSquare, FiCalendar } = FiIcons;

const iconMap = {
  call: FiPhone,
  email: FiMail,
  meeting: FiCalendar,
  note: FiMessageSquare
};

function RecentActivity() {
  const { state } = useCRM();
  const recentInteractions = state.interactions
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
      
      {recentInteractions.length === 0 ? (
        <div className="text-center py-8">
          <SafeIcon icon={FiMessageSquare} className="text-4xl text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No recent activity</p>
          <p className="text-sm text-gray-400 mt-1">Start by adding some interactions with your contacts</p>
        </div>
      ) : (
        <div className="space-y-4">
          {recentInteractions.map((interaction, index) => {
            const contact = state.contacts.find(c => c.id === interaction.contactId);
            const IconComponent = iconMap[interaction.type] || FiMessageSquare;
            
            return (
              <motion.div
                key={interaction.id}
                className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="p-2 bg-primary-50 rounded-lg">
                  <SafeIcon icon={IconComponent} className="text-primary-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">
                    {interaction.type.charAt(0).toUpperCase() + interaction.type.slice(1)} with {contact?.name || 'Unknown Contact'}
                  </p>
                  <p className="text-sm text-gray-500 truncate">{interaction.notes}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {format(new Date(interaction.date), 'MMM d, yyyy h:mm a')}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default RecentActivity;