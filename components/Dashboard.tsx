import React, { useMemo, useState } from 'react';
import { Transaction } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';
import { ArrowUpCircle, ArrowDownCircle, Target, AlertTriangle, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { COLORS } from '../constants';

interface DashboardProps {
  transactions: Transaction[];
}

const Dashboard: React.FC<DashboardProps> = ({ transactions }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Helpers for date filtering
  const getMonthData = (date: Date, txs: Transaction[]) => {
    return txs.filter(t => {
      const tDate = new Date(t.date);
      return tDate.getMonth() === date.getMonth() && tDate.getFullYear() === date.getFullYear();
    });
  };

  const getNextMonthDate = (date: Date) => {
    const d = new Date(date);
    d.setMonth(d.getMonth() + 1);
    return d;
  };

  const getPreviousMonthDate = (date: Date) => {
    const d = new Date(date);
    d.setMonth(d.getMonth() - 1);
    return d;
  };

  const calculateStats = (txs: Transaction[]) => {
    const income = txs
      .filter((t) => t.type === 'income')
      .reduce((acc, curr) => acc + curr.amount, 0);
    
    const expense = txs
      .filter((t) => t.type === 'expense')
      .reduce((acc, curr) => acc + curr.amount, 0);

    const fixedExpenses = txs
      .filter(t => t.type === 'expense' && t.isFixed)
      .reduce((acc, curr) => acc + curr.amount, 0);

    // Calculate installment total for this period
    const installmentExpenses = txs
        .filter(t => t.type === 'expense' && !!t.installment)
        .reduce((acc, curr) => acc + curr.amount, 0);

    return { income, expense, balance: income - expense, fixedExpenses, installmentExpenses };
  };

  // --- Derived Data ---

  // 1. Current Selected Month Stats
  const currentMonthTransactions = useMemo(() => getMonthData(selectedDate, transactions), [selectedDate, transactions]);
  const currentStats = useMemo(() => calculateStats(currentMonthTransactions), [currentMonthTransactions]);

  // 2. Next Month Projection (Actual data + Fixed Recurrence)
  // Logic: Take actual transactions scheduled for next month (like installments) AND add Fixed Expenses/Incomes that recur
  const nextMonthDate = useMemo(() => getNextMonthDate(selectedDate), [selectedDate]);
  
  const nextMonthStats = useMemo(() => {
      // Get actual scheduled transactions for next month (e.g. installments)
      const scheduledNextMonth = getMonthData(nextMonthDate, transactions);
      const scheduledStats = calculateStats(scheduledNextMonth);

      // Estimate fixed items from current month that should repeat
      // (Simple logic: assume all fixed items from this month repeat next month if not already present, 
      // but simpler is to just sum current month's fixed items and add to next month's variable scheduled items)
      
      // Better Projection Logic:
      // projected Income = (Fixed Income from Current) + (Scheduled Income for Next)
      // projected Expense = (Fixed Expense from Current) + (Scheduled Expense for Next)
      
      const currentFixedIncome = currentMonthTransactions
        .filter(t => t.type === 'income' && t.isFixed)
        .reduce((acc, curr) => acc + curr.amount, 0);

      const currentFixedExpense = currentMonthTransactions
        .filter(t => t.type === 'expense' && t.isFixed)
        .reduce((acc, curr) => acc + curr.amount, 0);

      return {
          income: currentFixedIncome + scheduledStats.income, // Assuming non-fixed income isn't guaranteed
          expense: currentFixedExpense + scheduledStats.expense,
          balance: (currentFixedIncome + scheduledStats.income) - (currentFixedExpense + scheduledStats.expense)
      };
  }, [currentMonthTransactions, transactions, nextMonthDate]);


  // Chart Data: Expenses by Category (Current Month)
  const categoryData = useMemo(() => {
    const data: { [key: string]: number } = {};
    currentMonthTransactions
      .filter((t) => t.type === 'expense')
      .forEach((t) => {
        data[t.category] = (data[t.category] || 0) + t.amount;
      });
    return Object.keys(data).map((key) => ({ name: key, value: data[key] }));
  }, [currentMonthTransactions]);

  // Chart Data: Projection
  const projectionData = [
    {
        name: 'Este Mês',
        Entradas: currentStats.income,
        Saídas: currentStats.expense,
        Saldo: currentStats.balance
    },
    {
        name: 'Próximo Mês (Est.)',
        Entradas: nextMonthStats.income,
        Saídas: nextMonthStats.expense,
        Saldo: nextMonthStats.balance
    }
  ];

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  const currentMonthName = selectedDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-4">
          <h2 className="text-2xl font-bold text-slate-800">Visão Geral</h2>
          
          <div className="flex items-center bg-white rounded-lg shadow-sm border border-slate-200 p-1">
            <button onClick={() => setSelectedDate(getPreviousMonthDate(selectedDate))} className="p-2 hover:bg-slate-50 rounded-md">
                <ChevronLeft className="w-5 h-5 text-slate-600" />
            </button>
            <div className="px-4 font-medium text-slate-700 min-w-[140px] text-center capitalize flex items-center justify-center gap-2">
                <Calendar className="w-4 h-4 text-slate-400" />
                {currentMonthName}
            </div>
            <button onClick={() => setSelectedDate(getNextMonthDate(selectedDate))} className="p-2 hover:bg-slate-50 rounded-md">
                <ChevronRight className="w-5 h-5 text-slate-600" />
            </button>
          </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col">
          <span className="text-slate-500 text-sm font-medium flex items-center gap-2">
             <ArrowUpCircle className="w-4 h-4 text-emerald-500" /> Receitas
          </span>
          <span className="text-2xl font-bold text-slate-800 mt-2">{formatCurrency(currentStats.income)}</span>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col">
          <span className="text-slate-500 text-sm font-medium flex items-center gap-2">
            <ArrowDownCircle className="w-4 h-4 text-rose-500" /> Despesas
          </span>
          <span className="text-2xl font-bold text-slate-800 mt-2">{formatCurrency(currentStats.expense)}</span>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col">
          <span className="text-slate-500 text-sm font-medium flex items-center gap-2">
            <Target className="w-4 h-4 text-blue-500" /> Saldo Mensal
          </span>
          <span className={`text-2xl font-bold mt-2 ${currentStats.balance >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
            {formatCurrency(currentStats.balance)}
          </span>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col">
            <span className="text-slate-500 text-sm font-medium flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500" /> Comprometido
            </span>
            <span className="text-2xl font-bold text-slate-800 mt-2">
                {formatCurrency(currentStats.fixedExpenses + currentStats.installmentExpenses)}
            </span>
            <span className="text-xs text-slate-400 mt-1">Fixo + Parcelas</span>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Expenses by Category */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Gastos deste Mês</h3>
          <div className="h-64">
             {categoryData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    >
                    {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                    </Pie>
                    <Tooltip formatter={(value: any) => formatCurrency(Number(value))} />
                    <Legend />
                </PieChart>
                </ResponsiveContainer>
             ) : (
                 <div className="h-full flex items-center justify-center text-slate-400 text-sm">Sem dados neste mês</div>
             )}
          </div>
        </div>

        {/* Projection Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Projeção Futura</h3>
          <p className="text-xs text-slate-500 mb-4">
              Compara este mês com o próximo, somando seus <b>Gastos Fixos</b> e <b>Parcelas Futuras</b> já cadastradas.
          </p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={projectionData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} tickFormatter={(val) => `R$${val/1000}k`} />
                <Tooltip formatter={(value: any) => formatCurrency(Number(value))} cursor={{fill: 'transparent'}} />
                <Legend />
                <Bar dataKey="Entradas" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Saídas" fill="#ef4444" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Saldo" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;