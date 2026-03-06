import React, { useEffect, useState } from 'react';
import useAuthStore from '../store/authStore';
import { ShieldAlert, Users, Activity, Power, CheckCircle, XCircle } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';
import SecurityAlertsPanel from '../components/SecurityAlertsPanel';

const Dashboard = () => {
    const { user } = useAuthStore();
    const [health, setHealth] = useState(null);
    const [adminUsers, setAdminUsers] = useState([]);

    useEffect(() => {
        api.get('/health').then((res) => setHealth(res.data)).catch(() => { });
        if (user?.role === 'ADMIN') fetchUsers();
    }, [user?.role]);

    const fetchUsers = async () => {
        try {
            const res = await api.get('/users');
            setAdminUsers(res.data.data.users);
        } catch (error) {
            console.error('Failed to fetch users', error);
        }
    };

    const toggleUserStatus = async (id, currentStatus) => {
        try {
            const newStatus = currentStatus === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
            await api.patch(`/users/${id}/status`, { status: newStatus });
            toast.success(`User status updated to ${newStatus}`);
            fetchUsers();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update user status');
        }
    };

    const stats = [
        { label: 'Role', value: user?.role, icon: ShieldAlert, color: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/20' },
        { label: 'System Uptime', value: health?.uptime ? `${Math.floor(health.uptime / 60)} mins` : '—', icon: Activity, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
        { label: 'API Status', value: health?.status === 'UP' ? 'Online' : 'Connecting', icon: Power, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
        { label: 'Security Protocols', value: 'Active', icon: CheckCircle, color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
    ];

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                    <h1 className="text-2xl font-bold text-white">
                        Welcome back, <span className="text-blue-400">{user?.name}</span>
                    </h1>
                    <p className="text-sm text-dark-textMuted mt-1">
                        Track: Medical and Health Care — {user?.role} Portal
                    </p>
                </div>
                <div className="flex items-center gap-2 bg-dark-card border border-dark-border px-3 py-1.5 rounded-lg text-xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span className="text-dark-textMuted">Round 1 — Active now</span>
                </div>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, i) => (
                    <div key={i} className={`bg-dark-card border ${stat.border} rounded-xl p-5 flex items-start gap-4 hover:border-blue-500/30 transition-colors`}>
                        <div className={`w-10 h-10 rounded-lg ${stat.bg} ${stat.color} flex items-center justify-center shrink-0`}>
                            <stat.icon size={20} />
                        </div>
                        <div>
                            <p className="text-lg font-bold text-white leading-tight">{stat.value}</p>
                            <p className="text-xs text-dark-textMuted mt-0.5">{stat.label}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Admin: User Management */}
            {user?.role === 'ADMIN' && (
                <div className="bg-dark-card border border-dark-border rounded-xl overflow-hidden">
                    <div className="px-5 py-4 border-b border-dark-border flex items-center gap-3">
                        <Users size={18} className="text-blue-400" />
                        <div>
                            <h2 className="text-sm font-bold text-white">User Management</h2>
                            <p className="text-xs text-dark-textMuted">Global platform user control</p>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm whitespace-nowrap">
                            <thead className="bg-dark-bg text-dark-textMuted text-xs font-semibold uppercase tracking-wider">
                                <tr>
                                    <th className="px-5 py-3">Name</th>
                                    <th className="px-5 py-3">Email</th>
                                    <th className="px-5 py-3">Role</th>
                                    <th className="px-5 py-3">Status</th>
                                    <th className="px-5 py-3 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-dark-border">
                                {adminUsers.map(u => (
                                    <tr key={u.id} className="hover:bg-white/[0.02] transition-colors">
                                        <td className="px-5 py-3.5 font-medium text-white">{u.name}</td>
                                        <td className="px-5 py-3.5 text-dark-textMuted">{u.email}</td>
                                        <td className="px-5 py-3.5">
                                            <span className="px-2 py-0.5 bg-blue-600/10 text-blue-400 rounded text-xs font-bold border border-blue-600/20">{u.role}</span>
                                        </td>
                                        <td className="px-5 py-3.5">
                                            <span className={`px-2 py-0.5 rounded text-xs font-bold ${u.status === 'ACTIVE' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                                                {u.status}
                                            </span>
                                        </td>
                                        <td className="px-5 py-3.5 text-right">
                                            <button
                                                onClick={() => toggleUserStatus(u.id, u.status)}
                                                disabled={u.id === user.id}
                                                className={`px-3 py-1 rounded-lg text-xs font-semibold disabled:opacity-30 transition-all ${u.status === 'ACTIVE' ? 'bg-rose-500/10 text-rose-400 hover:bg-rose-500/20' : 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'}`}
                                            >
                                                {u.status === 'ACTIVE' ? 'Suspend' : 'Activate'}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {adminUsers.length === 0 && (
                                    <tr>
                                        <td colSpan="5" className="px-5 py-8 text-center text-dark-textMuted text-sm">Loading users...</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {user?.role === 'ADMIN' && (
                <div>
                    <SecurityAlertsPanel />
                </div>
            )}
        </div>
    );
};

export default Dashboard;
