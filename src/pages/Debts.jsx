import { useState, useEffect, useRef } from 'react';
import { Plus, Edit3, Trash2, X, Users, ArrowDownRight, ArrowUpRight, CheckCircle2, Circle, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { api } from '../services/api';

const todayISO = () => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

function DayPicker({ value, onChange }) {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef(null);

    const parseDate = (iso) => {
        const [y, m, d] = iso.split('-').map(Number);
        return { year: y, month: m - 1, day: d };
    };

    const today = new Date();
    const { year: selYear, month: selMonth, day: selDay } = parseDate(value);
    const [viewYear, setViewYear] = useState(selYear);
    const [viewMonth, setViewMonth] = useState(selMonth);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (containerRef.current && !containerRef.current.contains(e.target)) setIsOpen(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'];
    const DAY_NAMES = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

    const firstDayOfMonth = new Date(viewYear, viewMonth, 1).getDay();
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

    const isFutureDay = (day) => new Date(viewYear, viewMonth, day) > today;
    const isToday = (day) => viewYear === today.getFullYear() && viewMonth === today.getMonth() && day === today.getDate();
    const isSelected = (day) => viewYear === selYear && viewMonth === selMonth && day === selDay;

    const goBack = () => {
        if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
        else setViewMonth(m => m - 1);
    };
    const goForward = () => {
        if (viewYear > today.getFullYear() || (viewYear === today.getFullYear() && viewMonth >= today.getMonth())) return;
        if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
        else setViewMonth(m => m + 1);
    };

    const selectDay = (day) => {
        if (isFutureDay(day)) return;
        const m = (viewMonth + 1).toString().padStart(2, '0');
        const d = day.toString().padStart(2, '0');
        onChange(`${viewYear}-${m}-${d}`);
        setIsOpen(false);
    };

    const formatDisplay = (iso) => {
        const { year, month, day } = parseDate(iso);
        return `${day.toString().padStart(2, '0')}/${(month + 1).toString().padStart(2, '0')}/${year}`;
    };

    const isAtMaxMonth = viewYear > today.getFullYear() || (viewYear === today.getFullYear() && viewMonth >= today.getMonth());

    return (
        <div className="relative" ref={containerRef}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl py-3 px-4 flex items-center gap-4 hover:border-slate-500 transition-all group"
            >
                <Calendar size={18} className="text-slate-400 shrink-0 group-hover:text-white transition-colors" />
                <span className="text-white font-bold text-sm tracking-wide">{formatDisplay(value)}</span>
            </button>

            {isOpen && (
                <div className="absolute bottom-[calc(100%+8px)] left-0 z-[200] w-72 bg-[#0F172A] border border-slate-700 shadow-2xl shadow-slate-950/80 rounded-2xl p-4 animate-in fade-in zoom-in-95 duration-200 origin-bottom-left">
                    <div className="flex items-center justify-between mb-4 px-1">
                        <button type="button" onClick={goBack} className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors">
                            <ChevronLeft size={16} />
                        </button>
                        <span className="text-white font-black text-sm">{MONTH_NAMES[viewMonth]} {viewYear}</span>
                        <button
                            type="button"
                            onClick={goForward}
                            disabled={isAtMaxMonth}
                            className={`p-1.5 rounded-lg text-slate-400 transition-colors ${isAtMaxMonth ? 'opacity-20 cursor-not-allowed' : 'hover:bg-slate-800 hover:text-white'}`}
                        >
                            <ChevronRight size={16} />
                        </button>
                    </div>

                    <div className="grid grid-cols-7 mb-2">
                        {DAY_NAMES.map(d => (
                            <div key={d} className="text-center text-[10px] font-black text-slate-600 uppercase py-1">{d}</div>
                        ))}
                    </div>

                    <div className="grid grid-cols-7 gap-y-1">
                        {Array.from({ length: firstDayOfMonth }).map((_, i) => <div key={`e-${i}`} />)}
                        {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
                            const future = isFutureDay(day);
                            const sel = isSelected(day);
                            const tod = isToday(day);
                            return (
                                <button
                                    key={day}
                                    type="button"
                                    onClick={() => selectDay(day)}
                                    disabled={future}
                                    className={`w-full aspect-square rounded-lg text-xs font-bold transition-all 
                                        ${sel ? 'bg-red-500 text-white'
                                            : tod ? 'text-red-500 ring-1 ring-red-500/50'
                                                : future ? 'text-slate-700 cursor-not-allowed'
                                                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
                                >
                                    {day}
                                </button>
                            );
                        })}
                    </div>

                    <div className="flex justify-between mt-4 pt-3 border-t border-slate-800">
                        <button
                            type="button"
                            onClick={() => { onChange(todayISO()); setIsOpen(false); }}
                            className="text-xs font-bold text-red-500 hover:text-red-400 transition-colors"
                        >Today</button>
                        <button
                            type="button"
                            onClick={() => setIsOpen(false)}
                            className="text-xs font-bold text-slate-500 hover:text-white transition-colors"
                        >Close</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default function Debts() {
    const [loading, setLoading] = useState(true);
    const [debts, setDebts] = useState([]);

    // UI State
    const [showForm, setShowForm] = useState(false);
    const [editingDebt, setEditingDebt] = useState(null);
    const [filterType, setFilterType] = useState('all');
    const [deleteConfirmId, setDeleteConfirmId] = useState(null);

    // Form State
    const [formData, setFormData] = useState({
        person: '',
        amount: '',
        note: '',
        date: todayISO(),
        type: 'owed'
    });

    const [paymentModal, setPaymentModal] = useState({
        isOpen: false,
        debt: null,
        amount: ''
    });

    const loadData = async () => {
        setLoading(true);
        try {
            const data = await api.getDebts();
            setDebts(data || []);
        } catch (err) {
            console.error("Failed to load debts", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                ...formData,
                amount: parseFloat(formData.amount) || 0
            };

            if (editingDebt) {
                await api.updateDebt(editingDebt.id, payload);
            } else {
                await api.addDebt(payload);
            }
            setShowForm(false);
            setEditingDebt(null);
            loadData();
        } catch (err) {
            console.error(err);
        }
    };

    const confirmDelete = async () => {
        if (!deleteConfirmId) return;
        try {
            await api.deleteDebt(deleteConfirmId);
            setDeleteConfirmId(null);
            loadData();
        } catch (err) {
            console.error(err);
        }
    };

    const handlePaymentSubmit = async (e) => {
        e.preventDefault();
        const { debt, amount } = paymentModal;
        const paidVal = parseFloat(amount);
        
        if (isNaN(paidVal) || paidVal <= 0 || paidVal > debt.amount) return;

        try {
            await api.updateDebt(debt.id, { paidAmount: paidVal });
            setPaymentModal({ isOpen: false, debt: null, amount: '' });
            loadData();
        } catch (err) {
            console.error(err);
        }
    };

    const toggleSettled = async (debt) => {
        try {
            await api.updateDebt(debt.id, { isSettled: !debt.isSettled });
            loadData();
        } catch (err) {
            console.error(err);
        }
    };

    const openEditModal = (debt) => {
        setEditingDebt(debt);
        setFormData({
            person: debt.person,
            amount: debt.amount.toString(),
            date: new Date(debt.date).toISOString().split('T')[0],
            note: debt.note || '',
            type: debt.type
        });
        setShowForm(true);
    };

    const openCreateModal = () => {
        setEditingDebt(null);
        setFormData({
            person: '',
            amount: '',
            date: todayISO(),
            note: '',
            type: filterType === 'all' ? 'owed' : filterType
        });
        setShowForm(true);
    };

    const filteredDebts = debts.filter(d => filterType === 'all' || d.type === filterType);

    // Calculate totals based on ALL unsettled debts
    const totalOwedToMe = debts.filter(d => d.type === 'owed' && !d.isSettled).reduce((sum, d) => sum + d.amount, 0);
    const totalIOwe = debts.filter(d => d.type === 'owe' && !d.isSettled).reduce((sum, d) => sum + d.amount, 0);

    if (loading && debts.length === 0) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-pulse flex flex-col items-center">
                    <div className="w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                    <p className="mt-4 text-slate-400 font-medium">Loading Records...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="mx-auto pt-6 px-4 space-y-8 pb-32 animate-in fade-in duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-white tracking-tight uppercase">Debts & Loans</h1>
                    <p className="text-slate-400 flex items-center gap-2 mt-1 uppercase text-xs tracking-widest font-bold">
                        <Users size={16} className="text-red-500" />
                        Personal Financial Relationships
                    </p>
                </div>

                <button
                    onClick={openCreateModal}
                    className="flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white font-black px-6 py-3 rounded-2xl transition-all shadow-lg shadow-red-500/20 active:scale-95 text-xs tracking-widest uppercase"
                >
                    <Plus size={18} />
                    Add Record
                </button>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="bg-[#1E293B] rounded-[2rem] p-6 border border-slate-700/30 flex items-center gap-5 transition-all hover:border-green-500/30 group">
                    <div className="w-14 h-14 rounded-[1.25rem] bg-green-500/10 text-green-500 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                        <ArrowDownRight size={28} />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">I Will Get</p>
                        <p className="text-2xl font-black text-white">
                            ৳{totalOwedToMe.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </p>
                    </div>
                </div>

                <div className="bg-[#1E293B] rounded-[2rem] p-6 border border-slate-700/30 flex items-center gap-5 transition-all hover:border-red-500/30 group">
                    <div className="w-14 h-14 rounded-[1.25rem] bg-red-500/10 text-red-500 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                        <ArrowUpRight size={28} />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">I Should Pay</p>
                        <p className="text-2xl font-black text-white">
                            ৳{totalIOwe.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </p>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="bg-[#1E293B] rounded-[2.5rem] p-6 md:p-8 border border-slate-700/30">

                {/* Tabs */}
                <div className="flex bg-slate-900/50 p-1.5 rounded-2xl border border-slate-700/50 mb-8 max-w-lg mx-auto">
                    <button
                        onClick={() => setFilterType('all')}
                        className={`flex-1 py-3 px-4 rounded-xl text-xs font-black uppercase tracking-widest transition-all sm:w-1/3 ${filterType === 'all'
                            ? 'bg-yellow-500 text-slate-900 shadow-lg shadow-yellow-500/20'
                            : 'text-slate-500 hover:text-white'
                            }`}
                    >
                        All
                    </button>
                    <button
                        onClick={() => setFilterType('owed')}
                        className={`flex-1 py-3 px-4 rounded-xl text-xs font-black uppercase tracking-widest transition-all sm:w-1/3 ${filterType === 'owed'
                            ? 'bg-yellow-500 text-slate-900 shadow-lg shadow-yellow-500/20'
                            : 'text-slate-500 hover:text-white'
                            }`}
                    >
                        I Will Get
                    </button>
                    <button
                        onClick={() => setFilterType('owe')}
                        className={`flex-1 py-3 px-4 rounded-xl text-xs font-black uppercase tracking-widest transition-all sm:w-1/3 ${filterType === 'owe'
                            ? 'bg-yellow-500 text-slate-900 shadow-lg shadow-yellow-500/20'
                            : 'text-slate-500 hover:text-white'
                            }`}
                    >
                        I Should Pay
                    </button>
                </div>

                {/* List */}
                <div className="space-y-4">
                    {filteredDebts.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-500">
                                <Users size={32} />
                            </div>
                            <h3 className="text-white font-bold text-lg mb-1">No Records Found</h3>
                            <p className="text-slate-400 text-sm">
                                {filterType === 'owed'
                                    ? "Looks like you are not getting money from anyone."
                                    : filterType === 'owe'
                                        ? "Great! You don't have to pay anyone currently."
                                        : "You have no active debts or loans."}
                            </p>
                        </div>
                    ) : (
                        filteredDebts.sort((a, b) => Number(a.isSettled) - Number(b.isSettled) || new Date(b.date) - new Date(a.date)).map(debt => (
                            <div key={debt.id} className={`p-5 rounded-2xl border transition-all ${debt.isSettled ? 'bg-slate-800/20 border-slate-800 opacity-60' : 'bg-slate-800/50 border-slate-700/50 hover:border-slate-600'} flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between group`}>
                                <div className="flex items-center gap-4 flex-1 min-w-0">
                                    <div className="min-w-0">
                                        <h3 className={`font-bold text-lg truncate ${debt.isSettled ? 'text-slate-400 line-through' : 'text-white'}`}>
                                            {debt.person}
                                        </h3>
                                        {debt.note && (
                                            <p className="text-sm text-slate-400 truncate mt-0.5">{debt.note}</p>
                                        )}
                                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">
                                            {new Date(debt.date).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' })}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex flex-col sm:flex-row items-end sm:items-center justify-between sm:justify-end w-full sm:w-auto gap-4 pl-0">
                                    <div className="flex flex-col items-end">
                                        <p className={`text-xl font-black ${debt.isSettled ? 'text-slate-500' : debt.type === 'owed' ? 'text-green-500' : 'text-red-500'}`}>
                                            ৳{debt.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                        </p>
                                        {filterType === 'all' && (
                                            <p className={`text-[9px] font-black uppercase tracking-widest mt-0.5 ${debt.isSettled ? 'text-slate-600' : debt.type === 'owed' ? 'text-green-500/60' : 'text-red-500/60'}`}>
                                                {debt.type === 'owed' ? 'I Will Get' : 'I Should Pay'}
                                            </p>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-2 mt-2 sm:mt-0 transition-opacity">
                                        <button
                                            onClick={() => {
                                                if (debt.isSettled) {
                                                    toggleSettled(debt);
                                                } else {
                                                    setPaymentModal({ isOpen: true, debt, amount: debt.amount.toString() });
                                                }
                                            }}
                                            className={`px-3 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-lg transition-colors ${debt.isSettled ? 'bg-slate-800/80 text-slate-500 hover:text-white hover:bg-slate-700' : 'bg-green-500/10 text-green-500 border border-green-500/20 hover:bg-green-500 hover:text-white shadow-lg shadow-green-500/10'}`}
                                        >
                                            {debt.isSettled ? 'Undo' : 'Paid'}
                                        </button>
                                        <button onClick={() => openEditModal(debt)} className="p-1.5 text-slate-400 hover:text-white transition-colors bg-slate-800 rounded-lg">
                                            <Edit3 size={16} />
                                        </button>
                                        <button onClick={() => setDeleteConfirmId(debt.id)} className="p-1.5 text-slate-400 hover:text-red-500 transition-colors bg-slate-800 rounded-lg">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Modal Form */}
            {showForm && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-[#0F172A]/80 backdrop-blur-sm" onClick={() => setShowForm(false)} />
                    <div className="relative bg-[#1E293B] border border-slate-700 shadow-2xl rounded-[2.5rem] w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-300 p-8">
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-2xl font-black text-white uppercase tracking-tight">
                                {editingDebt ? 'Edit Record' : 'New Record'}
                            </h2>
                            <button onClick={() => setShowForm(false)} className="p-2 text-slate-500 hover:text-white"><X size={24} /></button>
                        </div>

                        <form onSubmit={handleFormSubmit} className="space-y-6">
                            <div>
                                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Record Type</label>
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, type: 'owed' })}
                                        className={`py-3 rounded-xl text-xs font-black uppercase tracking-widest border transition-all ${formData.type === 'owed'
                                            ? 'bg-green-500/10 border-green-500 text-green-500'
                                            : 'border-slate-700 text-slate-400 hover:border-slate-500'
                                            }`}
                                    >
                                        I Will Get
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, type: 'owe' })}
                                        className={`py-3 rounded-xl text-xs font-black uppercase tracking-widest border transition-all ${formData.type === 'owe'
                                            ? 'bg-red-500/10 border-red-500 text-red-500'
                                            : 'border-slate-700 text-slate-400 hover:border-slate-500'
                                            }`}
                                    >
                                        I Should Pay
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Person Name</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.person}
                                    onChange={e => setFormData({ ...formData, person: e.target.value })}
                                    placeholder="e.g. John Doe"
                                    className="w-full bg-slate-900 border border-slate-700 rounded-xl py-3 px-4 text-white font-medium focus:outline-none focus:border-red-500/50 transition-colors"
                                />
                            </div>

                            <div>
                                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Amount (৳)</label>
                                <input
                                    type="number"
                                    required
                                    min="0"
                                    step="0.01"
                                    value={formData.amount}
                                    onChange={e => setFormData({ ...formData, amount: e.target.value })}
                                    placeholder="0.00"
                                    className="w-full bg-slate-900 border border-slate-700 rounded-xl py-3 px-4 text-white font-black focus:outline-none focus:border-red-500/50 transition-colors"
                                />
                            </div>

                            <div>
                                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Date</label>
                                <DayPicker value={formData.date} onChange={val => setFormData({ ...formData, date: val })} />
                            </div>

                            <div>
                                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Note (Optional)</label>
                                <input
                                    type="text"
                                    value={formData.note}
                                    onChange={e => setFormData({ ...formData, note: e.target.value })}
                                    placeholder="What was this for?"
                                    className="w-full bg-slate-900 border border-slate-700 rounded-xl py-3 px-4 text-slate-300 focus:outline-none focus:border-red-500/50 transition-colors"
                                />
                            </div>

                            <button
                                type="submit"
                                className={`w-full py-4 rounded-xl font-black text-white uppercase tracking-widest text-xs transition-all shadow-lg mt-4 ${formData.type === 'owed'
                                    ? 'bg-green-500 hover:bg-green-600 shadow-green-500/20'
                                    : 'bg-red-500 hover:bg-red-600 shadow-red-500/20'
                                    }`}
                            >
                                {editingDebt ? 'Save Changes' : 'Add Record'}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Partial Payment Modal */}
            {paymentModal.isOpen && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-[#0F172A]/90 backdrop-blur-md" onClick={() => setPaymentModal({ ...paymentModal, isOpen: false })} />
                    <div className="relative bg-[#1E293B] border border-slate-700 shadow-2xl rounded-[2.5rem] w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-300 p-8">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-black text-white uppercase tracking-tight">Record Payment</h2>
                            <button onClick={() => setPaymentModal({ ...paymentModal, isOpen: false })} className="p-2 text-slate-500 hover:text-white"><X size={20} /></button>
                        </div>

                        <div className="mb-8 p-5 bg-slate-900/50 rounded-2xl border border-slate-800 flex items-center justify-between">
                            <div>
                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Total Outstanding</p>
                                <p className="text-xl font-black text-white">৳{paymentModal.debt.amount.toLocaleString()}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">With</p>
                                <p className="text-sm font-bold text-slate-300">{paymentModal.debt.person}</p>
                            </div>
                        </div>

                        <form onSubmit={handlePaymentSubmit} className="space-y-6">
                            <div>
                                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Amount to Pay (৳)</label>
                                <div className="space-y-3">
                                    <input
                                        type="number"
                                        autoFocus
                                        required
                                        min="0.01"
                                        max={paymentModal.debt.amount}
                                        step="0.01"
                                        value={paymentModal.amount}
                                        onChange={e => setPaymentModal({ ...paymentModal, amount: e.target.value })}
                                        className="w-full bg-slate-950 border border-slate-700 rounded-xl py-4 px-4 text-white font-black text-lg focus:outline-none focus:border-green-500/50 transition-colors text-center"
                                    />
                                    <div className="flex gap-2">
                                        <button
                                            type="button"
                                            onClick={() => setPaymentModal({ ...paymentModal, amount: (paymentModal.debt.amount / 2).toFixed(2) })}
                                            className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-[10px] font-black text-slate-400 hover:text-white uppercase tracking-widest transition-all"
                                        >
                                            Pay Half
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setPaymentModal({ ...paymentModal, amount: paymentModal.debt.amount.toString() })}
                                            className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-[10px] font-black text-slate-400 hover:text-white uppercase tracking-widest transition-all"
                                        >
                                            Full Pay
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="w-full py-4 rounded-xl font-black text-white bg-green-500 hover:bg-green-600 transition-all shadow-lg shadow-green-500/20 tracking-widest uppercase text-xs"
                            >
                                Confirm Payment
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirmation */}
            {deleteConfirmId && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-[#0F172A]/80 backdrop-blur-sm" onClick={() => setDeleteConfirmId(null)} />
                    <div className="relative bg-[#1E293B] border border-slate-700 shadow-2xl rounded-[2.5rem] w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-300 p-8 text-center pt-10">
                        <div className="w-20 h-20 rounded-[1.5rem] bg-red-500/10 text-red-500 flex items-center justify-center mx-auto mb-6">
                            <Trash2 size={36} />
                        </div>
                        <h2 className="text-xl font-black text-white uppercase tracking-tight mb-3">Delete Record?</h2>
                        <p className="text-sm font-medium text-slate-400 mb-8 max-w-[250px] mx-auto leading-relaxed">
                            Are you sure you want to delete this record? This action cannot be undone.
                        </p>
                        <div className="flex gap-4">
                            <button
                                onClick={() => setDeleteConfirmId(null)}
                                className="flex-1 py-4 rounded-2xl font-black text-slate-400 bg-slate-800/50 hover:bg-slate-700 hover:text-white transition-all tracking-widest uppercase text-[10px]"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmDelete}
                                className="flex-1 py-4 rounded-2xl font-black text-white bg-red-500 hover:bg-red-600 transition-all shadow-lg shadow-red-500/20 tracking-widest uppercase text-[10px]"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
