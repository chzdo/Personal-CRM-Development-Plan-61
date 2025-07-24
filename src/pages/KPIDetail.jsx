import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useKPI } from '../context/KPIContext';
import { format } from 'date-fns';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import KPIModal from '../components/KPI/KPIModal';
import KPIDataModal from '../components/KPI/KPIDataModal';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

const { FiArrowLeft, FiEdit, FiTrash2, FiPlus, FiCalendar, FiUser, FiRepeat, FiTarget } = FiIcons;

function KPIDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { state, dispatch } = useKPI();
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDataModal, setShowDataModal] = useState(false);
  
  const kpi = state.kpis.find(k => k.id === id);
  
  if (!kpi) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">KPI not found</h2>
        <button
          onClick={() => navigate('/reports')}
          className="text-blue-600 hover:text-blue-700"
        >
          Back to KPI Reports
        </button>
      </div>
    );
  }

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this KPI?')) {
      dispatch({ type: 'DELETE_KPI', payload: kpi.id });
      navigate('/reports');
    }
  };

  const getStatusColor = (status) => {
    if (status === 'On Track') return 'bg-green-100 text-green-700';
    if (status === 'Below Target') return 'bg-red-100 text-red-700';
    if (status === 'Above Target') return 'bg-purple-100 text-purple-700';
    return 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="space-y-6">
      <motion.div
        className="flex items-center justify-between"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/reports')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <SafeIcon icon={FiArrowLeft} className="text-gray-600" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{kpi.name}</h1>
            <div className="flex items-center space-x-2 mt-1">
              <span className="text-gray-600">{kpi.category}</span>
              <span className="text-gray-400">•</span>
              <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(kpi.status)}`}>
                {kpi.status}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <motion.button
            onClick={() => setShowEditModal(true)}
            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <SafeIcon icon={FiEdit} />
            <span>Edit</span>
          </motion.button>
          <motion.button
            onClick={handleDelete}
            className="flex items-center space-x-2 px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <SafeIcon icon={FiTrash2} />
            <span>Delete</span>
          </motion.button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* KPI Info */}
        <motion.div
          className="lg:col-span-1"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">KPI Details</h3>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <SafeIcon icon={FiTarget} className="text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Target</p>
                  <p className="text-gray-900 font-medium">{kpi.target}{kpi.unit}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <SafeIcon icon={FiCalendar} className="text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Frequency</p>
                  <p className="text-gray-900">{kpi.frequency}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <SafeIcon icon={FiUser} className="text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Owner</p>
                  <p className="text-gray-900">{kpi.owner}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <SafeIcon icon={FiRepeat} className="text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Last Updated</p>
                  <p className="text-gray-900">{format(new Date(kpi.lastUpdated), 'MMMM d, yyyy')}</p>
                </div>
              </div>
            </div>
            
            {kpi.description && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="text-sm font-medium text-gray-900 mb-2">Description</h3>
                <p className="text-gray-600 text-sm">{kpi.description}</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* KPI Chart */}
        <motion.div
          className="lg:col-span-2"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Performance Trend</h3>
              <motion.button
                onClick={() => setShowDataModal(true)}
                className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <SafeIcon icon={FiPlus} />
                <span>Add Data Point</span>
              </motion.button>
            </div>

            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={kpi.data}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => `${value}${kpi.unit}`} />
                  <ReferenceLine 
                    y={kpi.target} 
                    stroke="#8884d8" 
                    strokeDasharray="3 3"
                    label={{ value: `Target: ${kpi.target}${kpi.unit}`, position: 'insideTopLeft' }} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="actual" 
                    stroke="#3B82F6" 
                    strokeWidth={2}
                    dot={{ r: 4 }} 
                    activeDot={{ r: 8 }}
                    name="Actual"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Data Table */}
            <div className="mt-8">
              <h4 className="text-md font-medium text-gray-900 mb-3">Historical Data</h4>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Period
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actual
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Target
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Variance
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {[...kpi.data].reverse().map((dataPoint, index) => {
                      const variance = dataPoint.actual - dataPoint.target;
                      const isPositiveVariance = variance >= 0;
                      return (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {dataPoint.month}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {dataPoint.actual}{kpi.unit}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {dataPoint.target}{kpi.unit}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <span className={isPositiveVariance ? 'text-green-600' : 'text-red-600'}>
                              {isPositiveVariance ? '+' : ''}{variance.toFixed(1)}{kpi.unit}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {showEditModal && (
        <KPIModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          kpi={kpi}
          categories={state.categories.filter(c => c !== 'All')}
        />
      )}

      {showDataModal && (
        <KPIDataModal
          isOpen={showDataModal}
          onClose={() => setShowDataModal(false)}
          kpi={kpi}
        />
      )}
    </div>
  );
}

export default KPIDetail;