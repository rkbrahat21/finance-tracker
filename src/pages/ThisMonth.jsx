import { useState, useEffect, useMemo, Fragment } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, CartesianGrid } from 'recharts';
import {
    ArrowUpRight, ArrowDownLeft, TrendingUp, ShoppingBag,
    Calendar, Wallet, PiggyBank, Plus, Edit3, Trash2, X, Check, Search, Layers
} from 'lucide-react';
import { api } from '../services/api';
import { getCategoryIcon } from '../constants/categories.jsx';
import TransactionForm from '../components/transactions/TransactionForm';

export default function ThisMonth() {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState(null);
    const [transactions, setTransactions] = useState([]);

    // UI State
    const [showForm, setShowForm] = useState(false);
    const [editingTx, setEditingTx] = useState(null);
    const [activeTab, setActiveTab] = useState('expense'); // 'expense' or 'income'
    const [searchQuery, setSearchQuery] = useState('');
    const [deleteConfirmTx, setDeleteConfirmTx] = useState(null);

    const currentMonthISO = new Date().toISOString().slice(0, 7); // YYYY-MM
    const [currentPage, setCurrentPage] = useState(1);
    const [daysPerPage] = useState(1);

    const loadData = async () => {
        setLoading(true);
        try {
            const [statsData, txData] = await Promise.all([
                api.getStatistics({ month: currentMonthISO }),
                api.getTransactions()
            ]);
            setStats(statsData);
            // Filter transactions for current month only
            setTransactions(txData.filter(t => t.date.startsWith(currentMonthISO)));
        } catch (err) {
            console.error("Failed to load ThisMonth data", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
        setCurrentPage(1);
    }, [currentMonthISO, activeTab, searchQuery]);

    const confirmDelete = async () => {
        if (!deleteConfirmTx) return;
        try {
            await api.deleteTransaction(deleteConfirmTx.id);
            setDeleteConfirmTx(null);
            loadData();
        } catch (err) {
            console.error(err);
        }
    };

    const handleFormSubmit = async (data) => {
        try {
            if (editingTx) {
                await api.updateTransaction(editingTx.id, data);
            } else {
                await api.addTransaction(data);
            }
            setShowForm(false);
            setEditingTx(null);
            loadData();
        } catch (err) {
            console.error(err);
        }
    };

    const filteredTransactions = transactions.filter(t => {
        const matchesSearch = t.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
            t.note.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter = t.type === activeTab;
        return matchesSearch && matchesFilter;
    });

    const todayISOStr = new Date().toISOString().slice(0, 10);
    const todayTotal = transactions
        .filter(t => t.type === activeTab && t.date.startsWith(todayISOStr))
        .reduce((sum, t) => sum + t.amount, 0);

    const todayExpenses = transactions
        .filter(t => t.type === 'expense' && t.date.startsWith(todayISOStr))
        .reduce((sum, t) => sum + t.amount, 0);

    const groupedData = useMemo(() => {
        const groups = filteredTransactions.reduce((acc, tx) => {
            const d = tx.date.split('T')[0];
            if (!acc[d]) acc[d] = { date: d, items: [], totalExpense: 0, totalIncome: 0 };
            acc[d].items.push(tx);
            if (tx.type === 'expense') acc[d].totalExpense += tx.amount;
            else acc[d].totalIncome += tx.amount;
            return acc;
        }, {});
        return Object.values(groups).sort((a, b) => b.date.localeCompare(a.date));
    }, [filteredTransactions]);

    const paginatedDays = useMemo(() => {
        const start = (currentPage - 1) * daysPerPage;
        return groupedData.slice(start, start + daysPerPage);
    }, [groupedData, currentPage, daysPerPage]);

    const totalPages = Math.ceil(groupedData.length / daysPerPage);

    if (loading && !stats) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-pulse flex flex-col items-center">
                    <div className="w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                    <p className="mt-4 text-slate-400 font-medium">Loading Monthly Dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto pt-6 px-4 space-y-8 pb-32 animate-in fade-in duration-700">

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-white tracking-tight uppercase">This Month</h1>
                    <p className="text-slate-400 flex items-center gap-2 mt-1">
                        <Calendar size={16} className="text-red-500" />
                        {new Date().toLocaleString('en-US', { month: 'long', year: 'numeric' })} Management
                    </p>
                </div>

                <button
                    onClick={() => { setEditingTx(null); setShowForm(true); }}
                    className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white font-black px-6 py-3 rounded-2xl transition-all shadow-lg shadow-red-500/20 active:scale-95 text-xs tracking-widest uppercase"
                >
                    <Plus size={18} />
                    Add Entry
                </button>
            </div>

            {/* Summary Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <SummaryCard label="Income" value={stats.totalIncome} icon={<ArrowUpRight size={22} />} color="green" />
                <SummaryCard label="Expenses" value={stats.totalExpenses} icon={<ArrowDownLeft size={22} />} color="rose" />
                <SummaryCard label="Daily Avg." value={stats.totalExpenses / new Date().getDate()} icon={<TrendingUp size={22} />} color="yellow" />
                <SummaryCard label="Today's Spent" value={todayExpenses} icon={<ShoppingBag size={22} />} color="orange" />
                <SummaryCard label="Remaining" value={stats.totalIncome - stats.totalExpenses} icon={<Layers size={22} />} color="blue" />
            </div>

            {/* Transactions Management List */}
            <div className="bg-[#1E293B] rounded-[2.5rem] p-8 border border-slate-700/30 space-y-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div className="space-y-1">
                        <h2 className="text-xl font-bold text-white uppercase tracking-tight">Ledger Management</h2>
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                            {filteredTransactions.length} Transactions Found
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
                        {/* Tab Switcher */}
                        <div className="bg-slate-900/50 p-1 rounded-xl border border-slate-700/50 flex items-center shrink-0">
                            <button
                                onClick={() => setActiveTab('expense')}
                                className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'expense' ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/20' : 'text-slate-500 hover:text-white'}`}
                            >
                                Expenses
                            </button>
                            <button
                                onClick={() => setActiveTab('income')}
                                className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'income' ? 'bg-green-500 text-white shadow-lg shadow-green-500/20' : 'text-slate-500 hover:text-white'}`}
                            >
                                Income
                            </button>
                        </div>

                        <div className="hidden md:block w-px h-6 bg-slate-700/50 mx-2" />

                        <div className="relative flex-1 md:w-64 min-w-[200px]">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                            <input
                                type="text"
                                placeholder="Search by category or note..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-slate-900 border border-slate-700 rounded-xl py-2 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-red-500/50 transition-all"
                            />
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-slate-700/30">
                                <th className="pb-4 pl-2">Date</th>
                                <th className="pb-4">Category</th>
                                <th className="pb-4">Note</th>
                                <th className="pb-4 text-right">Amount</th>
                                <th className="pb-4 text-right pr-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-700/20">
                            {paginatedDays.map(group => (
                                <Fragment key={group.date}>
                                    <tr className={activeTab === 'expense' ? 'bg-rose-500/5' : 'bg-green-500/5'}>
                                        <td colSpan="5" className={`py-2.5 px-4 border-l-2 ${activeTab === 'expense' ? 'border-rose-500/50' : 'border-green-500/50'}`}>
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <span className="text-[10px] font-black text-white uppercase tracking-[0.2em]">
                                                        {new Date(group.date).toLocaleDateString('en-US', { day: 'numeric', month: 'long', weekday: 'short', timeZone: 'UTC' })}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-4">
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                    {group.items.map(tx => (
                                        <tr key={tx.id} className="group hover:bg-slate-800/20 transition-all border-l-2 border-transparent hover:border-slate-600">
                                            <td className="py-4 pl-4 text-xs text-slate-500 font-bold whitespace-nowrap">
                                                {new Date(tx.date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true, timeZone: 'UTC' })}
                                            </td>
                                            <td className="py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400">
                                                        {getCategoryIcon(tx.category)}
                                                    </div>
                                                    <p className="text-xs text-white font-bold truncate max-w-[120px]">{tx.category}</p>
                                                </div>
                                            </td>
                                            <td className="py-4">
                                                <p className="text-xs text-slate-400 italic truncate max-w-[200px]">{tx.note || '-'}</p>
                                            </td>
                                            <td className="py-4 text-right">
                                                <p className={`text-sm font-black ${tx.type === 'income' ? 'text-green-500' : 'text-red-500'}`}>
                                                    ৳{tx.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                                </p>
                                            </td>
                                            <td className="py-4 text-right pr-2">
                                                <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-all">
                                                    <button onClick={() => { setEditingTx(tx); setShowForm(true); }} className="p-2 text-slate-500 hover:text-white transition-colors"><Edit3 size={14} /></button>
                                                    <button onClick={() => setDeleteConfirmTx(tx)} className="p-2 text-slate-500 hover:text-red-500 transition-colors"><Trash2 size={14} /></button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </Fragment>
                            ))}
                            <tr className="bg-slate-800/30 border-t border-slate-700/50">
                                <td colSpan="3" className="py-6 pl-4 text-right">
                                    <div className="flex flex-col gap-1 items-end">
                                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none">Today's {activeTab === 'expense' ? 'Expense' : 'Income'}</span>
                                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none">Monthly {activeTab === 'expense' ? 'Expense' : 'Income'} Total</span>
                                    </div>
                                </td>
                                <td className="py-6 text-right">
                                    <div className="flex flex-col gap-1 items-end">
                                        <p className={`text-xs font-black ${activeTab === 'expense' ? 'text-rose-400' : 'text-green-400'}`}>
                                            ৳{todayTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                        </p>
                                        <p className={`text-base font-black ${activeTab === 'expense' ? 'text-red-400' : 'text-green-400'}`}>
                                            ৳{filteredTransactions.reduce((sum, tx) => sum + tx.amount, 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                        </p>
                                    </div>
                                </td>
                                <td></td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-between pt-6 border-t border-slate-700/30">
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                            Page {currentPage} of {totalPages}
                        </p>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${currentPage === 1 ? 'opacity-20 cursor-not-allowed text-slate-500' : 'bg-slate-800 text-white hover:bg-slate-700'}`}
                            >
                                Previous
                            </button>
                            <button
                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages}
                                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${currentPage === totalPages ? 'opacity-20 cursor-not-allowed text-slate-500' : 'bg-slate-800 text-white hover:bg-slate-700'}`}
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-[#1E293B] rounded-[2.5rem] p-8 border border-slate-700/30 overflow-hidden">
                    <h2 className="text-xl font-bold text-white uppercase tracking-tight mb-8">Daily Activity</h2>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={stats.dailyExpenses}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.3} />
                                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 10 }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 10 }} />
                                <Tooltip
                                    cursor={{ fill: 'rgba(51, 65, 85, 0.2)' }}
                                    content={({ active, payload, label }) => {
                                        if (active && payload && payload.length) {
                                            return (
                                                <div className="bg-[#0F172A] border border-slate-700/50 p-4 rounded-xl shadow-2xl backdrop-blur-xl min-w-[150px]">
                                                    <p className="text-[10px] font-black text-slate-500 uppercase mb-3 border-b border-slate-700/50 pb-2">Day {label}</p>
                                                    <div className="space-y-2">
                                                        {payload.map((entry, index) => (
                                                            <div key={index} className="flex justify-between items-center gap-4">
                                                                <span className="text-xs font-bold text-slate-400 capitalize">{entry.name}</span>
                                                                <span className={`text-sm font-black ${entry.name === 'income' ? 'text-green-500' : 'text-red-500'}`}>
                                                                    {entry.name === 'income' ? '+' : '-'}৳{entry.value.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                                                </span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            );
                                        }
                                        return null;
                                    }}
                                />
                                <Bar dataKey="income" name="income" stackId="a" fill="#10B981" radius={[0, 0, 4, 4]} barSize={12} opacity={0.8} />
                                <Bar dataKey="expense" name="expense" stackId="a" fill="#EF4444" radius={[4, 4, 0, 0]} barSize={12} opacity={0.8} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-[#1E293B] rounded-[2.5rem] p-8 border border-slate-700/30 relative overflow-hidden group">
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/5 blur-[100px] rounded-full -ml-32 -mb-32 pointer-events-none"></div>
                    <h2 className="text-xl font-bold text-white uppercase tracking-tight mb-1 relative z-10">Spending View</h2>
                    <p className="text-sm text-slate-500 mb-8 relative z-10">Spending breakdown by category</p>

                    <div className="h-64 relative flex items-center justify-center z-10">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={stats.pieData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={75}
                                    outerRadius={100}
                                    paddingAngle={10}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    {stats.pieData.map((e, i) => (
                                        <Cell
                                            key={`cell-${i}`}
                                            fill={e.color}
                                            className="outline-none transition-all duration-300 hover:opacity-80"
                                        />
                                    ))}
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1">Total</span>
                            <span className="text-3xl font-black text-white">৳{(stats.totalSpending / 1000).toFixed(1)}k</span>
                        </div>
                    </div>

                    <div className="mt-8 space-y-3 max-h-[300px] overflow-y-auto custom-scrollbar pr-2 relative z-10">
                        {stats.pieData.map(cat => (
                            <div key={cat.name} className="flex items-center justify-between p-2 rounded-2xl hover:bg-slate-800/30 transition-all">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-slate-800/50" style={{ color: cat.color }}>
                                        {getCategoryIcon(cat.name)}
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-white">{cat.name}</p>
                                        <p className="text-[9px] text-slate-500 font-black uppercase tracking-tighter">
                                            {stats.totalSpending > 0 ? Math.round((cat.value / stats.totalSpending) * 100) : 0}%
                                        </p>
                                    </div>
                                </div>
                                <p className="text-xs font-black text-white">৳{cat.value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Modal Form */}
            {
                showForm && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <div className="absolute inset-0 bg-[#0F172A]/80 backdrop-blur-sm" onClick={() => setShowForm(false)} />
                        <div className="relative bg-[#1E293B] border border-slate-700 shadow-2xl rounded-[2.5rem] w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-300">
                            <div className="p-8 pb-0 flex justify-between items-center">
                                <h2 className="text-2xl font-black text-white uppercase tracking-tight">
                                    {editingTx ? 'Edit Transaction' : 'New Transaction'}
                                </h2>
                                <button onClick={() => setShowForm(false)} className="p-2 text-slate-500 hover:text-white"><X size={24} /></button>
                            </div>
                            <TransactionForm initialData={editingTx} onSubmit={handleFormSubmit} onCancel={() => setShowForm(false)} />
                        </div>
                    </div>
                )
            }

            {/* Custom Delete Confirmation Modal */}
            {
                deleteConfirmTx && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <div className="absolute inset-0 bg-[#0F172A]/80 backdrop-blur-sm" onClick={() => setDeleteConfirmTx(null)} />
                        <div className="relative bg-[#1E293B] border border-slate-700 shadow-2xl rounded-[2.5rem] w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-300">
                            <div className="p-8 text-center pt-10">
                                <div className="w-20 h-20 rounded-[1.5rem] bg-red-500/10 text-red-500 flex items-center justify-center mx-auto mb-6">
                                    <Trash2 size={36} />
                                </div>
                                <h2 className="text-xl font-black text-white uppercase tracking-tight mb-3">Delete Transaction?</h2>
                                <p className="text-sm font-medium text-slate-400 mb-8 max-w-[250px] mx-auto leading-relaxed">
                                    Are you sure you want to delete this <span className="text-white font-bold">{deleteConfirmTx.category}</span> transaction of <span className="text-red-400 font-bold">৳{deleteConfirmTx.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>? This action cannot be undone.
                                </p>
                                <div className="flex gap-4">
                                    <button
                                        onClick={() => setDeleteConfirmTx(null)}
                                        className="flex-1 py-4 rounded-2xl font-black text-slate-400 bg-slate-800/50 hover:bg-slate-700 hover:text-white transition-all tracking-widest uppercase text-[10px]"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={confirmDelete}
                                        className="flex-1 py-4 rounded-2xl font-black text-white bg-red-500 hover:bg-red-600 transition-all shadow-lg shadow-red-500/20 tracking-widest uppercase text-[10px] relative overflow-hidden group"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }
        </div >
    );
}

function SummaryCard({ label, value, icon, color }) {
    const colorClasses = {
        green: "bg-green-500/10 text-green-500",
        rose: "bg-rose-500/10 text-rose-500",
        yellow: "bg-yellow-500/10 text-yellow-500",
        blue: "bg-blue-500/10 text-blue-500",
        orange: "bg-orange-500/10 text-orange-500"
    };
    return (
        <div className="bg-[#1E293B] rounded-[2rem] p-6 border border-slate-700/30 flex items-center gap-5 transition-all hover:border-slate-600">
            <div className={`w-14 h-14 rounded-[1.25rem] flex items-center justify-center shrink-0 ${colorClasses[color]}`}>
                {icon}
            </div>
            <div className="min-w-0 flex-1">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">{label}</p>
                <p className={`text-2xl font-black text-white ${value < 0 ? '!text-red-500' : ''}`}>
                    {value < 0 ? '-' : ''}৳{Math.abs(value || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </p>
            </div>
        </div>
    );
}
