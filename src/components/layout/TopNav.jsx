import { Bell, Search, Home, BarChart2, Settings, Calendar, User as UserIcon, Users, PiggyBank, PieChart, Wallet, TrendingUp } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getAvatarUrl } from '../../services/api';

export default function TopNav() {
    const { user } = useAuth();
    const location = useLocation();
    const path = location.pathname;

    return (
        <header className="flex justify-between items-center py-6 shrink-0">
            <Link to="/settings" className="flex items-center gap-3 group hover:opacity-80 transition-opacity">
                <div className="w-10 h-10 rounded-full bg-slate-700 overflow-hidden ring-2 ring-transparent group-hover:ring-yellow-400/50 transition-all flex items-center justify-center">
                    {user?.avatar ? (
                        <img src={getAvatarUrl(user.avatar)} alt="User avatar" className="w-full h-full object-cover" />
                    ) : (
                        <UserIcon size={20} className="text-slate-400" />
                    )}
                </div>
                <div>
                    <p className="text-sm text-slate-400 group-hover:text-slate-200 transition-colors tracking-tight">Hello {user?.name.split(' ')[0] || 'User'}</p>
                    <p className="text-sm font-medium text-white">{new Date().toLocaleString('en-US', { month: 'long', year: 'numeric' })}</p>
                </div>
            </Link>

            {/* Desktop Navigation (Hidden on Mobile) */}
            <nav className="hidden md:flex justify-between items-center gap-6">
                <Link to="/" title="Home" className={`flex items-center gap-2 transition-colors ${path === '/' ? 'text-white font-medium' : 'text-slate-500 hover:text-slate-300'}`}>
                    <Home size={20} />
                </Link>
                <Link to="/this-month" title="This Month" className={`flex items-center gap-2 transition-colors ${path === '/this-month' ? 'text-white font-medium' : 'text-slate-500 hover:text-slate-300'}`}>
                    <Calendar size={20} />
                </Link>
                <Link to="/statistics" title="Statistics" className={`flex items-center gap-2 transition-colors ${path === '/statistics' ? 'text-white font-medium' : 'text-slate-500 hover:text-slate-300'}`}>
                    <BarChart2 size={20} />
                </Link>
                <Link to="/debts" title="Debts" className={`flex items-center gap-2 transition-colors ${path === '/debts' ? 'text-white font-medium' : 'text-slate-500 hover:text-slate-300'}`}>
                    <Users size={20} />
                </Link>
                <Link to="/savings" title="Savings" className={`flex items-center gap-2 transition-colors ${path === '/savings' ? 'text-white font-medium' : 'text-slate-500 hover:text-slate-300'}`}>
                    <PiggyBank size={20} />
                </Link>
            </nav>

            {/* Right Side (Actions) */}
            <div className="flex items-center gap-3">
                <div className="flex items-center gap-3">
                    <button className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-300 hover:text-white transition-colors">
                        <Search size={20} />
                    </button>
                    <button className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-300 hover:text-white transition-colors relative">
                        <Bell size={20} />
                        <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border border-slate-800"></span>
                    </button>
                </div>
            </div>
        </header>
    );
}
