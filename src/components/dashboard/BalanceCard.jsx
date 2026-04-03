import { ArrowDownLeft, ArrowUpRight, PiggyBank } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function BalanceCard({ totalBalance, totalIncome, totalExpenses, totalSavings }) {
    const currentMonth = new Date().toLocaleString('en-US', { month: 'long' });

    return (
        <div className="bg-[white] rounded-[2rem] p-6 sm:p-8 text-slate-900 shadow-xl relative overflow-hidden w-full group transition-all duration-300 hover:scale-[1.01] hover:shadow-2xl">
            {/* Top Right: Current Month Banner */}
            <Link to="/this-month" className="absolute top-6 right-6 sm:top-8 sm:right-8 block hover:scale-105 active:scale-95 transition-transform">
                <div className="bg-red-500 text-white font-bold text-sm sm:text-base px-5 py-2 rounded-full uppercase tracking-wider shadow-sm flex items-center gap-2">
                    {new Date().toLocaleString('en-US', { month: 'long', year: 'numeric' })}
                </div>
            </Link>

            {/* Header: Total Balance */}
            <div className="relative mb-8 sm:mb-12 pt-2">
                <span className="text-slate-700 text-xs sm:text-sm font-semibold mb-1 block">Total Balance</span>
                <div className="flex items-center gap-3">
                    <h2 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tighter">৳{totalBalance?.toLocaleString('en-US', { minimumFractionDigits: 2 })}</h2>
                </div>
            </div>

            {/* Bottom Row: 3 Stats (Horizontal on desktop, wrapped on mobile) */}
            <div className="relative flex flex-wrap sm:flex-nowrap items-center justify-between gap-4 sm:gap-6">


                {/* Income */}
                <div className="flex items-center gap-2 sm:gap-3 w-1/3 sm:w-auto">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 shrink-0 rounded-full bg-green-500/20 flex items-center justify-center text-green-700 transition-transform group-hover:scale-110">
                        <ArrowDownLeft size={16} className="sm:w-[20px] sm:h-[20px]" strokeWidth={2.5} />
                    </div>
                    <div className="flex flex-col">
                        <span className="font-black text-[10px] sm:text-lg md:text-xl">৳{totalIncome?.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</span>
                        <span className="text-[6px] sm:text-[9px] text-slate-600 font-extrabold uppercase tracking-widest mt-0.5">Income</span>
                    </div>
                </div>

                {/* Expense */}
                <div className="flex items-center gap-2 sm:gap-3 w-1/3 sm:w-auto">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 shrink-0 rounded-full bg-red-500/20 flex items-center justify-center text-red-700 transition-transform group-hover:scale-110">
                        <ArrowUpRight size={16} className="sm:w-[20px] sm:h-[20px]" strokeWidth={2.5} />
                    </div>
                    <div className="flex flex-col">
                        <span className="font-black text-[10px] sm:text-lg md:text-xl">৳{totalExpenses?.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</span>
                        <span className="text-[6px] sm:text-[9px] text-slate-600 font-extrabold uppercase tracking-widest mt-0.5">Expenses</span>
                    </div>
                </div>

                {/* Savings (Historical Total) */}
                <Link to="/savings" className="flex items-center gap-2 sm:gap-3 w-1/3 sm:w-auto hover:opacity-80 transition-opacity">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 shrink-0 rounded-full bg-yellow-400/20 flex items-center justify-center text-yellow-700 transition-transform group-hover:scale-110">
                        <PiggyBank size={16} className="sm:w-[20px] sm:h-[20px]" strokeWidth={2.5} />
                    </div>
                    <div className="flex flex-col">
                        <span className="font-black text-[10px] sm:text-lg md:text-xl">৳{totalSavings?.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</span>
                        <span className="text-[6px] sm:text-[9px] text-slate-600 font-extrabold uppercase tracking-widest mt-0.5">Total Savings</span>
                    </div>
                </Link>
            </div>
        </div>
    );
}
