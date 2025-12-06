import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import TransactionForm from './components/TransactionForm';
import TransactionList from './components/TransactionList';
import Login from './components/Login';
import { Transaction } from './types';
import { INITIAL_TRANSACTIONS } from './constants';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('ecofin_transactions');
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  });

  // Check for session on mount
  useEffect(() => {
    // Simple session check (can be expanded to check token validity in real app)
    const session = localStorage.getItem('ecofin_session');
    if (session === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('ecofin_transactions', JSON.stringify(transactions));
  }, [transactions]);

  const handleLogin = () => {
    setIsAuthenticated(true);
    localStorage.setItem('ecofin_session', 'true');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('ecofin_session');
  };

  const addTransaction = (transactionOrArray: Transaction | Transaction[]) => {
    if (Array.isArray(transactionOrArray)) {
        setTransactions((prev) => [...transactionOrArray, ...prev]);
    } else {
        setTransactions((prev) => [transactionOrArray, ...prev]);
    }
    setActiveTab('dashboard'); // Go back to dashboard after adding
  };

  const deleteTransaction = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este lançamento?')) {
      setTransactions((prev) => prev.filter((t) => t.id !== id));
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard transactions={transactions} />;
      case 'add':
        return (
          <TransactionForm 
            onAddTransaction={addTransaction} 
            onCancel={() => setActiveTab('dashboard')} 
          />
        );
      case 'list':
        return <TransactionList transactions={transactions} onDelete={deleteTransaction} />;
      default:
        return <Dashboard transactions={transactions} />;
    }
  };

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab} onLogout={handleLogout}>
      {renderContent()}
    </Layout>
  );
};

export default App;