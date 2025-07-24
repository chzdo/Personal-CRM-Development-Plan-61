import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useKPI } from '../../context/KPIContext';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';

const { FiX } = FiIcons;

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function KPIDataModal({ isOpen, onClose, kpi }) {
  const { dispatch } = useKPI();
  const [formData, setFormData] = useState({
    month: months[new Date().getMonth()],
    actual: '',
    target: kpi.target
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newData = {
      month: formData.month,
      actual: parseFloat(formData.actual),
      target: parseFloat(formData.target)
    };
    
    // Check if this month already exists
    const existingIndex = kpi.data.findIndex(item => item.month === formData.month);
    let updatedData;
    
    if (existingIndex !== -1) {
      // Update existing month
      updatedData = [...kpi.data];
      updatedData[existingIndex] = newData;
    } else {
      // Add new month
      updatedData = [...kpi.data, newData];
    }
    
    // Determine trend and status
    const latestActual = parseFloat(formData.actual);
    const latestTarget = parseFloat(formData.target);
    
    let trend = 'Steady';
    if (kpi.data.length > 0) {
      const previousActual = kpi.data[kpi.data.length - 1].actual;
      if (latestActual > previousActual) {
        trend = 'Upward';
      } else if (latestActual < previousActual) {
        trend = 'Downward';
      }
    }
    
    let status = 'On Track';
    if (latestActual < latestTarget * 0.9) {
      status = 'Below Target';
    } else if (latestActual > latestTarget * 1.1) {
      status = 'Above Target';
    }
    
    // Update KPI
    const updatedKpi = {
      ...kpi,
      data: updatedData,
      trend,
      status,
      lastUpdated: new Date().toISOString()
    };
    
    dispatch({
      type: 'UPDATE_KPI',
      payload: updatedKpi
    });
    
    onClose();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          
          <motion.div
            className="bg-white rounded-xl shadow-xl w-full max-w-md relative z-10"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Add Data Point</h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <SafeIcon icon={FiX} className="text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Month *
                </label>
                <select
                  name="month"
                  value={formData.month}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {months.map(month => (
                    <option key={month} value={month}>
                      {month}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Actual Value *
                </label>
                <input
                  type="number"
                  name="actual"
                  value={formData.actual}
                  onChange={handleChange}
                  step="0.01"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder={`e.g., ${kpi.target}`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Target Value *
                </label>
                <input
                  type="number"
                  name="target"
                  value={formData.target}
                  onChange={handleChange}
                  step="0.01"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Add Data Point
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export default KPIDataModal;