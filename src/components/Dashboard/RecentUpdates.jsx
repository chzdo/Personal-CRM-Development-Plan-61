import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';

const { FiTrendingUp, FiTrendingDown, FiMinus } = FiIcons;

function RecentUpdates({ kpis }) {
  if (!kpis || kpis.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No recent KPI updates</p>
      </div>
    );
  }

  const getTrendIcon = (trend) => {
    if (trend === 'Upward') return FiTrendingUp;
    if (trend === 'Downward') return FiTrendingDown;
    return FiMinus;
  };

  const getTrendColor = (trend, isGoodWhenUp = true) => {
    if (trend === 'Upward') return isGoodWhenUp ? 'text-green-600' : 'text-red-600';
    if (trend === 'Downward') return isGoodWhenUp ? 'text-red-600' : 'text-green-600';
    return 'text-gray-600';
  };

  return (
    <div className="space-y-4">
      {kpis.map((kpi, index) => {
        const latestData = kpi.data[kpi.data.length - 1];
        const isOnTarget = latestData.actual >= latestData.target;
        const isGoodWhenUp = kpi.name !== 'Employee Turnover Rate' && kpi.name !== 'Product Defect Rate';

        return (
          <motion.div
            key={kpi.id}
            className="flex items-start space-x-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className={`p-2 rounded-lg ${isOnTarget ? 'bg-green-50' : 'bg-red-50'}`}>
              <SafeIcon 
                icon={getTrendIcon(kpi.trend)} 
                className={getTrendColor(kpi.trend, isGoodWhenUp)} 
              />
            </div>
            
            <div className="flex-1 min-w-0">
              <Link to={`/kpi/${kpi.id}`} className="hover:text-blue-600">
                <h4 className="text-sm font-medium text-gray-900">{kpi.name}</h4>
              </Link>
              <p className="text-sm text-gray-600 mt-1">
                {latestData.month}: {latestData.actual}{kpi.unit} {' '}
                <span className={isOnTarget ? 'text-green-600' : 'text-red-600'}>
                  ({isOnTarget ? 'above' : 'below'} target of {latestData.target}{kpi.unit})
                </span>
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Updated {format(new Date(kpi.lastUpdated), 'MMM d, yyyy')}
              </p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

export default RecentUpdates;