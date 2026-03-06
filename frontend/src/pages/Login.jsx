import React, { useState } from 'react';
import { Shield, Mail, Lock, Loader2, Eye, EyeOff } from 'lucide-react';
import { Link } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import api from '../services/api';
import toast from 'react-hot-toast';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const setLogin = useAuthStore((state) => state.setLogin);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrorMessage('');

        try {
            const { data } = await api.post('/auth/login', { email, password });
            const { user, accessToken, refreshToken } = data.data;
            setLogin(user, accessToken, refreshToken);
            toast.success('Login Successful');
        } catch (err) {
            const message = err.response?.data?.message || 'Login failed. Please try again.';
            setErrorMessage(message);
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-dark-bg p-4">
            <div className="w-full max-w-sm">

                {/* Brand */}
                <div className="flex flex-col items-center justify-center gap-3 mb-10 text-center">
                    <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center shadow-[0_0_30px_rgba(59,130,246,0.3)]">
                        <Shield size={28} className="text-white" />
                    </div>
                    <div>
                        <p className="font-bold text-white text-2xl leading-tight tracking-tight">MedAuth</p>
                        <p className="text-xs text-dark-textMuted mt-0.5">TetherX Hackathon</p>
                    </div>
                </div>

                {/* Card */}
                <div className="bg-dark-card border border-dark-border rounded-xl p-6 shadow-xl">
                    <h1 className="text-2xl font-bold text-white mb-1">Sign in</h1>
                    <p className="text-sm text-dark-textMuted mb-7">Enter your credentials to access the portal</p>

                    {errorMessage && (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg mb-5 text-sm">
                            {errorMessage}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-medium text-dark-textMuted block">Email Address</label>
                            <div className="relative">
                                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-textMuted" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="w-full bg-dark-bg border border-dark-border rounded-lg pl-9 pr-4 py-2.5 text-sm text-dark-text focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all placeholder:text-dark-textMuted/50"
                                    placeholder="you@example.com"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-medium text-dark-textMuted block">Password</label>
                            <div className="relative">
                                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-textMuted" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="w-full bg-dark-bg border border-dark-border rounded-lg pl-9 pr-10 py-2.5 text-sm text-dark-text focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all placeholder:text-dark-textMuted/50"
                                    placeholder="••••••••"
                                />
                                {password.length > 0 && (
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(prev => !prev)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-textMuted hover:text-blue-400 transition-colors"
                                        tabIndex={-1}
                                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                                    >
                                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                )}
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2.5 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm mt-2"
                        >
                            {loading ? <Loader2 size={16} className="animate-spin" /> : 'Sign in'}
                        </button>
                    </form>
                </div>

                <p className="mt-4 text-center text-sm text-dark-textMuted">
                    Don't have an account?{' '}
                    <Link to="/signup" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
                        Register
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
