import { Link, useLocation } from 'react-router-dom';
import { Home, BarChart2, Settings, Calendar, Users } from 'lucide-react';

export default function BottomNav() {
    const location = useLocation();
    const path = location.pathname;

    return (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[#0F172A] pb-6 pt-4 px-6 flex justify-between items-center z-50 border-t border-slate-800/50 backdrop-blur-lg">
            <Link
                to="/"
                className={`w-12 h-12 flex items-center justify-center rounded-full transition-colors ${path === '/' ? 'text-white' : 'text-slate-500 hover:text-slate-300'}`}
            >
                <Home size={24} />
            </Link>

            <Link
                to="/statistics"
                className={`w-12 h-12 flex items-center justify-center rounded-full transition-colors ${path === '/statistics' ? 'text-white' : 'text-slate-500 hover:text-slate-300'}`}
            >
                <BarChart2 size={24} />
            </Link>

            <Link
                to="/this-month"
                className={`w-12 h-12 flex items-center justify-center rounded-full transition-colors ${path === '/this-month' ? 'text-white' : 'text-slate-500 hover:text-slate-300'}`}
            >
                <Calendar size={24} />
            </Link>

            <Link
                to="/debts"
                className={`w-12 h-12 flex items-center justify-center rounded-full transition-colors ${path === '/debts' ? 'text-white' : 'text-slate-500 hover:text-slate-300'}`}
            >
                <Users size={24} />
            </Link>

            <Link
                to="/settings"
                className={`w-12 h-12 flex items-center justify-center rounded-full transition-colors ${path === '/settings' ? 'text-white' : 'text-slate-500 hover:text-slate-300'}`}
            >
                <Settings size={24} />
            </Link>
        </nav>
    );
}
