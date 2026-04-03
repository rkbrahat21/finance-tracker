import TopNav from './TopNav';
import BottomNav from './BottomNav';

export default function AppLayout({ children }) {
    return (
        <div className="bg-[#0F172A] min-h-screen text-slate-100 font-sans selection:bg-sky-500/30 px-4 md:px-10">
            {/* Mobile Header, shown on desktop too */}
            <TopNav />

            <main className="flex-1 pb-24 md:pb-6">
                {children}
            </main>

            <BottomNav />
        </div>
    );
}
