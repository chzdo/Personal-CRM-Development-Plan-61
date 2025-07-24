import React from 'react';
import { motion } from 'framer-motion';
import { useCRM } from '../../context/CRMContext';
import { format, isPast } from 'date-fns';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';

const { FiCheck, FiClock, FiUser, FiCalendar } = FiIcons;

function TaskCard({ task }) {
  const { state, dispatch } = useCRM();
  
  const contact = state.contacts.find(c => c.id === task.contactId);
  const isOverdue = isPast(new Date(task.dueDate)) && !task.completed;

  const handleToggleComplete = () => {
    dispatch({
      type: 'UPDATE_TASK',
      payload: { ...task, completed: !task.completed }
    });
  };

  return (
    <motion.div
      className={`border rounded-lg p-4 transition-all ${
        task.completed
          ? 'bg-green-50 border-green-200'
          : isOverdue
          ? 'bg-red-50 border-red-200'
          : 'bg-white border-gray-200 hover:border-primary-300'
      }`}
      whileHover={{ scale: 1.01 }}
    >
      <div className="flex items-start space-x-4">
        <motion.button
          onClick={handleToggleComplete}
          className={`mt-1 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
            task.completed
              ? 'bg-green-500 border-green-500 text-white'
              : 'border-gray-300 hover:border-primary-500'
          }`}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          {task.completed && <SafeIcon icon={FiCheck} className="text-xs" />}
        </motion.button>

        <div className="flex-1 min-w-0">
          <h3 className={`font-medium ${task.completed ? 'text-gray-500 line-through' : 'text-gray-900'}`}>
            {task.title}
          </h3>
          
          {task.description && (
            <p className={`text-sm mt-1 ${task.completed ? 'text-gray-400' : 'text-gray-600'}`}>
              {task.description}
            </p>
          )}

          <div className="flex items-center space-x-4 mt-3 text-sm">
            {contact && (
              <div className="flex items-center space-x-1 text-gray-500">
                <SafeIcon icon={FiUser} className="text-xs" />
                <span>{contact.name}</span>
              </div>
            )}
            
            <div className={`flex items-center space-x-1 ${
              isOverdue ? 'text-red-600' : 'text-gray-500'
            }`}>
              <SafeIcon icon={isOverdue ? FiClock : FiCalendar} className="text-xs" />
              <span>
                {isOverdue ? 'Overdue: ' : ''}
                {format(new Date(task.dueDate), 'MMM d, yyyy')}
              </span>
            </div>

            <div className={`px-2 py-1 rounded-full text-xs ${
              task.priority === 'high'
                ? 'bg-red-100 text-red-700'
                : task.priority === 'medium'
                ? 'bg-yellow-100 text-yellow-700'
                : 'bg-gray-100 text-gray-700'
            }`}>
              {task.priority} priority
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default TaskCard;