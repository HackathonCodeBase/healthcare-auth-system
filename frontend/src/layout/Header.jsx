<<<<<<< HEAD
import React from 'react';
import { Menu, X } from 'lucide-react';
import useAuthStore from '../store/authStore';

const Header = ({ onMenuToggle, isSidebarOpen }) => {
    const { user } = useAuthStore();
=======
import React, { useEffect } from 'react';
import { Menu, X, Wifi, WifiOff } from 'lucide-react';
import useAuthStore from '../store/authStore';
import useHealthStore from '../store/healthStore';

const Header = ({ onMenuToggle, isSidebarOpen }) => {
    const { user } = useAuthStore();
    const { status, checkHealth } = useHealthStore();

    useEffect(() => {
        checkHealth();
        const interval = setInterval(checkHealth, 30000); // Check every 30s
        return () => clearInterval(interval);
    }, [checkHealth]);
>>>>>>> 3b5969d318a5ab0380d1a8d5df4c76d8197bf107

    return (
        <header className="h-14 flex items-center justify-between px-5 bg-dark-nav border-b border-dark-border sticky top-0 z-50">
            <div className="flex items-center gap-3">
                <button
                    onClick={onMenuToggle}
                    className="lg:hidden p-1.5 text-dark-textMuted hover:text-dark-text rounded-md transition-all"
                    aria-label="Toggle menu"
                >
                    {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
                </button>
                {/* Breadcrumb */}
                <nav className="flex items-center gap-2 text-sm text-dark-textMuted">
                    <span className="text-white font-medium">Dashboard</span>
                </nav>
            </div>

            <div className="flex items-center gap-3">
<<<<<<< HEAD
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                    <span className="text-xs text-dark-textMuted hidden sm:block">System Online</span>
                </div>
=======
                {/* 5) Verify Health Endpoint Connectivity */}
                <div className="flex items-center gap-2 bg-dark-bg/50 px-3 py-1 rounded-full border border-dark-border">
                    {status === 'OK' ? (
                        <>
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse ring-4 ring-emerald-500/20"></div>
                            <span className="text-[10px] uppercase font-bold text-emerald-500 tracking-wider hidden sm:block">API Connected</span>
                        </>
                    ) : (
                        <>
                            <div className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse ring-4 ring-rose-500/20"></div>
                            <span className="text-[10px] uppercase font-bold text-rose-500 tracking-wider hidden sm:block">API Offline</span>
                        </>
                    )}
                </div>

>>>>>>> 3b5969d318a5ab0380d1a8d5df4c76d8197bf107
                <div className="hidden sm:flex items-center gap-2 pl-3 border-l border-dark-border">
                    <span className="text-xs text-dark-textMuted">{user?.email}</span>
                    <span className="px-1.5 py-0.5 bg-blue-600/20 text-blue-400 rounded text-[10px] font-bold uppercase">{user?.role}</span>
                </div>
            </div>
        </header>
    );
};

export default Header;
