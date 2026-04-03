import { useState } from 'react';
import { ChevronRight, Trash2, ShoppingBag } from 'lucide-react';
import { getCategoryIcon } from '../../constants/categories.jsx';

export default function ActivityFeed({ transactions, onDelete }) {
    const [filter, setFilter] = useState('all');

    // Filter transactions based on selected type
    const filteredTransactions = filter === 'all'
        ? transactions
        : transactions.filter(tx => tx.type === filter);

    // Calculate total for the filtered list
    const totalAmount = filteredTransactions.reduce((sum, tx) => sum + tx.amount, 0);

    return (
        <div className="mt-8">
            <div className="flex justify-between items-end mb-6">
                <h2 className="text-lg font-semibold text-white">Transactions</h2>
                <span className="text-sm font-medium text-slate-400">
                    ৳{totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
            </div>

            {/* Toggle switch for Expense/Income */}
            <div className="flex bg-[#1E293B] p-1 mb-6 rounded-xl mx-auto md:mx-0 w-full max-w-[320px]">
                <button
                    onClick={() => setFilter('all')}
                    className={`flex-1 py-1.5 text-sm font-medium rounded-lg transition-all ${filter === 'all' ? 'bg-[#0F172A] text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}
                >
                    All
                </button>
                <button
                    onClick={() => setFilter('expense')}
                    className={`flex-1 py-1.5 text-sm font-medium rounded-lg transition-all ${filter === 'expense' ? 'bg-[#0F172A] text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}
                >
                    Expense
                </button>
                <button
                    onClick={() => setFilter('income')}
                    className={`flex-1 py-1.5 text-sm font-medium rounded-lg transition-all ${filter === 'income' ? 'bg-[#0F172A] text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}
                >
                    Income
                </button>
            </div>

            <div className="space-y-4">
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                    {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                </div>

                {filteredTransactions.length === 0 ? (
                    <div className="text-center py-8 opacity-50 text-sm">No {filter} transactions yet.</div>
                ) : (
                    <div className="bg-[#1E293B] rounded-3xl p-2 space-y-2 relative isolate max-h-[400px] md:max-h-[600px] overflow-y-auto custom-scrollbar">
                        {filteredTransactions.map((tx) => (
                            <div
                                key={tx.id}
                                className={`flex items-center justify-between p-4 rounded-3xl transition-colors group cursor-pointer relative bg-[#1E293B] hover:bg-slate-700/50`}
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center border
                                        ${tx.type === 'income' ? 'border-green-500/20 text-green-500' : 'border-yellow-500/20 text-yellow-500'}
                                    `}>
                                        {getCategoryIcon(tx.category)}
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-slate-100">{tx.category}</h3>
                                        <p className="text-xs text-slate-400">{tx.subcategory || tx.note}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    <div className="text-right">
                                        <p className={`font-bold ${tx.type === 'income' ? 'text-green-500' : 'text-white'}`}>
                                            {tx.type === 'income' ? '+' : '-'}৳{tx.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                        </p>
                                    </div>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); onDelete(tx.id); }}
                                        className="opacity-0 group-hover:opacity-100 p-2 text-slate-500 hover:text-red-500 transition-all md:block hidden ml-2"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                                <div className="absolute bottom-0 left-6 right-6 h-[1px] bg-slate-700/50 -z-10 translate-y-2 opacity-0 group-hover:opacity-0 pointer-events-none last:hidden"></div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
