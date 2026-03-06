import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, FileLock2, ShieldAlert, List, LogOut, Activity, Shield } from 'lucide-react';
import useAuthStore from '../store/authStore';

const Sidebar = ({ isOpen, onClose }) => {
    const { user, logout } = useAuthStore();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const menuItems = [
        { name: 'Dashboard', icon: LayoutDashboard, path: '/', roles: ['ADMIN', 'DOCTOR', 'NURSE', 'PATIENT'] },
        { name: 'Patients', icon: Users, path: '/patients', roles: ['ADMIN', 'DOCTOR', 'NURSE', 'PATIENT'] },
        { name: 'Consent Management', icon: FileLock2, path: '/consent', roles: ['PATIENT', 'ADMIN', 'DOCTOR', 'NURSE'] },
        { name: 'Emergency Access', icon: ShieldAlert, path: '/emergency', roles: ['DOCTOR', 'ADMIN'] },
        { name: 'Assignments', icon: List, path: '/assignments', roles: ['ADMIN'] },
        { name: 'Privacy Center', icon: List, path: '/privacy', roles: ['PATIENT'] },
        { name: 'Audit Logs', icon: List, path: '/audit-logs', roles: ['ADMIN'] },
        { name: 'System Health', icon: Activity, path: '/health', roles: ['ADMIN', 'DOCTOR', 'NURSE', 'PATIENT'] },
    ];

    const allowedMenus = menuItems.filter(item => item.roles.includes(user?.role));

    const handleNavClick = () => {
        if (onClose) onClose();
    };

    return (
        <>
            {/* Mobile overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/70 z-30 lg:hidden"
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`
                    fixed lg:static inset-y-0 left-0 z-40
                    w-60 h-screen bg-dark-nav border-r border-dark-border
                    flex flex-col justify-between
                    transition-transform duration-300 ease-in-out
                    ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                `}
            >
                {/* Brand */}
                <div>
                    <div className="px-5 py-5 flex items-center gap-3 border-b border-dark-border">
                        <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shrink-0">
                            <Shield size={16} className="text-white" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-white leading-tight">MedAuth</p>
                            <p className="text-[10px] text-dark-textMuted leading-tight">TetherX Hackathon</p>
                        </div>
                    </div>

                    <div className="px-3 pt-4">
                        <p className="text-[10px] uppercase tracking-widest text-dark-textMuted font-semibold px-3 mb-2">Menu</p>
                        <nav className="space-y-0.5">
                            {allowedMenus.map((item) => (
                                <NavLink
                                    key={item.name}
                                    to={item.path}
                                    onClick={handleNavClick}
                                    className={({ isActive }) =>
                                        `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${isActive
                                            ? 'bg-blue-600/15 text-blue-400 font-medium'
                                            : 'text-dark-textMuted hover:bg-white/5 hover:text-dark-text'
                                        }`
                                    }
                                >
                                    <item.icon size={17} />
                                    {item.name}
                                </NavLink>
                            ))}
                        </nav>
                    </div>
                </div>

                {/* User + Logout */}
                <div className="p-3 border-t border-dark-border">
                    <div className="flex items-center gap-3 px-3 py-2 mb-1">
                        <div className="w-8 h-8 rounded-full bg-blue-600/20 text-blue-400 flex items-center justify-center font-bold text-sm shrink-0">
                            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                        </div>
                        <div className="min-w-0">
                            <p className="text-sm font-semibold truncate text-white">{user?.name}</p>
                            <p className="text-[11px] text-dark-textMuted">{user?.role}</p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-dark-textMuted hover:text-red-400 hover:bg-red-400/5 rounded-lg transition-all"
                    >
                        <LogOut size={17} />
                        Logout
                    </button>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
