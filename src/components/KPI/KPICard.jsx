import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';

const { FiTrendingUp, FiTrendingDown, FiMinus, FiBarChart2 } = FiIcons;

function KPICard({ kpi }) {
  const latestData = kpi.data[kpi.data.length - 1];
  const isOnTarget = latestData.actual >= latestData.target;
  const isGoodWhenUp = kpi.name !== 'Employee Turnover Rate' && kpi.name !== 'Product Defect Rate';

  const getTrendIcon = (trend) => {
    if (trend === 'Upward') return FiTrendingUp;
    if (trend === 'Downward') return FiTrendingDown;
    return FiMinus;
  };

  const getTrendColor = (trend) => {
    if (trend === 'Upward') return isGoodWhenUp ? 'text-green-600' : 'text-red-600';
    if (trend === 'Downward') return isGoodWhenUp ? 'text-red-600' : 'text-green-600';
    return 'text-gray-600';
  };

  const getStatusColor = (status) => {
    if (status === 'On Track') return 'bg-green-100 text-green-700';
    if (status === 'Below Target') return 'bg-red-100 text-red-700';
    if (status === 'Above Target') return 'bg-purple-100 text-purple-700';
    return 'bg-gray-100 text-gray-700';
  };

  return (
    <motion.div
      className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-200"
      whileHover={{ y: -2 }}
    >
      <Link to={`/kpi/${kpi.id}`}>
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{kpi.name}</h3>
            <p className="text-sm text-gray-500 mb-3">{kpi.category}</p>
            
            <div className="flex items-center space-x-2 mb-4">
              <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(kpi.status)}`}>
                {kpi.status}
              </span>
              <div className="flex items-center">
                <SafeIcon 
                  icon={getTrendIcon(kpi.trend)} 
                  className={`mr-1 ${getTrendColor(kpi.trend)}`} 
                />
                <span className={`text-xs ${getTrendColor(kpi.trend)}`}>{kpi.trend}</span>
              </div>
            </div>
          </div>
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <SafeIcon icon={FiBarChart2} className="text-blue-600 text-xl" />
          </div>
        </div>
        
        <div className="mt-4">
          <div className="flex items-end justify-between mb-2">
            <div>
              <p className="text-xs text-gray-500">Current</p>
              <p className="text-2xl font-bold text-gray-900">
                {latestData.actual}{kpi.unit}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500">Target</p>
              <p className="text-lg font-medium text-gray-700">
                {latestData.target}{kpi.unit}
              </p>
            </div>
          </div>
          
          {/* Simple progress bar */}
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className={`h-full ${isOnTarget ? 'bg-green-500' : 'bg-red-500'}`} 
              style={{ width: `${Math.min(100, (latestData.actual / latestData.target) * 100)}%` }}
            ></div>
          </div>
        </div>
        
        <div className="mt-4 pt-3 border-t border-gray-100">
          <p className="text-xs text-gray-400">
            Updated {format(new Date(kpi.lastUpdated), 'MMM d, yyyy')}
          </p>
        </div>
      </Link>
    </motion.div>
  );
}

export default KPICard;