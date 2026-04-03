import { useState, useRef } from 'react';
import {
    Bell, Shield, Eye, Database, Smartphone, Palette,
    ChevronRight, ArrowRight, User, Mail, Globe,
    Moon, Cloud, Save, Zap, LogOut, Camera, Wallet, ShieldCheck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { getAvatarUrl } from '../services/api';

export default function Settings() {
    const { user, logout, updateAvatar } = useAuth();
    const navigate = useNavigate();
    const fileInputRef = useRef(null);
    const [activeTab, setActiveTab] = useState('account');
    const [notifications, setNotifications] = useState(true);
    const [theme, setTheme] = useState('Dark');
    const [currency, setCurrency] = useState('BDT (৳)');
    const [language, setLanguage] = useState('English');

    // Profile Edit State
    const [isEditing, setIsEditing] = useState(false);
    const [profile, setProfile] = useState({
        name: user?.name || 'User',
        email: user?.email || 'user@example.com'
    });
    const [tempProfile, setTempProfile] = useState({ ...profile });



    const handleAvatarChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('avatar', file);

        try {
            await updateAvatar(formData);
        } catch (err) {
            console.error("Failed to upload avatar", err);
            alert("Failed to upload image. Please try again.");
        }
    };

    const handleSaveProfile = () => {
        setProfile({ ...tempProfile });
        setIsEditing(false);
    };

    const handleCancelProfile = () => {
        setTempProfile({ ...profile });
        setIsEditing(false);
    };


    const SettingItem = ({ icon: Icon, label, value, onClick, color = "text-slate-400", isEditable = true }) => (
        <button
            onClick={onClick}
            className={`w-full flex items-center justify-between p-4 rounded-2xl ${isEditable ? 'hover:bg-slate-800/40 transition-all group' : 'cursor-default'}`}
        >
            <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center ${color}`}>
                    <Icon size={20} />
                </div>
                <div className="text-left">
                    <p className="text-sm font-bold text-white uppercase tracking-tight">{label}</p>
                    <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">{value}</p>
                </div>
            </div>
            {isEditable && <ChevronRight size={18} className="text-slate-600 group-hover:text-slate-400 transition-colors" />}
        </button>
    );

    const ToggleItem = ({ icon: Icon, label, description, enabled, onToggle, color = "text-slate-400" }) => (
        <div className="flex items-center justify-between p-4 rounded-2xl transition-all">
            <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center ${color}`}>
                    <Icon size={20} />
                </div>
                <div className="text-left">
                    <p className="text-sm font-bold text-white uppercase tracking-tight">{label}</p>
                    <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">{description}</p>
                </div>
            </div>
            <div
                onClick={onToggle}
                className={`w-12 h-6 rounded-full relative cursor-pointer transition-all duration-300 ease-in-out ${enabled ? 'bg-yellow-400 shadow-[0_0_15px_rgba(253,224,71,0.2)]' : 'bg-slate-700'}`}
            >
                <div className={`w-4 h-4 rounded-full absolute top-1 transition-all duration-300 ease-in-out ${enabled ? 'right-1 bg-slate-900' : 'left-1 bg-slate-400'}`}></div>
            </div>
        </div>
    );

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 mx-auto pt-6 pb-24 space-y-8 max-w-6xl">

            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black text-white tracking-tight">Settings</h1>
                    <p className="text-slate-500 text-sm font-medium">Manage your profile and preferences</p>
                </div>
                {/* Global Save Button - can be used if needed, here it just feedback */}
                <button
                    onClick={() => {
                        // If anything is being edited, save it
                        if (isEditing) handleSaveProfile();
                    }}
                    className="hidden md:block px-6 py-2 bg-yellow-400 rounded-2xl text-slate-900 text-xs font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(253,224,71,0.2)]"
                >
                    Save Changes
                </button>
            </div>

            {/* Profile Hero Card */}
            <div className="bg-[#1E293B]/50 backdrop-blur-xl rounded-[2.5rem] p-8 border border-slate-700/30 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-400/5 blur-[100px] rounded-full -mr-32 -mt-32 transition-all group-hover:bg-yellow-400/10"></div>

                <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
                    <div className="flex flex-col md:flex-row items-center gap-8 text-center md:text-left w-full md:w-auto">
                        <div className="relative group/avatar shrink-0">
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleAvatarChange}
                                className="hidden"
                                accept="image/*"
                            />
                            <div className="w-24 h-24 rounded-[2rem] bg-slate-700 overflow-hidden ring-4 ring-slate-800/50 group-hover/avatar:ring-yellow-400/30 transition-all duration-500 flex items-center justify-center">
                                {user?.avatar ? (
                                    <img
                                        src={getAvatarUrl(user.avatar)}
                                        alt="Profile"
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover/avatar:scale-110"
                                    />
                                ) : (
                                    <User size={40} className="text-slate-500" />
                                )}
                            </div>
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="absolute -bottom-2 -right-2 w-8 h-8 bg-yellow-400 rounded-xl flex items-center justify-center text-slate-900 shadow-xl border-4 border-[#1E293B] hover:scale-110 transition-transform"
                            >
                                <Camera size={14} />
                            </button>
                        </div>

                        <div className="flex-1 w-full">
                            {isEditing ? (
                                <div className="space-y-3 max-w-md mx-auto md:mx-0">
                                    <div className="space-y-1">
                                        <label className="text-[10px] text-slate-500 font-black uppercase tracking-widest px-1">Display Name</label>
                                        <input
                                            autoFocus
                                            type="text"
                                            value={tempProfile.name}
                                            onChange={(e) => setTempProfile({ ...tempProfile, name: e.target.value })}
                                            className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-2 text-white font-bold focus:outline-none focus:border-yellow-400/50 transition-colors"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] text-slate-500 font-black uppercase tracking-widest px-1">Email Address</label>
                                        <input
                                            type="email"
                                            value={tempProfile.email}
                                            onChange={(e) => setTempProfile({ ...tempProfile, email: e.target.value })}
                                            className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-2 text-white font-bold focus:outline-none focus:border-yellow-400/50 transition-colors"
                                        />
                                    </div>
                                    <div className="flex gap-2 pt-2">
                                        <button
                                            onClick={handleSaveProfile}
                                            className="px-6 py-2 bg-yellow-400 rounded-xl text-slate-900 text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-lg shadow-yellow-400/10"
                                        >
                                            Save
                                        </button>
                                        <button
                                            onClick={handleCancelProfile}
                                            className="px-6 py-2 bg-slate-800 rounded-xl text-white text-[10px] font-black uppercase tracking-widest hover:bg-slate-700 transition-colors"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <h2 className="text-3xl font-black text-white">{profile.name}</h2>
                                    <p className="text-slate-500 text-sm font-medium mb-4">{profile.email} · Pro Account</p>
                                    <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                                        <button
                                            onClick={() => setIsEditing(true)}
                                            className="px-4 py-1.5 bg-slate-800 rounded-xl text-[10px] font-black text-white uppercase tracking-widest hover:bg-slate-700 transition-colors ring-1 ring-slate-700/50"
                                        >
                                            Edit Profile
                                        </button>
                                        <button className="px-4 py-1.5 bg-slate-800/30 rounded-xl text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-slate-300 transition-colors">Switch Account</button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    {!isEditing && (
                        <div className="shrink-0">
                            <button className="px-6 py-3 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-[11px] font-black text-rose-500 uppercase tracking-widest hover:bg-rose-500/20 transition-all flex items-center gap-2 group/logout shadow-lg shadow-rose-900/5">
                                <LogOut size={16} className="group-hover/logout:-translate-x-1 transition-transform" />
                                Log Out
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Settings Sections Grid - Multi Column for Desktop */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                <div className="space-y-6">
                    {/* Finance Section */}
                    <div className="bg-[#1E293B]/50 backdrop-blur-xl rounded-[2.5rem] p-6 border border-slate-700/30">
                        <h3 className="px-4 text-[10px] font-black text-slate-600 uppercase tracking-[0.3em] mb-4">Financial Settings</h3>
                        <div className="space-y-1">
                            <SettingItem
                                icon={Globe}
                                label="Primary Currency"
                                value={currency}
                                color="text-blue-400"
                                onClick={() => { }} // Could add currency selector modal later
                            />
                        </div>
                    </div>

                    {/* Preferences Section */}
                    <div className="bg-[#1E293B]/50 backdrop-blur-xl rounded-[2.5rem] p-6 border border-slate-700/30">
                        <h3 className="px-4 text-[10px] font-black text-slate-600 uppercase tracking-[0.3em] mb-4">Preferences</h3>
                        <div className="space-y-1">
                            <ToggleItem
                                icon={Bell}
                                label="Notifications"
                                description="Email and Push Alerts"
                                enabled={notifications}
                                onToggle={() => setNotifications(!notifications)}
                                color="text-rose-400"
                            />
                            <SettingItem
                                icon={Moon}
                                label="App Theme"
                                value={theme}
                                color="text-purple-400"
                                onClick={() => setTheme(theme === 'Dark' ? 'Light' : 'Dark')}
                            />
                            <SettingItem
                                icon={Globe}
                                label="Language"
                                value={language}
                                color="text-emerald-400"
                                onClick={() => { }}
                            />
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    {/* Security Section */}
                    <div className="bg-[#1E293B]/50 backdrop-blur-xl rounded-[2.5rem] p-6 border border-slate-700/30">
                        <h3 className="px-4 text-[10px] font-black text-slate-600 uppercase tracking-[0.3em] mb-4">Security & Data</h3>
                        <div className="space-y-1">
                            <SettingItem
                                icon={ShieldCheck}
                                label="Password & Security"
                                value="Last changed 3 months ago"
                                color="text-blue-500"
                                onClick={() => { }}
                            />
                            <SettingItem
                                icon={Database}
                                label="Data Management"
                                value="Export or delete data"
                                color="text-slate-400"
                                onClick={() => { }}
                            />
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
