import { getCategoryIcon } from '../../constants/categories.jsx';

export default function TransactionCards({ transactions = [] }) {
    // Show only the 5 most recent transactions in the cards
    const recentTransactions = transactions.slice(0, 5);

    return (
        <div className="mt-8">
            <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar snap-x">
                {recentTransactions.map((tx, index) => (
                    <div
                        key={tx.id}
                        // w-[calc(33.333%-10.66px)] ensures exactly 3 cards fit in the visible area (accounting for the 1rem gap)
                        className="bg-[#1E293B] rounded-3xl p-5 w-[calc(33.333%-10.66px)] min-w-[140px] snap-start shrink-0 flex flex-col justify-between h-36 transition-all duration-300 hover:bg-slate-800 hover:scale-[1.02] hover:shadow-lg animate-in fade-in slide-in-from-right-4"
                        style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'both' }}
                    >
                        <div className="flex items-center gap-2">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center 
                                ${tx.type === 'income' ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'}
                            `}>
                                {getCategoryIcon(tx.category)}
                            </div>
                            <div className="flex flex-col">
                                <span className="text-sm font-medium text-slate-300 truncate w-20">{tx.category}</span>
                            </div>
                        </div>

                        <div className="mt-4">
                            <div className={`text-xl font-bold ${tx.type === 'income' ? 'text-green-400' : 'text-white'}`}>
                                {tx.type === 'income' ? '+' : '-'}৳{tx.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </div>
                            <div className="text-xs text-slate-500 mt-1 truncate">
                                {new Date(tx.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} • {tx.subcategory || tx.note || 'No note'}
                            </div>
                        </div>
                    </div>
                ))}
                {recentTransactions.length === 0 && (
                    <div className="text-sm text-slate-500 px-4">No recent transactions to display</div>
                )}
            </div>

        </div>
    );
}
