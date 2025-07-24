import React, { createContext, useContext, useReducer, useEffect } from 'react';

const CRMContext = createContext();

const initialState = {
  contacts: [],
  interactions: [],
  tasks: [],
  analytics: {
    totalContacts: 0,
    recentInteractions: 0,
    pendingTasks: 0,
    monthlyGrowth: 0
  }
};

function crmReducer(state, action) {
  switch (action.type) {
    case 'SET_CONTACTS':
      return { ...state, contacts: action.payload };
    case 'ADD_CONTACT':
      return { ...state, contacts: [...state.contacts, action.payload] };
    case 'UPDATE_CONTACT':
      return {
        ...state,
        contacts: state.contacts.map(contact =>
          contact.id === action.payload.id ? action.payload : contact
        )
      };
    case 'DELETE_CONTACT':
      return {
        ...state,
        contacts: state.contacts.filter(contact => contact.id !== action.payload)
      };
    case 'ADD_INTERACTION':
      return { ...state, interactions: [...state.interactions, action.payload] };
    case 'SET_INTERACTIONS':
      return { ...state, interactions: action.payload };
    case 'ADD_TASK':
      return { ...state, tasks: [...state.tasks, action.payload] };
    case 'UPDATE_TASK':
      return {
        ...state,
        tasks: state.tasks.map(task =>
          task.id === action.payload.id ? action.payload : task
        )
      };
    case 'SET_TASKS':
      return { ...state, tasks: action.payload };
    case 'UPDATE_ANALYTICS':
      return { ...state, analytics: action.payload };
    default:
      return state;
  }
}

export function CRMProvider({ children }) {
  const [state, dispatch] = useReducer(crmReducer, initialState);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedContacts = localStorage.getItem('crm-contacts');
    const savedInteractions = localStorage.getItem('crm-interactions');
    const savedTasks = localStorage.getItem('crm-tasks');

    if (savedContacts) {
      dispatch({ type: 'SET_CONTACTS', payload: JSON.parse(savedContacts) });
    }
    if (savedInteractions) {
      dispatch({ type: 'SET_INTERACTIONS', payload: JSON.parse(savedInteractions) });
    }
    if (savedTasks) {
      dispatch({ type: 'SET_TASKS', payload: JSON.parse(savedTasks) });
    }
  }, []);

  // Save to localStorage when data changes
  useEffect(() => {
    localStorage.setItem('crm-contacts', JSON.stringify(state.contacts));
    updateAnalytics();
  }, [state.contacts]);

  useEffect(() => {
    localStorage.setItem('crm-interactions', JSON.stringify(state.interactions));
    updateAnalytics();
  }, [state.interactions]);

  useEffect(() => {
    localStorage.setItem('crm-tasks', JSON.stringify(state.tasks));
    updateAnalytics();
  }, [state.tasks]);

  const updateAnalytics = () => {
    const totalContacts = state.contacts.length;
    const recentInteractions = state.interactions.filter(
      interaction => {
        const interactionDate = new Date(interaction.date);
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return interactionDate >= weekAgo;
      }
    ).length;
    const pendingTasks = state.tasks.filter(task => !task.completed).length;
    
    dispatch({
      type: 'UPDATE_ANALYTICS',
      payload: {
        totalContacts,
        recentInteractions,
        pendingTasks,
        monthlyGrowth: Math.floor(Math.random() * 20) + 5 // Mock growth
      }
    });
  };

  return (
    <CRMContext.Provider value={{ state, dispatch }}>
      {children}
    </CRMContext.Provider>
  );
}

export function useCRM() {
  const context = useContext(CRMContext);
  if (!context) {
    throw new Error('useCRM must be used within a CRMProvider');
  }
  return context;
}