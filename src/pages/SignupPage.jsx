import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Lock, ArrowRight, Loader2, Wallet } from 'lucide-react';

export default function SignupPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await register({ name, email, password });
            navigate('/', { replace: true });
        } catch (err) {
            setError(err.message || "Failed to create account. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-slate-950">
            <div className="w-full max-w-md animate-in fade-in zoom-in-95 duration-500">
                {/* Logo Section */}
                <div className="flex flex-col items-center mb-8">
                    <div className="w-16 h-16 bg-yellow-400 rounded-2xl flex items-center justify-center shadow-lg shadow-yellow-400/20 mb-4 transform rotate-6">
                        <Wallet className="text-slate-950" size={32} strokeWidth={2.5} />
                    </div>
                    <h1 className="text-3xl font-black text-white tracking-tighter uppercase italic">
                        Vault<span className="text-yellow-400">Flow</span>
                    </h1>
                    <p className="text-slate-500 font-medium text-sm mt-1">Start your financial journey here</p>
                </div>

                {/* Form Section */}
                <div className="bg-[#1E293B] border border-slate-700/50 rounded-[2.5rem] p-8 shadow-2xl shadow-slate-950/50">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="bg-red-500/10 border border-red-500/50 text-red-500 px-4 py-3 rounded-2xl text-xs font-bold animate-in slide-in-from-top-2 duration-300">
                                {error}
                            </div>
                        )}

                        <div className="space-y-4">
                            <div className="group">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-4 mb-2 block">
                                    Full Name
                                </label>
                                <div className="relative">
                                    <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-yellow-400 transition-colors">
                                        <User size={18} />
                                    </div>
                                    <input
                                        type="text"
                                        required
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl py-4 pl-14 pr-6 text-white font-bold focus:outline-none focus:border-yellow-400/50 transition-all placeholder:text-slate-700"
                                        placeholder="John Doe"
                                    />
                                </div>
                            </div>

                            <div className="group">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-4 mb-2 block">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-yellow-400 transition-colors">
                                        <Mail size={18} />
                                    </div>
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl py-4 pl-14 pr-6 text-white font-bold focus:outline-none focus:border-yellow-400/50 transition-all placeholder:text-slate-700"
                                        placeholder="you@example.com"
                                    />
                                </div>
                            </div>

                            <div className="group">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-4 mb-2 block">
                                    Set Password
                                </label>
                                <div className="relative">
                                    <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-yellow-400 transition-colors">
                                        <Lock size={18} />
                                    </div>
                                    <input
                                        type="password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl py-4 pl-14 pr-6 text-white font-bold focus:outline-none focus:border-yellow-400/50 transition-all placeholder:text-slate-700"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-black py-5 rounded-3xl flex items-center justify-center gap-3 transition-all active:scale-95 shadow-xl shadow-yellow-400/10 ${loading ? 'opacity-70 cursor-not-allowed text-transparent' : ''}`}
                        >
                            {loading && (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <Loader2 className="animate-spin text-slate-950" size={24} strokeWidth={3} />
                                </div>
                            )}
                            CREATE ACCOUNT
                            <ArrowRight size={20} strokeWidth={3} />
                        </button>
                    </form>
                </div>

                <p className="mt-8 text-center text-slate-500 font-bold text-sm">
                    Already have an account?{' '}
                    <Link to="/login" className="text-yellow-400 hover:text-yellow-300 transition-colors">
                        Sign In Here
                    </Link>
                </p>
            </div>
        </div>
    );
}
