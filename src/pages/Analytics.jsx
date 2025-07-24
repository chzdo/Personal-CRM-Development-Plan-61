import React from 'react';
import { motion } from 'framer-motion';
import { useCRM } from '../context/CRMContext';
import ReactECharts from 'echarts-for-react';
import { format, subMonths, eachMonthOfInterval } from 'date-fns';

function Analytics() {
  const { state } = useCRM();

  // Prepare data for charts
  const last6Months = eachMonthOfInterval({
    start: subMonths(new Date(), 5),
    end: new Date()
  });

  const monthlyData = last6Months.map(month => {
    const monthContacts = state.contacts.filter(contact => {
      const contactDate = new Date(contact.createdAt);
      return contactDate.getMonth() === month.getMonth() && 
             contactDate.getFullYear() === month.getFullYear();
    }).length;

    const monthInteractions = state.interactions.filter(interaction => {
      const interactionDate = new Date(interaction.date);
      return interactionDate.getMonth() === month.getMonth() && 
             interactionDate.getFullYear() === month.getFullYear();
    }).length;

    return {
      month: format(month, 'MMM'),
      contacts: monthContacts,
      interactions: monthInteractions
    };
  });

  // Contact growth chart
  const contactGrowthOption = {
    title: {
      text: 'Contact Growth',
      left: 'center'
    },
    tooltip: {
      trigger: 'axis'
    },
    xAxis: {
      type: 'category',
      data: monthlyData.map(d => d.month)
    },
    yAxis: {
      type: 'value'
    },
    series: [{
      data: monthlyData.map(d => d.contacts),
      type: 'line',
      smooth: true,
      areaStyle: {},
      itemStyle: {
        color: '#3b82f6'
      }
    }]
  };

  // Interaction types chart
  const interactionTypes = state.interactions.reduce((acc, interaction) => {
    acc[interaction.type] = (acc[interaction.type] || 0) + 1;
    return acc;
  }, {});

  const interactionTypesOption = {
    title: {
      text: 'Interaction Types',
      left: 'center'
    },
    tooltip: {
      trigger: 'item'
    },
    series: [{
      type: 'pie',
      radius: '50%',
      data: Object.entries(interactionTypes).map(([type, count]) => ({
        value: count,
        name: type.charAt(0).toUpperCase() + type.slice(1)
      })),
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      }
    }]
  };

  // Monthly activity chart
  const monthlyActivityOption = {
    title: {
      text: 'Monthly Activity',
      left: 'center'
    },
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      data: ['Contacts Added', 'Interactions'],
      top: 30
    },
    xAxis: {
      type: 'category',
      data: monthlyData.map(d => d.month)
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: 'Contacts Added',
        type: 'bar',
        data: monthlyData.map(d => d.contacts),
        itemStyle: {
          color: '#3b82f6'
        }
      },
      {
        name: 'Interactions',
        type: 'bar',
        data: monthlyData.map(d => d.interactions),
        itemStyle: {
          color: '#10b981'
        }
      }
    ]
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics</h1>
        <p className="text-gray-600">Insights into your relationship management</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <ReactECharts option={contactGrowthOption} style={{ height: '300px' }} />
        </motion.div>

        <motion.div
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <ReactECharts option={interactionTypesOption} style={{ height: '300px' }} />
        </motion.div>
      </div>

      <motion.div
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <ReactECharts option={monthlyActivityOption} style={{ height: '400px' }} />
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Average Interactions</h3>
          <p className="text-3xl font-bold text-primary-600">
            {state.contacts.length > 0 
              ? Math.round(state.interactions.length / state.contacts.length * 10) / 10
              : 0
            }
          </p>
          <p className="text-sm text-gray-500 mt-1">per contact</p>
        </motion.div>

        <motion.div
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Most Active Month</h3>
          <p className="text-3xl font-bold text-green-600">
            {monthlyData.reduce((max, current) => 
              current.interactions > max.interactions ? current : max, 
              { month: 'N/A', interactions: 0 }
            ).month}
          </p>
          <p className="text-sm text-gray-500 mt-1">for interactions</p>
        </motion.div>

        <motion.div
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Growth Rate</h3>
          <p className="text-3xl font-bold text-purple-600">
            {state.analytics.monthlyGrowth}%
          </p>
          <p className="text-sm text-gray-500 mt-1">this month</p>
        </motion.div>
      </div>
    </div>
  );
}

export default Analytics;