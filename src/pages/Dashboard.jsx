import React from 'react';
import { motion } from 'framer-motion';
import { useKPI } from '../context/KPIContext';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import SummaryCard from '../components/Dashboard/SummaryCard';
import KPITrendChart from '../components/Dashboard/KPITrendChart';
import KPIStatusDistribution from '../components/Dashboard/KPIStatusDistribution';
import RecentUpdates from '../components/Dashboard/RecentUpdates';

const { FiTrendingUp, FiTrendingDown, FiTarget, FiAlertCircle, FiCheckCircle, FiArrowRight } = FiIcons;

function Dashboard() {
  const { state } = useKPI();
  const { summary, kpis } = state;
  
  // Sort KPIs by last updated date for recent updates
  const recentlyUpdatedKpis = [...kpis]
    .sort((a, b) => new Date(b.lastUpdated) - new Date(a.lastUpdated))
    .slice(0, 5);

  // Get top performing KPIs
  const topPerformingKpis = [...kpis]
    .filter(kpi => {
      const latestData = kpi.data[kpi.data.length - 1];
      return latestData.actual > latestData.target;
    })
    .sort((a, b) => {
      const aLatestData = a.data[a.data.length - 1];
      const bLatestData = b.data[b.data.length - 1];
      const aPerformance = (aLatestData.actual / aLatestData.target) * 100;
      const bPerformance = (bLatestData.actual / bLatestData.target) * 100;
      return bPerformance - aPerformance;
    })
    .slice(0, 3);

  // Summary cards data
  const summaryCards = [
    {
      title: 'Total KPIs',
      value: summary.totalKPIs,
      icon: FiTarget,
      color: 'blue',
      change: '+2 from last month'
    },
    {
      title: 'On Track',
      value: summary.onTrack,
      icon: FiCheckCircle,
      color: 'green',
      change: '+1 from last month'
    },
    {
      title: 'Below Target',
      value: summary.belowTarget,
      icon: FiAlertCircle,
      color: 'red',
      change: '-1 from last month'
    },
    {
      title: 'Above Target',
      value: summary.aboveTarget,
      icon: FiTrendingUp,
      color: 'purple',
      change: '+2 from last month'
    }
  ];

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-2">KPI Dashboard</h1>
        <p className="text-gray-600">Overview of your key performance indicators</p>
      </motion.div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {summaryCards.map((card, index) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <SummaryCard {...card} />
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* KPI Trends */}
        <motion.div
          className="lg:col-span-2"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">KPI Trends</h3>
              <Link
                to="/reports"
                className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                <span>View all</span>
                <SafeIcon icon={FiArrowRight} className="text-xs" />
              </Link>
            </div>
            <KPITrendChart kpis={topPerformingKpis} />
          </div>
        </motion.div>

        {/* KPI Status Distribution */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Status Distribution</h3>
            <KPIStatusDistribution 
              onTrack={summary.onTrack} 
              belowTarget={summary.belowTarget} 
              aboveTarget={summary.aboveTarget} 
            />
          </div>
        </motion.div>
      </div>

      {/* Recent Updates */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Recent Updates</h3>
            <Link
              to="/reports"
              className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              <span>View all</span>
              <SafeIcon icon={FiArrowRight} className="text-xs" />
            </Link>
          </div>
          <RecentUpdates kpis={recentlyUpdatedKpis} />
        </div>
      </motion.div>
    </div>
  );
}

export default Dashboard;