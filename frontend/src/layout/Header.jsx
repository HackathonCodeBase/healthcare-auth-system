import React, { useState } from 'react';
import { Menu, Zap, ChevronDown, Loader2 } from 'lucide-react';
import useAuthStore from '../store/authStore';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';

const Header = () => {
    const { user, setLogin } = useAuthStore();
    const navigate = useNavigate();
    const [switching, setSwitching] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const demoAccounts = [
        { label: 'Admin', email: 'admin@demo.com', role: 'ADMIN', color: 'text-blue-400' },
        { label: 'Doctor', email: 'doctor@demo.com', role: 'DOCTOR', color: 'text-rose-400' },
        { label: 'Nurse', email: 'nurse@demo.com', role: 'NURSE', color: 'text-amber-400' },
        { label: 'Patient', email: 'patient@demo.com', role: 'PATIENT', color: 'text-emerald-400' }
    ];

    const switchRole = async (email) => {
        setSwitching(true);
        setDropdownOpen(false);
        try {
            const res = await api.post('/auth/login', { email, password: 'Demo123!' });
            const { user: newUser, accessToken, refreshToken } = res.data.data;
            setLogin(newUser, accessToken, refreshToken);
            toast.success(`Demo Mode: Switched to ${newUser.role}`);
            navigate('/');
        } catch (error) {
            toast.error('Failed to switch demo role. Seed data might be missing.');
        } finally {
            setSwitching(false);
        }
    };

    return (
        <header className="h-16 flex items-center justify-between px-6 bg-dark-bg/80 backdrop-blur border-b border-dark-border sticky top-0 z-50">
            <div className="flex items-center gap-4">
                <button className="lg:hidden p-2 text-dark-textMuted hover:text-dark-text rounded-md">
                    <Menu size={20} />
                </button>
                <div className="flex items-center gap-2 bg-gradient-to-r from-amber-500/20 to-rose-500/20 px-3 py-1.5 rounded-full border border-amber-500/30">
                    <Zap size={14} className="text-amber-500 animate-pulse" />
                    <span className="text-xs font-bold text-amber-500 tracking-widest uppercase">Live Demo Mode</span>
                </div>
            </div>

            <div className="flex items-center gap-4">

                {/* Demo Role Switcher */}
                <div className="relative">
                    <button
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                        disabled={switching}
                        className="flex items-center gap-2 border border-dark-border px-4 py-1.5 rounded-xl bg-dark-card hover:bg-dark-border transition-colors disabled:opacity-50"
                    >
                        {switching ? <Loader2 size={16} className="animate-spin text-teal-500" /> : <div className="w-2 h-2 rounded-full bg-teal-500 animate-pulse"></div>}
                        <span className="text-sm font-semibold text-dark-text">Simulate Role</span>
                        <ChevronDown size={14} className="text-dark-textMuted" />
                    </button>

                    {dropdownOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-dark-card border border-dark-border shadow-2xl rounded-xl overflow-hidden py-1 z-50 animate-in fade-in zoom-in-95 duration-200">
                            <div className="px-4 py-2 border-b border-dark-border/50 text-xs font-bold text-dark-textMuted uppercase tracking-wider bg-dark-bg/50">
                                Switch Demo Identity
                            </div>
                            {demoAccounts.map(account => (
                                <button
                                    key={account.role}
                                    onClick={() => switchRole(account.email)}
                                    className={`w-full text-left px-4 py-2.5 text-sm hover:bg-dark-bg transition-colors flex items-center justify-between ${user?.email === account.email ? 'bg-dark-bg font-bold' : 'font-medium'}`}
                                >
                                    <span className="text-dark-text">{account.label}</span>
                                    <span className={`text-[10px] uppercase tracking-widest ${account.color}`}>{account.role}</span>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

            </div>
        </header>
    );
};

export default Header;
