import { useState, useEffect } from 'react';
import { PiggyBank, Calendar, ArrowDownLeft, ArrowUpRight, TrendingUp, AlertCircle, Plus, X, Check, History } from 'lucide-react';
import { api } from '../services/api';

export default function Savings() {
    const [loading, setLoading] = useState(true);
    const [savingsData, setSavingsData] = useState(null);
    const [isWithdrawing, setIsWithdrawing] = useState(false);
    const [withdrawAmount, setWithdrawAmount] = useState('');
    const [status, setStatus] = useState({ type: '', message: '' });

    const loadSavings = async () => {
        setLoading(true);
        try {
            const data = await api.getSavings();
            setSavingsData(data);
        } catch (error) {
            console.error("Failed to load savings data", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadSavings();
    }, []);

    const handleWithdraw = async (e) => {
        e.preventDefault();
        if (!withdrawAmount || isNaN(withdrawAmount) || Number(withdrawAmount) <= 0) return;

        if (Number(withdrawAmount) > savingsData.totalSavings) {
            setStatus({ type: 'error', message: `Cannot exceed total savings (৳${savingsData.totalSavings.toLocaleString()})` });
            return;
        }

        try {
            await api.addTransaction({
                type: 'income',
                amount: Number(withdrawAmount),
                category: 'Savings',
                subcategory: 'Withdrawal',
                note: 'Withdrawn from historical savings',
                date: new Date().toISOString()
            });

            setStatus({ type: 'success', message: 'Added to current month income!' });
            setWithdrawAmount('');
            setIsWithdrawing(false);

            // Re-load data after a short delay
            setTimeout(() => {
                setStatus({ type: '', message: '' });
                loadSavings();
            }, 2000);

        } catch (err) {
            console.error(err);
            setStatus({ type: 'error', message: 'Failed to add income.' });
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full pt-20">
                <div className="animate-pulse flex flex-col items-center">
                    <div className="w-12 h-12 border-4 border-yellow-300 border-t-transparent rounded-full animate-spin"></div>
                    <p className="mt-4 text-slate-400 font-medium">Calculating Savings...</p>
                </div>
            </div>
        );
    }

    if (!savingsData) {
        return null; // Or an error state
    }

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 mx-auto pt-6 pb-24 space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl tracking-tight font-black text-white flex items-center gap-3">
                    <PiggyBank className="text-yellow-400" size={32} />
                    Savings
                </h1>
                <p className="text-slate-500 text-sm font-medium mt-1">Historically computed savings from past months</p>
            </div>

            {/* Total Savings Card */}
            <div className="bg-[#1E293B]/50 backdrop-blur-xl rounded-[2.5rem] p-8 md:p-10 border border-slate-700/30 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-400/5 blur-[100px] rounded-full -mr-32 -mt-32 transition-all group-hover:bg-yellow-400/10"></div>

                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
                    <div className="space-y-2">
                        <span className="text-slate-400 text-xs font-black uppercase tracking-widest block">Total Historical Savings</span>
                        <div className="flex items-center gap-4 justify-center md:justify-start">
                            <span className="text-yellow-400 text-4xl md:text-5xl font-black tracking-tighter">৳</span>
                            <h2 className={`text-6xl md:text-7xl font-black tracking-tighter ${savingsData.totalSavings >= 0 ? 'text-white' : 'text-red-500'}`}>
                                {savingsData.totalSavings.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </h2>
                        </div>
                    </div>

                    <div className="flex flex-col items-center md:items-end gap-4 shrink-0">
                        {status.message && (
                            <div className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 animate-in fade-in slide-in-from-top-2 ${status.type === 'success' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'}`}>
                                {status.type === 'success' ? <Check size={14} /> : <AlertCircle size={14} />}
                                {status.message}
                            </div>
                        )}

                        {!isWithdrawing ? (
                            <button
                                onClick={() => setIsWithdrawing(true)}
                                className="group/withdraw flex items-center gap-3 bg-white text-slate-950 px-6 py-4 rounded-[1.5rem] font-black uppercase text-xs tracking-widest hover:bg-yellow-400 transition-all hover:scale-105 active:scale-95 shadow-xl shadow-white/5"
                            >
                                <Plus size={18} strokeWidth={3} className="transition-transform group-hover/withdraw:rotate-90" />
                                Add to Main Balance
                            </button>
                        ) : (
                            <form onSubmit={handleWithdraw} className="flex items-center gap-2 bg-slate-900/80 p-2 rounded-2xl border border-white/10 animate-in zoom-in-95 duration-300">
                                <div className="flex items-center gap-2 px-3">
                                    <span className="text-yellow-400 font-bold">৳</span>
                                    <input
                                        autoFocus
                                        type="number"
                                        placeholder="Amount"
                                        className="bg-transparent border-none text-white font-bold w-24 focus:outline-none placeholder:text-slate-600"
                                        value={withdrawAmount}
                                        onChange={(e) => setWithdrawAmount(e.target.value)}
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="p-3 bg-yellow-400 text-slate-900 rounded-xl hover:scale-105 active:scale-95 transition-all"
                                >
                                    <Check size={18} strokeWidth={3} />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setIsWithdrawing(false)}
                                    className="p-3 bg-slate-800 text-white rounded-xl hover:bg-slate-700 transition-all"
                                >
                                    <X size={18} strokeWidth={3} />
                                </button>
                            </form>
                        )}
                        <span className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em]">Transaction source: Savings</span>
                    </div>
                </div>
            </div>

            {/* Monthly Breakdown and Withdrawal History Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Monthly Breakdown */}
                <div className="space-y-6">
                    <h3 className="text-xl font-bold text-white tracking-tight flex items-center gap-3">
                        <Calendar size={20} className="text-slate-400" />
                        Monthly Breakdown
                    </h3>

                    {savingsData.history.length === 0 ? (
                        <div className="bg-slate-800/10 border border-slate-700/20 rounded-[2rem] p-10 text-center flex flex-col items-center">
                            <AlertCircle className="text-slate-600 mb-4" size={32} />
                            <p className="text-slate-500 text-sm">No historical months finished yet.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {savingsData.history.map((item, index) => {
                                const [year, monthStr] = item.month.split('-');
                                const dateObj = new Date(year, parseInt(monthStr) - 1, 1);
                                const displayMonth = dateObj.toLocaleString('en-US', { month: 'long', year: 'numeric' });
                                const isPositive = item.savings >= 0;

                                return (
                                    <div key={item.month} className="bg-[#1E293B]/40 backdrop-blur-md rounded-[1.5rem] p-5 border border-slate-700/30 flex items-center justify-between group/item hover:bg-slate-800/40 transition-all">
                                        <div className="flex flex-col">
                                            <span className="text-white font-bold text-sm mb-1">{displayMonth}</span>
                                            <div className="flex items-center gap-3">
                                                <span className="text-[10px] text-green-500 font-bold uppercase tracking-widest flex items-center gap-1">
                                                    <ArrowDownLeft size={10} /> ৳{item.income.toLocaleString()}
                                                </span>
                                                <span className="text-[10px] text-red-500 font-bold uppercase tracking-widest flex items-center gap-1">
                                                    <ArrowUpRight size={10} /> ৳{item.expense.toLocaleString()}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className={`text-lg font-black tracking-tighter ${isPositive ? 'text-yellow-400' : 'text-red-500'}`}>
                                                ৳{Math.abs(item.savings).toLocaleString()}
                                            </p>
                                            <span className="text-[8px] text-slate-500 font-black uppercase tracking-widest leading-none">Net Savings</span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Withdrawal History */}
                <div className="space-y-6">
                    <h3 className="text-xl font-bold text-white tracking-tight flex items-center gap-3">
                        <History size={20} className="text-slate-400" />
                        Withdrawal History
                    </h3>

                    {savingsData.withdrawals.length === 0 ? (
                        <div className="bg-slate-800/10 border border-slate-700/20 rounded-[2rem] p-10 text-center flex flex-col items-center">
                            <History className="text-slate-600 mb-4" size={32} />
                            <p className="text-slate-500 text-sm">No withdrawals recorded yet.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {savingsData.withdrawals.map((w, index) => {
                                const wDate = new Date(w.date);
                                const displayWDate = wDate.toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

                                return (
                                    <div key={w.id} className="bg-rose-500/5 hover:bg-rose-500/10 backdrop-blur-md rounded-[1.5rem] p-5 border border-rose-500/10 flex items-center justify-between group/w-item transition-all">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-rose-500/20 flex items-center justify-center text-rose-500">
                                                <ArrowUpRight size={18} strokeWidth={3} />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-white font-bold text-sm">Transfer to Balance</span>
                                                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{displayWDate}</span>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-lg font-black tracking-tighter text-rose-500">
                                                -৳{w.amount.toLocaleString()}
                                            </p>
                                            <span className="text-[8px] text-slate-500 font-black uppercase tracking-widest leading-none">Deducted from Savings</span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
