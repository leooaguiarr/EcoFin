import React from 'react';
import { Transaction } from '../types';
import { Trash2, Repeat, CreditCard } from 'lucide-react';

interface TransactionListProps {
  transactions: Transaction[];
  onDelete: (id: string) => void;
}

const TransactionList: React.FC<TransactionListProps> = ({ transactions, onDelete }) => {
  const sortedTransactions = [...transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  if (transactions.length === 0) {
    return (
      <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-slate-100">
        <p className="text-slate-400">Nenhum lançamento encontrado. Comece adicionando seus gastos!</p>
      </div>
    );
  }

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('pt-BR');
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="p-6 border-b border-slate-100">
        <h2 className="text-xl font-bold text-slate-800">Extrato de Lançamentos</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50 text-slate-700 uppercase font-medium">
            <tr>
              <th className="px-6 py-4">Data</th>
              <th className="px-6 py-4">Descrição</th>
              <th className="px-6 py-4">Categoria</th>
              <th className="px-6 py-4">Tipo</th>
              <th className="px-6 py-4 text-right">Valor</th>
              <th className="px-6 py-4 text-center">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {sortedTransactions.map((t) => (
              <tr key={t.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">{formatDate(t.date)}</td>
                <td className="px-6 py-4 font-medium text-slate-900 flex items-center gap-2">
                    {t.description}
                    {t.isFixed && (
                      <span title="Recorrente">
                        <Repeat className="w-3 h-3 text-emerald-500" />
                      </span>
                    )}
                    {t.installment && (
                      <span className="flex items-center gap-1 text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full" title={`Parcela ${t.installment.current} de ${t.installment.total}`}>
                        <CreditCard className="w-3 h-3" />
                        {t.installment.current}/{t.installment.total}
                      </span>
                    )}
                </td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
                    {t.category}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    t.type === 'income' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                  }`}>
                    {t.type === 'income' ? 'Receita' : 'Despesa'}
                  </span>
                </td>
                <td className={`px-6 py-4 text-right font-bold ${
                   t.type === 'income' ? 'text-emerald-600' : 'text-rose-600'
                }`}>
                  {t.type === 'expense' ? '-' : '+'} {formatCurrency(t.amount)}
                </td>
                <td className="px-6 py-4 text-center">
                  <button
                    onClick={() => onDelete(t.id)}
                    className="text-slate-400 hover:text-rose-500 transition-colors p-1"
                    title="Excluir"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionList;