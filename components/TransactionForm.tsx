
import React, { useState } from 'react';
import { Transaction, TransactionType } from '../types';
import { CATEGORIES } from '../constants';
import { CreditCard, CalendarClock } from 'lucide-react';

interface TransactionFormProps {
  onAddTransaction: (transaction: Transaction | Transaction[]) => void;
  onCancel: () => void;
}

const TransactionForm: React.FC<TransactionFormProps> = ({ onAddTransaction, onCancel }) => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<TransactionType>('expense');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [isFixed, setIsFixed] = useState(false);
  
  // Installment state
  const [isInstallment, setIsInstallment] = useState(false);
  const [totalInstallments, setTotalInstallments] = useState(2);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !amount) return;

    const numericAmount = parseFloat(amount);
    const baseDate = new Date();

    if (type === 'expense' && isInstallment) {
        // Generate multiple transactions for installments
        const newTransactions: Transaction[] = [];
        
        for (let i = 0; i < totalInstallments; i++) {
            const date = new Date(baseDate);
            date.setMonth(baseDate.getMonth() + i);
            
            newTransactions.push({
                id: crypto.randomUUID(),
                description: `${description}`,
                amount: numericAmount, // Amount per installment
                type,
                category,
                date: date.toISOString(),
                isFixed: false, // Installments are usually temporary, not "fixed monthly" indefinitely
                installment: {
                    current: i + 1,
                    total: totalInstallments
                }
            });
        }
        onAddTransaction(newTransactions);

    } else {
        // Single transaction
        const newTransaction: Transaction = {
            id: crypto.randomUUID(),
            description,
            amount: numericAmount,
            type,
            category,
            date: baseDate.toISOString(),
            isFixed,
        };
        onAddTransaction(newTransaction);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-lg border border-slate-100 animate-in slide-in-from-bottom-4">
      <h2 className="text-2xl font-bold text-slate-800 mb-6">Novo Lançamento</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Type Selection */}
        <div className="flex space-x-4">
            <button
                type="button"
                onClick={() => { setType('expense'); setIsInstallment(false); }}
                className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-colors ${
                    type === 'expense' 
                    ? 'bg-rose-100 text-rose-700 border-2 border-rose-200' 
                    : 'bg-slate-50 text-slate-500 border border-slate-200 hover:bg-slate-100'
                }`}
            >
                Despesa
            </button>
            <button
                type="button"
                onClick={() => { setType('income'); setIsInstallment(false); }}
                className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-colors ${
                    type === 'income' 
                    ? 'bg-emerald-100 text-emerald-700 border-2 border-emerald-200' 
                    : 'bg-slate-50 text-slate-500 border border-slate-200 hover:bg-slate-100'
                }`}
            >
                Receita
            </button>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Descrição</label>
          <div className="relative">
            <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                placeholder={type === 'expense' ? "Ex: Notebook Novo" : "Ex: Venda de Item"}
                required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
                {isInstallment ? 'Valor da Parcela (R$)' : 'Valor Total (R$)'}
            </label>
            <input
              type="number"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
              placeholder="0.00"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Categoria</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none bg-white"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Expense specific options: Fixed vs Installment */}
        {type === 'expense' && (
            <div className="space-y-4">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Checkbox for Fixed Expense */}
                    <div className={`flex items-center space-x-3 p-4 rounded-lg border transition-all ${
                        isFixed ? 'bg-emerald-50 border-emerald-200' : 'bg-slate-50 border-slate-200'
                    } ${isInstallment ? 'opacity-50 pointer-events-none' : ''}`}>
                        <input 
                            type="checkbox" 
                            id="isFixed" 
                            checked={isFixed}
                            disabled={isInstallment}
                            onChange={(e) => setIsFixed(e.target.checked)}
                            className="w-5 h-5 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
                        />
                        <label htmlFor="isFixed" className="text-sm text-slate-700 font-medium cursor-pointer flex items-center gap-2">
                            <CalendarClock className="w-4 h-4" />
                            Gasto Fixo Mensal
                        </label>
                    </div>

                    {/* Checkbox for Installment */}
                    <div className={`flex items-center space-x-3 p-4 rounded-lg border transition-all ${
                        isInstallment ? 'bg-indigo-50 border-indigo-200' : 'bg-slate-50 border-slate-200'
                    } ${isFixed ? 'opacity-50 pointer-events-none' : ''}`}>
                         <input 
                            type="checkbox" 
                            id="isInstallment" 
                            checked={isInstallment}
                            disabled={isFixed}
                            onChange={(e) => setIsInstallment(e.target.checked)}
                            className="w-5 h-5 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
                        />
                        <label htmlFor="isInstallment" className="text-sm text-slate-700 font-medium cursor-pointer flex items-center gap-2">
                             <CreditCard className="w-4 h-4" />
                             Compra Parcelada
                        </label>
                    </div>
                 </div>

                 {isInstallment && (
                    <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100 animate-in fade-in slide-in-from-top-2">
                        <label className="block text-sm font-medium text-indigo-900 mb-1">Quantidade de Parcelas</label>
                        <div className="flex items-center space-x-4">
                            <input
                                type="number"
                                min="2"
                                max="60"
                                value={totalInstallments}
                                onChange={(e) => setTotalInstallments(parseInt(e.target.value))}
                                className="w-32 px-4 py-2 rounded-lg border border-indigo-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                            />
                            <span className="text-sm text-indigo-700">
                                Serão gerados lançamentos automáticos para os próximos <strong>{totalInstallments} meses</strong>.
                            </span>
                        </div>
                    </div>
                 )}
            </div>
        )}

        {/* Income specific option: Fixed only */}
        {type === 'income' && (
             <div className="flex items-center space-x-3 bg-slate-50 p-4 rounded-lg border border-slate-200">
                <input 
                    type="checkbox" 
                    id="isFixedIncome" 
                    checked={isFixed}
                    onChange={(e) => setIsFixed(e.target.checked)}
                    className="w-5 h-5 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
                />
                <label htmlFor="isFixedIncome" className="text-sm text-slate-700 font-medium cursor-pointer">
                    É uma receita fixa mensal?
                </label>
            </div>
        )}

        <div className="flex items-center justify-end space-x-4 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2.5 rounded-lg text-slate-600 font-medium hover:bg-slate-100 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className={`px-6 py-2.5 rounded-lg text-white font-medium shadow-lg transition-all ${
                type === 'income' 
                ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200' 
                : 'bg-rose-600 hover:bg-rose-700 shadow-rose-200'
            }`}
          >
            {isInstallment ? 'Gerar Parcelas' : 'Adicionar Lançamento'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TransactionForm;
