import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { ShoppingBag } from 'lucide-react';

export default function OverviewStats({ stats }) {
    if (!stats || !stats.pieData) return null;

    return (
        <div className="bg-[#1E293B] rounded-[2rem] p-6 h-full flex flex-col">
            <h2 className="text-lg font-semibold text-white mb-6">Overview Statistics</h2>

            <div className="flex-1 flex flex-col items-center justify-center relative min-h-[240px]">
                <div className="w-full h-full absolute inset-0">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={stats.pieData}
                                cx="50%"
                                cy="50%"
                                innerRadius={70}
                                outerRadius={90}
                                cornerRadius={8}
                                paddingAngle={5}
                                dataKey="value"
                                stroke="none"
                            >
                                {stats.pieData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                {/* Center text of Donut */}
                <div className="flex flex-col items-center justify-center pointer-events-none z-10">
                    <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center mb-2">
                        <ShoppingBag size={18} className="text-white" />
                    </div>
                    <span className="text-2xl font-bold text-white">৳{stats.totalSpending?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    <span className="text-xs text-slate-400 mt-1">Total Spending</span>
                </div>
            </div>

            {/* Category Legend */}
            <div className="grid grid-cols-2 gap-3 mt-6">
                {stats.pieData.slice(0, 4).map((category) => (
                    <div key={category.name} className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: category.color }}></div>
                        <span className="text-xs font-medium text-slate-300 truncate">{category.name}</span>
                        <span className="text-[10px] text-slate-500 ml-auto">{Math.round((category.value / stats.totalSpending) * 100)}%</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
