import { useState, useEffect, useRef } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, CartesianGrid } from 'recharts';
import {
    Home, GraduationCap, Car, ShoppingBag, ArrowUpRight, ArrowDownLeft,
    Calendar, ChevronLeft, ChevronRight, X, Wallet, PiggyBank, Layers
} from 'lucide-react';
import { api } from '../services/api';
import { ALL_CATEGORIES, getCategoryIcon } from '../constants/categories.jsx';

// --- Custom Month Picker ---
function MonthPicker({ value, onChange }) {
    const [isOpen, setIsOpen] = useState(false);
    const [viewYear, setViewYear] = useState(parseInt(value.split('-')[0]));
    const containerRef = useRef(null);

    const months = [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];

    const currentMonth = parseInt(value.split('-')[1]) - 1;
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonthIndex = today.getMonth();

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const isFuture = (monthIndex) => {
        if (viewYear > currentYear) return true;
        if (viewYear === currentYear && monthIndex > currentMonthIndex) return true;
        return false;
    };

    const handleMonthSelect = (monthIndex) => {
        if (isFuture(monthIndex)) return;
        const monthStr = (monthIndex + 1).toString().padStart(2, '0');
        onChange(`${viewYear}-${monthStr}`);
        setIsOpen(false);
    };

    const formatDisplay = (val) => {
        const [y, m] = val.split('-');
        return `${months[parseInt(m) - 1]} ${y}`;
    };

    return (
        <div className="relative" ref={containerRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-4 py-2 bg-[#0F172A] hover:bg-[#1e293b] text-white text-sm font-bold rounded-xl transition-all border border-slate-700/50"
            >
                <Calendar size={14} className="text-yellow-400" />
                {formatDisplay(value)}
            </button>

            {isOpen && (
                <div className="absolute top-full right-0 mt-2 w-64 bg-[#0F172A] border border-slate-700 shadow-2xl rounded-2xl p-4 z-50 animate-in fade-in zoom-in-95 duration-200">
                    <div className="flex items-center justify-between mb-4 px-1">
                        <button onClick={() => setViewYear(v => v - 1)} className="p-1 hover:bg-slate-800 rounded-lg text-slate-400"><ChevronLeft size={16} /></button>
                        <span className="text-white font-black">{viewYear}</span>
                        <button
                            onClick={() => setViewYear(v => v + 1)}
                            disabled={viewYear >= currentYear}
                            className={`p-1 rounded-lg text-slate-400 ${viewYear >= currentYear ? 'opacity-20 cursor-not-allowed' : 'hover:bg-slate-800'}`}
                        >
                            <ChevronRight size={16} />
                        </button>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                        {months.map((m, i) => {
                            const disabled = isFuture(i);
                            return (
                                <button
                                    key={m}
                                    onClick={() => handleMonthSelect(i)}
                                    disabled={disabled}
                                    className={`py-2 text-xs font-bold rounded-lg transition-all ${i === currentMonth && viewYear === parseInt(value.split('-')[0])
                                        ? 'bg-yellow-400 text-slate-900'
                                        : disabled
                                            ? 'text-slate-700 cursor-not-allowed opacity-40'
                                            : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                                        }`}
                                >
                                    {m}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}

// --- Custom Year Picker ---
function YearPicker({ value, onChange }) {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef(null);

    const currentYear = new Date().getFullYear();
    // Allow picking from 5 years ago up to current year
    const years = Array.from({ length: 6 }, (_, i) => currentYear - 5 + i).reverse();

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={containerRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-4 py-2 bg-[#0F172A] hover:bg-[#1e293b] text-white text-sm font-bold rounded-xl transition-all border border-slate-700/50"
            >
                <Calendar size={14} className="text-yellow-400" />
                {value}
            </button>

            {isOpen && (
                <div className="absolute top-full right-0 mt-2 w-48 bg-[#0F172A] border border-slate-700 shadow-2xl rounded-2xl p-4 z-50 animate-in fade-in zoom-in-95 duration-200">
                    <div className="grid grid-cols-2 gap-2">
                        {years.map(y => (
                            <button
                                key={y}
                                onClick={() => { onChange(y.toString()); setIsOpen(false); }}
                                className={`py-3 text-sm font-bold rounded-lg transition-all ${value === y.toString()
                                    ? 'bg-yellow-400 text-slate-900 shadow-[0_0_15px_rgba(253,224,71,0.2)]'
                                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                                    }`}
                            >
                                {y}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default function Statistics() {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState(null);
    const [activeCategory, setActiveCategory] = useState(null);

    // Filtering state
    const [filterMode, setFilterMode] = useState('month'); // 'month' or 'year'
    const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7)); // YYYY-MM
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString()); // YYYY

    useEffect(() => {
        const fetchStats = async () => {
            setLoading(true);
            try {
                const params = filterMode === 'month'
                    ? { month: selectedMonth }
                    : { year: selectedYear };

                const data = await api.getStatistics(params);
                setStats(data);
            } catch (err) {
                console.error("Failed to fetch statistics", err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, [selectedMonth, selectedYear, filterMode]);

    if (loading && !stats) {
        return (
            <div className="flex items-center justify-center h-full pt-20">
                <div className="animate-pulse flex flex-col items-center">
                    <div className="w-12 h-12 border-4 border-yellow-300 border-t-transparent rounded-full animate-spin"></div>
                    <p className="mt-4 text-slate-400 font-medium">Loading Statistics...</p>
                </div>
            </div>
        );
    }

    const formatMonth = (isoStr) => {
        if (!isoStr) return '';
        return new Date(isoStr).toLocaleString('en-US', { month: 'long', year: 'numeric' });
    };

    const formatLongDate = (isoStr) => {
        if (!isoStr) return 'Select Date';
        const date = new Date(isoStr);
        const day = date.getDate();
        const month = date.toLocaleString('en-US', { month: 'long' });
        const year = date.getFullYear();

        const getOrdinal = (n) => {
            if (n > 3 && n < 21) return 'th';
            switch (n % 10) {
                case 1: return 'st';
                case 2: return 'nd';
                case 3: return 'rd';
                default: return 'th';
            }
        };

        return `${day}${getOrdinal(day)} ${month}, ${year}`;
    };

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-6xl mx-auto pt-6 px-4 space-y-8 pb-20">

            {/* Header section with Custom Filters */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-50">
                <div>
                    <h1 className="text-3xl font-black text-white tracking-tight">Financial Analytics</h1>
                    <p className="text-slate-400 flex items-center gap-2 mt-1">
                        <Calendar size={16} className="text-yellow-400" />
                        {filterMode === 'month' ? formatMonth(selectedMonth) : `Year ${selectedYear}`}
                    </p>
                </div>

                {/* Modern Filter Controls */}
                <div className="flex flex-col sm:flex-row items-center gap-4 bg-[#1E293B]/50 backdrop-blur-xl p-2 rounded-3xl border border-slate-700/30 relative z-50">

                    {filterMode === 'month' ? (
                        <MonthPicker value={selectedMonth} onChange={setSelectedMonth} />
                    ) : (
                        <YearPicker value={selectedYear} onChange={setSelectedYear} />
                    )}

                    <div className="h-8 w-[1px] bg-slate-700/50 hidden sm:block"></div>

                    <div className="flex bg-[#0F172A] p-1 rounded-2xl">
                        <button
                            onClick={() => setFilterMode('month')}
                            className={`px-6 py-2 rounded-xl text-[10px] font-black tracking-widest transition-all ${filterMode === 'month' ? 'bg-yellow-400 text-slate-900 shadow-[0_0_20px_rgba(253,224,71,0.2)]' : 'text-slate-500 hover:text-slate-300'}`}
                        >
                            MONTHLY
                        </button>
                        <button
                            onClick={() => setFilterMode('year')}
                            className={`px-6 py-2 rounded-xl text-[10px] font-black tracking-widest transition-all ${filterMode === 'year' ? 'bg-yellow-400 text-slate-900 shadow-[0_0_20px_rgba(253,224,71,0.2)]' : 'text-slate-500 hover:text-slate-300'}`}
                        >
                            YEARLY
                        </button>
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 opacity-50 pointer-events-none">
                    <div className="lg:col-span-2 bg-[#1E293B] h-[400px] rounded-[2.5rem] animate-pulse"></div>
                    <div className="bg-[#1E293B] h-[400px] rounded-[2.5rem] animate-pulse"></div>
                </div>
            ) : !stats ? (
                <div className="flex flex-col items-center justify-center py-32 bg-[#1E293B]/30 rounded-[3rem] border border-dashed border-slate-700">
                    <X size={48} className="text-slate-600 mb-4" />
                    <p className="text-slate-500 font-bold">No data available for this selection.</p>
                </div>
            ) : (
                <>
                    {/* Bottom: Statistics Summary Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 relative z-10">
                        {/* Total Income */}
                        <div className="bg-[#1E293B] rounded-[2rem] p-6 border border-slate-700/30 flex items-center gap-5 group hover:bg-[#1E293B]/80 transition-all hover:border-green-500/30">
                            <div className="w-14 h-14 rounded-[1.25rem] bg-green-500/10 text-green-500 flex items-center justify-center group-hover:scale-110 transition-transform shadow-[0_0_20px_rgba(16,185,129,0.1)]">
                                <ArrowUpRight size={28} />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Total Income</p>
                                <p className="text-2xl font-black text-white">৳{stats.totalIncome.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                            </div>
                        </div>

                        {/* Total Expense */}
                        <div className="bg-[#1E293B] rounded-[2rem] p-6 border border-slate-700/30 flex items-center gap-5 group hover:bg-[#1E293B]/80 transition-all hover:border-rose-500/30">
                            <div className="w-14 h-14 rounded-[1.25rem] bg-rose-500/10 text-rose-500 flex items-center justify-center group-hover:scale-110 transition-transform shadow-[0_0_20px_rgba(244,63,94,0.1)]">
                                <ArrowDownLeft size={28} />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Total Expense</p>
                                <p className="text-2xl font-black text-white">৳{stats.totalSpending.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                            </div>
                        </div>
                    </div>

                    {/* Bottom: Daily Expenses Graph and Categories */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-white">

                        {/* Left: Daily Expenses Graph */}
                        <div className="lg:col-span-2 bg-[#1E293B] rounded-[2.5rem] p-8 border border-slate-700/30 flex flex-col relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-400/5 blur-[100px] rounded-full -mr-32 -mt-32"></div>

                            <div className="flex items-center justify-between mb-8 relative z-10">
                                <div>
                                    <h2 className="text-xl font-bold text-white uppercase tracking-tight">{filterMode === 'year' ? 'Monthly' : 'Daily'} Expenses</h2>
                                    <p className="text-sm text-slate-500">Spending patterns for chosen period</p>
                                </div>
                                <div className="flex gap-2">
                                    <div className="px-4 py-1.5 bg-yellow-400/10 text-yellow-400 text-[10px] font-black rounded-full border border-yellow-400/20 shadow-[0_0_15px_rgba(253,224,71,0.05)]">
                                        TOTAL EXPENSE: ৳{stats.totalSpending.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </div>
                                </div>
                            </div>

                            <div className="h-[300px] w-full relative z-10 mt-8">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={stats.dailyExpenses} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                                        <defs>
                                            <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#EF4444" stopOpacity={1} />
                                                <stop offset="95%" stopColor="#ef4444" stopOpacity={0.6} />
                                            </linearGradient>
                                        </defs>

                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.3} />
                                        <XAxis
                                            dataKey={filterMode === 'year' ? 'month' : 'day'}
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fill: '#64748b', fontSize: 10, fontWeight: 700 }}
                                            interval={filterMode === 'year' ? 0 : 2}
                                        />
                                        <YAxis
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fill: '#64748b', fontSize: 10, fontWeight: 700 }}
                                        />
                                        <Tooltip
                                            cursor={{ fill: 'rgba(239, 68, 68, 0.05)' }}
                                            content={({ active, payload, label }) => {
                                                if (active && payload && payload.length) {
                                                    return (
                                                        <div className="bg-[#0F172A] border border-slate-700/50 p-4 rounded-2xl shadow-2xl backdrop-blur-xl">
                                                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">{filterMode === 'year' ? label : `Day ${label}`}</p>
                                                            <p className="text-lg font-black text-red-500">৳{payload[0].value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                                                        </div>
                                                    );
                                                }
                                                return null;
                                            }}
                                        />
                                        <Bar
                                            dataKey="amount"
                                            radius={[6, 6, 0, 0]}
                                            barSize={filterMode === 'year' ? 24 : 12}
                                        >
                                            {
                                                stats.dailyExpenses.map((entry, index) => {
                                                    // Calculate intensity based on amount relative to max
                                                    const maxAmount = Math.max(...stats.dailyExpenses.map(d => d.amount));
                                                    const ratio = maxAmount > 0 ? entry.amount / maxAmount : 0;

                                                    // Base red: #EF4444 (rgb(239, 68, 68))
                                                    // Dark red: #991B1B (rgb(153, 27, 27))
                                                    // Determine color based on ratio
                                                    let color = '#FCA5A5'; // Light red for very low
                                                    if (ratio > 0.8) color = '#7F1D1D'; // Very dark
                                                    else if (ratio > 0.6) color = '#991B1B'; // Dark
                                                    else if (ratio > 0.4) color = '#B91C1C'; // Medium dark
                                                    else if (ratio > 0.2) color = '#EF4444'; // Base red

                                                    // If amount is 0, make it nearly invisible
                                                    if (entry.amount === 0) color = 'transparent';

                                                    return <Cell key={`cell-${index}`} fill={color} />;
                                                })
                                            }
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>

                            <div className="mt-10 flex items-center justify-between bg-[#0F172A]/40 rounded-2xl p-5 border border-slate-700/30 relative z-10 w-full group/footer hover:bg-[#0F172A]/60 transition-all border-l-4 border-l-red-500">
                                <div className="flex flex-col">
                                    <span className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em] mb-1">Period Selected</span>
                                    <span className="text-white font-black text-sm sm:text-lg tracking-tight uppercase">
                                        {filterMode === 'month' ? formatMonth(selectedMonth) : `FULL YEAR ${selectedYear}`}
                                    </span>
                                </div>
                                <div className="text-right flex flex-col items-end">
                                    <span className="text-[10px] text-red-500 font-black uppercase tracking-[0.2em] mb-1">Total Expenses</span>
                                    <span className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2">
                                        <span className="text-red-500 text-lg opacity-80 uppercase tracking-tighter">৳</span>
                                        {stats.totalSpending.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Right: Category Breakdown */}
                        <div className="bg-[#1E293B] rounded-[2.5rem] p-8 border border-slate-700/30 relative overflow-hidden group">
                            <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/5 blur-[100px] rounded-full -ml-32 -mb-32"></div>

                            <h2 className="text-xl font-bold text-white uppercase tracking-tight mb-1 relative z-10">Categories</h2>
                            <p className="text-sm text-slate-500 mb-8 relative z-10">Spending by department</p>

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
                                            {stats.pieData.map((entry, index) => (
                                                <Cell
                                                    key={`cell-${index}`}
                                                    fill={entry.color}
                                                    className="outline-none transition-all duration-300 hover:opacity-80"
                                                />
                                            ))}
                                        </Pie>
                                    </PieChart>
                                </ResponsiveContainer>
                                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1">Total</span>
                                    <span className="text-3xl font-black text-white">৳{stats.totalSpending.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                </div>
                            </div>

                            <div className="space-y-3 mt-8 relative z-10">
                                {stats.pieData.map((cat) => (
                                    <div key={cat.name} className="flex items-center justify-between p-2 rounded-2xl hover:bg-slate-800/30 transition-all cursor-default">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-slate-800/50" style={{ color: cat.color }}>
                                                {getCategoryIcon(cat.name)}
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold text-white">{cat.name}</p>
                                                <p className="text-[9px] text-slate-500 font-black uppercase tracking-tighter">
                                                    {stats.totalSpending > 0 ? Math.round((cat.value / stats.totalSpending) * 100) : 0}% of total
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs font-black text-white">৳{cat.value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>
                </>
            )}
        </div>
    );
}
