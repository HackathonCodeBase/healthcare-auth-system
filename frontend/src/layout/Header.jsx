import React from 'react';
import { Menu, X } from 'lucide-react';
import useAuthStore from '../store/authStore';

const Header = ({ onMenuToggle, isSidebarOpen }) => {
    const { user } = useAuthStore();

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
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                    <span className="text-xs text-dark-textMuted hidden sm:block">System Online</span>
                </div>
                <div className="hidden sm:flex items-center gap-2 pl-3 border-l border-dark-border">
                    <span className="text-xs text-dark-textMuted">{user?.email}</span>
                    <span className="px-1.5 py-0.5 bg-blue-600/20 text-blue-400 rounded text-[10px] font-bold uppercase">{user?.role}</span>
                </div>
            </div>
        </header>
    );
};

export default Header;
