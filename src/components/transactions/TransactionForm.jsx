import { useState, useEffect, useRef } from 'react';
import {
    Tag, FileText, CreditCard, Plus, ArrowDownCircle, ArrowUpCircle,
    ChevronDown, ShoppingBag, Car, Home, Book, Utensils, Layers,
    Briefcase, Landmark, Heart, Wallet
} from 'lucide-react';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { INCOME_CATEGORIES, EXPENSE_CATEGORIES } from '../../constants/categories.jsx';

const todayISO = () => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

// Custom day-level date picker
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
                className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl py-4 pl-6 pr-6 flex items-center gap-4 hover:border-yellow-400/50 focus:outline-none focus:border-yellow-400/50 transition-all group"
            >
                <Calendar size={18} className="text-yellow-400 shrink-0" />
                <span className="text-white font-bold">{formatDisplay(value)}</span>
            </button>

            {isOpen && (
                <div className="absolute bottom-[calc(100%+8px)] left-0 z-[200] w-72 bg-[#0F172A] border border-slate-700 shadow-2xl shadow-slate-950/80 rounded-2xl p-4 animate-in fade-in zoom-in-95 duration-200 origin-bottom-left">
                    {/* Header: Month navigation */}
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

                    {/* Day names */}
                    <div className="grid grid-cols-7 mb-2">
                        {DAY_NAMES.map(d => (
                            <div key={d} className="text-center text-[10px] font-black text-slate-600 uppercase py-1">{d}</div>
                        ))}
                    </div>

                    {/* Day cells */}
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
                                        ${sel ? 'bg-yellow-400 text-slate-900'
                                            : tod ? 'text-yellow-400 ring-1 ring-yellow-400/50'
                                                : future ? 'text-slate-700 cursor-not-allowed'
                                                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
                                >
                                    {day}
                                </button>
                            );
                        })}
                    </div>

                    {/* Footer */}
                    <div className="flex justify-between mt-4 pt-3 border-t border-slate-800">
                        <button
                            type="button"
                            onClick={() => { onChange(todayISO()); setIsOpen(false); }}
                            className="text-xs font-bold text-yellow-400 hover:text-yellow-300 transition-colors"
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

