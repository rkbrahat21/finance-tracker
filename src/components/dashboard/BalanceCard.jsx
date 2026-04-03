import { ArrowDownLeft, ArrowUpRight, PiggyBank } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function BalanceCard({ totalBalance, totalIncome, totalExpenses, totalSavings }) {
    const currentMonth = new Date().toLocaleString('en-US', { month: 'long' });

    return (
        <div className="bg-white rounded-[2rem] p-6 sm:p-8 text-slate-900 shadow-xl relative overflow-hidden w-full group transition-all duration-300 hover:scale-[1.01] hover:shadow-2xl">
            {/* Header: Total Balance and Month Badge */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 sm:mb-12">
                <div className="relative">
                    <span className="text-slate-700 text-xs sm:text-sm font-semibold mb-1 block uppercase tracking-wider">Total Balance</span>
                    <div className="flex items-center gap-3">
                        <h2 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tighter flex items-center">
                            <span className="text-2xl sm:text-4xl mr-1 text-slate-400">৳</span>
                            {totalBalance?.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </h2>
                    </div>
                </div>

                <Link to="/this-month" className="sm:static hover:scale-105 active:scale-95 transition-transform shrink-0 w-fit">
                    <div className="bg-red-500 text-white font-black text-[10px] sm:text-xs px-4 py-1.5 rounded-full uppercase tracking-[0.15em] shadow-lg shadow-red-500/30 flex items-center gap-2">
                        {new Date().toLocaleString('en-US', { month: 'long', year: 'numeric' })}
                    </div>
                </Link>
            </div>

            {/* Bottom Row: 3 Stats (Horizontal on desktop, stacked on small mobile if needed) */}
            <div className="relative grid grid-cols-2 sm:flex sm:flex-nowrap items-center justify-between gap-6 sm:gap-8">
                {/* Income */}
                <div className="flex items-center gap-2 sm:gap-3">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 shrink-0 rounded-2xl bg-green-500/10 flex items-center justify-center text-green-600 transition-transform group-hover:scale-110">
                        <ArrowDownLeft size={20} className="sm:w-6 sm:h-6" strokeWidth={2.5} />
                    </div>
                    <div className="flex flex-col">
                        <span className="font-extrabold text-sm sm:text-lg md:text-xl leading-tight">৳{totalIncome?.toLocaleString('en-US', { maximumFractionDigits: 0 })}</span>
                        <span className="text-[9px] sm:text-[10px] text-slate-500 font-extrabold uppercase tracking-widest">Income</span>
                    </div>
                </div>

                {/* Expense */}
                <div className="flex items-center gap-2 sm:gap-3">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 shrink-0 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-600 transition-transform group-hover:scale-110">
                        <ArrowUpRight size={20} className="sm:w-6 sm:h-6" strokeWidth={2.5} />
                    </div>
                    <div className="flex flex-col">
                        <span className="font-extrabold text-sm sm:text-lg md:text-xl leading-tight">৳{totalExpenses?.toLocaleString('en-US', { maximumFractionDigits: 0 })}</span>
                        <span className="text-[9px] sm:text-[10px] text-slate-500 font-extrabold uppercase tracking-widest">Expenses</span>
                    </div>
                </div>

                {/* Savings (Historical Total) */}
                <Link to="/savings" className="flex items-center gap-2 sm:gap-3 col-span-2 sm:col-span-1 hover:opacity-80 transition-opacity">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 shrink-0 rounded-2xl bg-yellow-400/10 flex items-center justify-center text-yellow-600 transition-transform group-hover:scale-110">
                        <PiggyBank size={20} className="sm:w-6 sm:h-6" strokeWidth={2.5} />
                    </div>
                    <div className="flex flex-col">
                        <span className="font-extrabold text-sm sm:text-lg md:text-xl leading-tight">৳{totalSavings?.toLocaleString('en-US', { maximumFractionDigits: 0 })}</span>
                        <span className="text-[9px] sm:text-[10px] text-slate-500 font-extrabold uppercase tracking-widest">Total Savings</span>
                    </div>
                </Link>
            </div>
        </div>
    );
}
