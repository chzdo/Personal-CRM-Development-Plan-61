import React, { createContext, useContext, useReducer, useEffect } from 'react';

const KPIContext = createContext();

// Sample KPI data
const kpiData = [
  {
    id: '1',
    name: 'Revenue Growth',
    category: 'Financial',
    description: 'Measures the increase in company revenue between two time periods',
    target: 15,
    unit: '%',
    frequency: 'Monthly',
    owner: 'Finance Department',
    data: [
      { month: 'Jan', actual: 12, target: 15 },
      { month: 'Feb', actual: 14, target: 15 },
      { month: 'Mar', actual: 16, target: 15 },
      { month: 'Apr', actual: 13, target: 15 },
      { month: 'May', actual: 17, target: 15 },
      { month: 'Jun', actual: 20, target: 15 },
    ],
    status: 'On Track',
    trend: 'Upward',
    lastUpdated: '2023-06-15T14:30:00Z'
  },
  {
    id: '2',
    name: 'Customer Satisfaction',
    category: 'Customer',
    description: 'Measures the degree to which customers are satisfied with the product or service',
    target: 90,
    unit: '%',
    frequency: 'Quarterly',
    owner: 'Customer Success Team',
    data: [
      { month: 'Jan', actual: 86, target: 90 },
      { month: 'Feb', actual: 88, target: 90 },
      { month: 'Mar', actual: 91, target: 90 },
      { month: 'Apr', actual: 93, target: 90 },
      { month: 'May', actual: 92, target: 90 },
      { month: 'Jun', actual: 94, target: 90 },
    ],
    status: 'Above Target',
    trend: 'Upward',
    lastUpdated: '2023-06-10T09:45:00Z'
  },
  {
    id: '3',
    name: 'Employee Turnover Rate',
    category: 'HR',
    description: 'Measures the rate at which employees leave the company',
    target: 5,
    unit: '%',
    frequency: 'Monthly',
    owner: 'HR Department',
    data: [
      { month: 'Jan', actual: 6.2, target: 5 },
      { month: 'Feb', actual: 5.8, target: 5 },
      { month: 'Mar', actual: 5.5, target: 5 },
      { month: 'Apr', actual: 4.9, target: 5 },
      { month: 'May', actual: 4.5, target: 5 },
      { month: 'Jun', actual: 4.2, target: 5 },
    ],
    status: 'Above Target',
    trend: 'Downward',
    lastUpdated: '2023-06-12T16:20:00Z'
  },
  {
    id: '4',
    name: 'Product Defect Rate',
    category: 'Operations',
    description: 'Measures the percentage of defective products',
    target: 2,
    unit: '%',
    frequency: 'Weekly',
    owner: 'Quality Assurance Team',
    data: [
      { month: 'Jan', actual: 2.8, target: 2 },
      { month: 'Feb', actual: 2.5, target: 2 },
      { month: 'Mar', actual: 2.2, target: 2 },
      { month: 'Apr', actual: 1.9, target: 2 },
      { month: 'May', actual: 1.7, target: 2 },
      { month: 'Jun', actual: 1.5, target: 2 },
    ],
    status: 'Above Target',
    trend: 'Downward',
    lastUpdated: '2023-06-14T11:15:00Z'
  },
  {
    id: '5',
    name: 'Marketing ROI',
    category: 'Marketing',
    description: 'Measures the return on investment for marketing campaigns',
    target: 300,
    unit: '%',
    frequency: 'Quarterly',
    owner: 'Marketing Team',
    data: [
      { month: 'Jan', actual: 280, target: 300 },
      { month: 'Feb', actual: 295, target: 300 },
      { month: 'Mar', actual: 310, target: 300 },
      { month: 'Apr', actual: 325, target: 300 },
      { month: 'May', actual: 340, target: 300 },
      { month: 'Jun', actual: 355, target: 300 },
    ],
    status: 'Above Target',
    trend: 'Upward',
    lastUpdated: '2023-06-08T13:50:00Z'
  }
];

const initialState = {
  kpis: kpiData,
  filteredKpis: kpiData,
  categories: ['All', 'Financial', 'Customer', 'HR', 'Operations', 'Marketing'],
  selectedCategory: 'All',
  searchQuery: '',
  dateRange: {
    startDate: new Date(new Date().setMonth(new Date().getMonth() - 6)),
    endDate: new Date()
  },
  summary: {
    totalKPIs: kpiData.length,
    onTrack: kpiData.filter(kpi => kpi.status === 'On Track').length,
    belowTarget: kpiData.filter(kpi => kpi.status === 'Below Target').length,
    aboveTarget: kpiData.filter(kpi => kpi.status === 'Above Target').length
  }
};

