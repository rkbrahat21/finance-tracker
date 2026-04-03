import { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Bell, Search, X } from 'lucide-react';
import BalanceCard from '../components/dashboard/BalanceCard';
import ActionButtons from '../components/dashboard/ActionButtons';
import ActivityFeed from '../components/transactions/ActivityFeed';
import TransactionForm from '../components/transactions/TransactionForm';
import TransactionCards from '../components/dashboard/TransactionCards';
import OverviewStats from '../components/dashboard/OverviewStats';

export default function Dashboard() {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState(null);
    const [transactions, setTransactions] = useState([]);
    const [statistics, setStatistics] = useState(null);

    // Form visibility state
    const [showForm, setShowForm] = useState(false);
    const [formType, setFormType] = useState('expense');

    useEffect(() => {
        const loadData = async () => {
            try {
                const [statsData, txData, statisticsData] = await Promise.all([
                    api.getDashboardStats(),
                    api.getTransactions(),
                    api.getStatistics()
                ]);
                setStats(statsData);
                setTransactions(txData);
                setStatistics(statisticsData);
            } catch (err) {
                console.error("Failed to load dashboard data", err);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    const handleAddTransaction = async (data) => {
        // Optimistic Add
        const tempId = Date.now().toString();
        const optimisticTx = {
            ...data,
            id: tempId,
        };

        setTransactions(prev => [optimisticTx, ...prev]);
        setShowForm(false); // Hide the form on submit

        try {
            const savedTx = await api.addTransaction(data);
            // Replace optimistic with real
            setTransactions(prev => prev.map(tx => tx.id === tempId ? savedTx : tx));
        } catch (err) {
            // Revert if API fails
            setTransactions(prev => prev.filter(tx => tx.id !== tempId));
            console.error("Failed to add transaction", err);
        }
    };

    const handleDeleteTransaction = async (id) => {
        // Optimistic UI Update
        const previousTransactions = [...transactions];
        setTransactions(prev => prev.filter(tx => tx.id !== id));

        try {
            await api.deleteTransaction(id);
        } catch (err) {
            // Revert on failure
            setTransactions(previousTransactions);
            console.error("Failed to delete transaction", err);
        }
    };

    if (loading || !stats) {
        return (
            <div className="flex items-center justify-center h-full pt-20">
                <div className="animate-pulse flex flex-col items-center">
                    <div className="w-12 h-12 border-4 border-yellow-300 border-t-transparent rounded-full animate-spin"></div>
                    <p className="mt-4 text-slate-400 font-medium">Loading Dashboard...</p>
                </div>
            </div>
        );
    }

    const currentMonthYear = new Date().toLocaleString('en-US', { month: 'long', year: 'numeric' });

    return (
        <div className="animate-in fade-in duration-500 max-w-2xl mx-auto md:max-w-none space-y-6">
            <div className="flex flex-col gap-8 items-center justify-between">
                {/* Top Row: Stats Cards */}
                <div className="flex flex-col md:flex-row justify-center items-center w-full space-x-4 md:space-x-6 space-y-4 md:space-y-6">
                    <div className="w-[60%]">
                        <BalanceCard
                            totalBalance={stats.totalBalance}
                            totalIncome={stats.totalIncome}
                            totalExpenses={stats.totalExpenses}
                            totalSavings={stats.totalSavings}
                        />
                    </div>
                    <div className="w-[40%] space-y-6">
                        <TransactionCards transactions={transactions} />
                        <ActionButtons
                            onAddInfo={() => setShowForm(true)}
                        />
                    </div>
                </div>

                {showForm && (
                    <div className="fixed inset-0 z-[100] overflow-y-auto bg-slate-950/60 backdrop-blur-md animate-in fade-in duration-300 flex justify-center py-10 px-4 cursor-pointer"
                        onClick={() => setShowForm(false)}>
                        <div className="relative w-full max-w-2xl transform cursor-default animate-in zoom-in-95 fade-in duration-300"
                            onClick={(e) => e.stopPropagation()}>
                            <div className="bg-[#1E293B] border border-slate-700/50 rounded-[2.5rem] shadow-2xl shadow-slate-950/50">
                                <div className="p-8 pb-4 flex items-center justify-between">
                                    <h3 className="text-xl font-black text-white uppercase tracking-tighter">New Transaction</h3>
                                    <button
                                        onClick={() => setShowForm(false)}
                                        className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500 hover:text-white transition-all hover:scale-110 active:scale-95"
                                    >
                                        <X size={18} strokeWidth={3} />
                                    </button>
                                </div>
                                <TransactionForm
                                    onSubmit={handleAddTransaction}
                                    initialType={formType}
                                    onCancel={() => setShowForm(false)}
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* Bottom Row: Overview Stats & Activity Feed */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
                    <div className="w-full">
                        <OverviewStats stats={statistics} />
                    </div>
                    <div className="w-full h-full">
                        <ActivityFeed
                            transactions={transactions}
                            onDelete={handleDeleteTransaction}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