export default function TransactionForm({ onSubmit, initialType = 'expense', onCancel, initialData = null }) {
    const [type, setType] = useState(initialData?.type || initialType);
    const [amount, setAmount] = useState(initialData?.amount?.toString() || '');
    const [category, setCategory] = useState(initialData?.category || (initialData?.type || initialType) === 'expense' ? 'Food' : 'Salary');
    const [subcategory, setSubcategory] = useState(initialData?.subcategory || '');
    const [note, setNote] = useState(initialData?.note || '');
    const [date, setDate] = useState(initialData?.date ? initialData.date.slice(0, 10) : todayISO());
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isSubDropdownOpen, setIsSubDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    const subDropdownRef = useRef(null);

    useEffect(() => {
        if (!initialData) {
            setType(initialType);
            setCategory(initialType === 'expense' ? 'Food' : 'Salary');
            setSubcategory('');
            setAmount('');
            setNote('');
        }
    }, [initialType, initialData]);

    // Close dropdowns on click outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
            if (subDropdownRef.current && !subDropdownRef.current.contains(event.target)) {
                setIsSubDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const categories = type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
    const selectedCategory = categories.find(cat => cat.id === category) || categories[0];
    const subcategories = selectedCategory.subcategories || [];

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!amount || isNaN(amount)) return;

        onSubmit({
            ...initialData,
            type,
            amount: parseFloat(amount),
            category,
            subcategory: subcategory || subcategories[0] || '',
            note,
            date: new Date(date).toISOString(),
        });

        setAmount('');
        setSubcategory('');
        setNote('');
        setDate(todayISO());
    };

    return (
        <div className={`p-8 pt-0 animate-in fade-in slide-in-from-bottom-4 duration-500 transition-all duration-300 ${(isDropdownOpen || isSubDropdownOpen) ? 'pb-48' : 'pb-8'}`}>
            {/* Type Switcher */}
            <div className="relative flex bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-3xl p-1.5 mb-8">
                <div
                    className={`absolute inset-y-1.5 transition-all duration-300 ease-out rounded-[1.25rem] shadow-xl ${type === 'income'
                        ? 'left-1.5 w-[calc(50%-3px)] bg-green-500/10 border border-green-500/20'
                        : 'left-[50%] w-[calc(50%-1.5px)] bg-yellow-400 text-slate-950'
                        }`}
                />
                <button
                    type="button"
                    onClick={() => {
                        setType('income');
                        setCategory('Salary');
                        setSubcategory('');
                    }}
                    className={`relative z-10 flex-1 py-3 text-sm font-black uppercase tracking-widest transition-colors duration-300 flex items-center justify-center gap-2 ${type === 'income' ? 'text-green-500' : 'text-slate-500 hover:text-slate-300'
                        }`}
                >
                    <ArrowDownCircle size={18} />
                    Income
                </button>
                <button
                    type="button"
                    onClick={() => {
                        setType('expense');
                        setCategory('Food');
                        setSubcategory('');
                    }}
                    className={`relative z-10 flex-1 py-3 text-sm font-black uppercase tracking-widest transition-colors duration-300 flex items-center justify-center gap-2 ${type === 'expense' ? 'text-slate-950' : 'text-slate-500 hover:text-slate-300'
                        }`}
                >
                    <ArrowUpCircle size={18} />
                    Expense
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Amount Field */}
                <div className="group">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-4 mb-2 block">
                        Transaction Amount
                    </label>
                    <div className="relative group/input">
                        <div className="absolute left-6 top-1/2 -translate-y-1/2 flex items-center gap-2 text-slate-400 group-focus-within/input:text-yellow-400 transition-colors">
                            <span className="text-xl font-bold">৳</span>
                        </div>
                        <input
                            type="number"
                            step="0.01"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="0.00"
                            className="w-full bg-slate-900/50 border border-slate-800 rounded-[2rem] py-5 pl-14 pr-8 text-2xl font-black text-white placeholder:text-slate-700 focus:outline-none focus:border-yellow-400/50 focus:ring-4 focus:ring-yellow-400/5 transition-all"
                            autoFocus
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Custom Category Dropdown */}
                    <div className="group relative" ref={dropdownRef}>
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-4 mb-2 block">
                            Category
                        </label>
                        <button
                            type="button"
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className={`w-full bg-slate-900/50 border border-slate-800 rounded-2xl py-4 pl-6 pr-6 flex items-center justify-between group transition-all duration-300 ${isDropdownOpen ? 'border-yellow-400/50 ring-4 ring-yellow-400/5' : ''
                                }`}
                        >
                            <div className="flex items-center gap-4">
                                <div className={`text-slate-500 transition-colors ${isDropdownOpen ? 'text-yellow-400' : 'group-hover:text-slate-300'}`}>
                                    {selectedCategory.icon}
                                </div>
                                <span className="text-white font-bold">{selectedCategory.label}</span>
                            </div>
                            <ChevronDown
                                size={18}
                                className={`text-slate-600 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180 text-yellow-400' : ''}`}
                            />
                        </button>

                        {/* Dropdown Menu */}
                        {isDropdownOpen && (
                            <div className="absolute top-[calc(100%+8px)] left-0 w-full z-[100] bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-2xl shadow-slate-950/60 overflow-hidden animate-in fade-in zoom-in-95 duration-200 origin-top">
                                <div className="p-2 max-h-[280px] overflow-y-auto no-scrollbar">
                                    {categories.map((cat) => (
                                        <button
                                            key={cat.id}
                                            type="button"
                                            onClick={() => {
                                                setCategory(cat.id);
                                                setSubcategory('');
                                                setIsDropdownOpen(false);
                                            }}
                                            className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all group/item ${category === cat.id
                                                ? 'bg-yellow-400 text-slate-950 font-black'
                                                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                                                }`}
                                        >
                                            <div className={`${category === cat.id ? 'text-slate-950' : 'text-slate-500 group-hover/item:text-yellow-400'} transition-colors`}>
                                                {cat.icon}
                                            </div>
                                            <span className="text-sm tracking-wide">{cat.label}</span>
                                            {category === cat.id && (
                                                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-slate-950" />
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Subcategory Dropdown */}
                    <div className="group relative" ref={subDropdownRef}>
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-4 mb-2 block">
                            Subcategory
                        </label>
                        <button
                            type="button"
                            onClick={() => setIsSubDropdownOpen(!isSubDropdownOpen)}
                            className={`w-full bg-slate-900/50 border border-slate-800 rounded-2xl py-4 pl-6 pr-6 flex items-center justify-between group transition-all duration-300 ${isSubDropdownOpen ? 'border-yellow-400/50 ring-4 ring-yellow-400/5' : ''
                                }`}
                        >
                            <div className="flex items-center gap-4">
                                <div className={`text-slate-500 transition-colors ${isSubDropdownOpen ? 'text-yellow-400' : 'group-hover:text-slate-300'}`}>
                                    <Tag size={18} />
                                </div>
                                <span className="text-white font-bold">{subcategory || subcategories[0] || 'Select'}</span>
                            </div>
                            <ChevronDown
                                size={18}
                                className={`text-slate-600 transition-transform duration-300 ${isSubDropdownOpen ? 'rotate-180 text-yellow-400' : ''}`}
                            />
                        </button>

                        {isSubDropdownOpen && (
                            <div className="absolute top-[calc(100%+8px)] left-0 w-full z-[100] bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-2xl shadow-slate-950/60 overflow-hidden animate-in fade-in zoom-in-95 duration-200 origin-top">
                                <div className="p-2 max-h-[280px] overflow-y-auto no-scrollbar">
                                    {subcategories.map((sub) => (
                                        <button
                                            key={sub}
                                            type="button"
                                            onClick={() => {
                                                setSubcategory(sub);
                                                setIsSubDropdownOpen(false);
                                            }}
                                            className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all ${(subcategory || subcategories[0]) === sub
                                                ? 'bg-yellow-400 text-slate-950 font-black'
                                                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                                                }`}
                                        >
                                            <span className="text-sm tracking-wide">{sub}</span>
                                            {(subcategory || subcategories[0]) === sub && (
                                                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-slate-950" />
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Date & Note row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Date Field */}
                    <div className="group">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-4 mb-2 block">
                            Date
                        </label>
                        <DayPicker value={date} onChange={setDate} />
                    </div>

                    {/* Note Field */}
                    <div className="group">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-4 mb-2 block">
                            Note (Optional)
                        </label>
                        <div className="relative">
                            <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-yellow-400 transition-colors">
                                <FileText size={18} />
                            </div>
                            <input
                                type="text"
                                value={note}
                                onChange={(e) => setNote(e.target.value)}
                                placeholder="What was this for?"
                                className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl py-4 pl-14 pr-6 text-white font-bold placeholder:text-slate-700 focus:outline-none focus:border-yellow-400/50 transition-all"
                            />
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex gap-4 pt-4">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="flex-1 bg-slate-800/50 hover:bg-slate-800 text-slate-400 font-black uppercase tracking-widest py-5 rounded-[1.5rem] transition-all border border-slate-700/50"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={!amount}
                        className="flex-[2] bg-yellow-400 hover:bg-yellow-300 disabled:opacity-50 disabled:hover:bg-yellow-400 text-slate-950 font-black uppercase tracking-widest py-5 rounded-[1.5rem] transition-all shadow-xl shadow-yellow-400/10 hover:shadow-yellow-400/20 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
                    >
                        {initialData ? 'Update Transaction' : 'Confirm Transaction'}
                    </button>
                </div>
            </form>
        </div>
    );
}