function kpiReducer(state, action) {
  switch (action.type) {
    case 'SET_CATEGORY':
      return {
        ...state,
        selectedCategory: action.payload,
        filteredKpis: action.payload === 'All'
          ? state.kpis
          : state.kpis.filter(kpi => kpi.category === action.payload)
      };
    case 'SET_SEARCH_QUERY':
      return {
        ...state,
        searchQuery: action.payload,
        filteredKpis: state.kpis.filter(kpi => {
          const matchesCategory = state.selectedCategory === 'All' || kpi.category === state.selectedCategory;
          const matchesSearch = kpi.name.toLowerCase().includes(action.payload.toLowerCase()) ||
                               kpi.description.toLowerCase().includes(action.payload.toLowerCase());
          return matchesCategory && matchesSearch;
        })
      };
    case 'SET_DATE_RANGE':
      return {
        ...state,
        dateRange: action.payload
      };
    case 'UPDATE_KPI':
      const updatedKpis = state.kpis.map(kpi =>
        kpi.id === action.payload.id ? action.payload : kpi
      );
      return {
        ...state,
        kpis: updatedKpis,
        filteredKpis: updatedKpis.filter(kpi => {
          const matchesCategory = state.selectedCategory === 'All' || kpi.category === state.selectedCategory;
          const matchesSearch = kpi.name.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
                               kpi.description.toLowerCase().includes(state.searchQuery.toLowerCase());
          return matchesCategory && matchesSearch;
        })
      };
    case 'ADD_KPI':
      const newKpis = [...state.kpis, action.payload];
      return {
        ...state,
        kpis: newKpis,
        filteredKpis: newKpis.filter(kpi => {
          const matchesCategory = state.selectedCategory === 'All' || kpi.category === state.selectedCategory;
          const matchesSearch = kpi.name.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
                               kpi.description.toLowerCase().includes(state.searchQuery.toLowerCase());
          return matchesCategory && matchesSearch;
        }),
        summary: {
          ...state.summary,
          totalKPIs: newKpis.length,
          onTrack: newKpis.filter(kpi => kpi.status === 'On Track').length,
          belowTarget: newKpis.filter(kpi => kpi.status === 'Below Target').length,
          aboveTarget: newKpis.filter(kpi => kpi.status === 'Above Target').length
        }
      };
    case 'DELETE_KPI':
      const filteredKpis = state.kpis.filter(kpi => kpi.id !== action.payload);
      return {
        ...state,
        kpis: filteredKpis,
        filteredKpis: filteredKpis.filter(kpi => {
          const matchesCategory = state.selectedCategory === 'All' || kpi.category === state.selectedCategory;
          const matchesSearch = kpi.name.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
                               kpi.description.toLowerCase().includes(state.searchQuery.toLowerCase());
          return matchesCategory && matchesSearch;
        }),
        summary: {
          ...state.summary,
          totalKPIs: filteredKpis.length,
          onTrack: filteredKpis.filter(kpi => kpi.status === 'On Track').length,
          belowTarget: filteredKpis.filter(kpi => kpi.status === 'Below Target').length,
          aboveTarget: filteredKpis.filter(kpi => kpi.status === 'Above Target').length
        }
      };
    default:
      return state;
  }
}

export function KPIProvider({ children }) {
  const [state, dispatch] = useReducer(kpiReducer, initialState);

  // Update summary whenever KPIs change
  useEffect(() => {
    const summary = {
      totalKPIs: state.kpis.length,
      onTrack: state.kpis.filter(kpi => kpi.status === 'On Track').length,
      belowTarget: state.kpis.filter(kpi => kpi.status === 'Below Target').length,
      aboveTarget: state.kpis.filter(kpi => kpi.status === 'Above Target').length
    };

    if (JSON.stringify(summary) !== JSON.stringify(state.summary)) {
      // Only update if summary changed
      dispatch({ type: 'UPDATE_SUMMARY', payload: summary });
    }
  }, [state.kpis]);

  return (
    <KPIContext.Provider value={{ state, dispatch }}>
      {children}
    </KPIContext.Provider>
  );
}

export function useKPI() {
  const context = useContext(KPIContext);
  if (!context) {
    throw new Error('useKPI must be used within a KPIProvider');
  }
  return context;
}