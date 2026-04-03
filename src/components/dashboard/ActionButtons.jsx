import { Plus } from 'lucide-react';

export default function ActionButtons({ onAddInfo }) {
    return (
        <div className="mt-4 mb-8">
            <button
                onClick={onAddInfo}
                className="w-full bg-slate-800 hover:bg-slate-700 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-3 py-4 rounded-[2rem] border border-slate-700/50 group relative overflow-hidden"
            >
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/0 via-yellow-400/5 to-yellow-400/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>

                <div className="w-8 h-8 rounded-2xl bg-yellow-400 flex items-center justify-center text-slate-900 shadow-[0_0_15px_rgba(253,224,71,0.3)] group-hover:shadow-[0_0_20px_rgba(253,224,71,0.5)] transition-all">
                    <Plus size={20} strokeWidth={3} />
                </div>

                <div className="text-left">
                    <span className="block text-sm font-black text-white uppercase tracking-[0.2em]">Add Info</span>
                    <span className="block text-[10px] text-slate-500 font-bold uppercase tracking-widest">New Transaction</span>
                </div>
            </button>
        </div>
    );
}
