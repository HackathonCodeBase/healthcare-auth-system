import React, { useState, useEffect, useRef } from 'react';
import {
    Shield,
    Mail,
    Lock,
    Loader2,
    ArrowRight,
    ArrowLeft,
    CheckCircle2,
    Eye,
    EyeOff,
    Key
} from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
    const [step, setStep] = useState('request'); // request, otp, reset, success
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [resetToken, setResetToken] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [timer, setTimer] = useState(300);

    const navigate = useNavigate();
    const otpRefs = [useRef(), useRef(), useRef(), useRef(), useRef(), useRef()];

    useEffect(() => {
        let interval = null;
        if (step === 'otp' && timer > 0) {
            interval = setInterval(() => setTimer(prev => prev - 1), 1000);
        }
        return () => clearInterval(interval);
    }, [step, timer]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    };

    const handleOtpChange = (index, value) => {
        if (!/^\d*$/.test(value)) return;
        const newOtp = [...otp];
        newOtp[index] = value.slice(-1);
        setOtp(newOtp);
        if (value && index < 5) otpRefs[index + 1].current.focus();
    };

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) otpRefs[index - 1].current.focus();
    };

    const handleRequestReset = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/auth/forgot-password', { email });
            toast.success('Reset code sent to your email.');
            setStep('otp');
            setTimer(300);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to request reset.');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        const otpString = otp.join('');
        if (otpString.length < 6) return;
        setLoading(true);
        try {
            const { data } = await api.post('/auth/verify-reset-otp', { email, otp: otpString });
            setResetToken(data.data.resetToken);
            setStep('reset');
            toast.success('Code verified. Set your new password.');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Invalid or expired code.');
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/auth/reset-password', {
                email,
                token: resetToken,
                newPassword
            });
            setStep('success');
            toast.success('Password reset successfully!');
            setTimeout(() => navigate('/login'), 3000);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to reset password.');
        } finally {
            setLoading(false);
        }
    };

    const inputClass = "w-full bg-dark-bg border border-dark-border rounded-lg pl-9 pr-4 py-2.5 text-sm text-dark-text focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all placeholder:text-dark-textMuted/50";

    return (
        <div className="min-h-screen flex items-center justify-center bg-dark-bg p-4">
            <div className="w-full max-w-sm sm:max-w-md">
                {/* Brand */}
                <div className="flex flex-col items-center justify-center gap-3 mb-10 text-center">
                    <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center shadow-[0_0_30px_rgba(59,130,246,0.3)]">
                        <Shield size={28} className="text-white" />
                    </div>
                    <div>
                        <p className="font-bold text-white text-2xl leading-tight tracking-tight">MedAuth</p>
                        <p className="text-xs text-dark-textMuted mt-0.5">Security Recovery</p>
                    </div>
                </div>

                {/* Card */}
                <div className="bg-dark-card border border-dark-border rounded-xl p-6 shadow-xl">

                    {step === 'request' && (
                        <div className="animate-fade-in">
                            <h1 className="text-lg font-bold text-white mb-1">Reset Password</h1>
                            <p className="text-sm text-dark-textMuted mb-6">Enter your email to receive a recovery code</p>

                            <form onSubmit={handleRequestReset} className="space-y-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-medium text-dark-textMuted block">Email Address</label>
                                    <div className="relative">
                                        <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-textMuted" />
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                            className={inputClass}
                                            placeholder="you@example.com"
                                        />
                                    </div>
                                </div>
                                <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2.5 rounded-lg transition-all flex items-center justify-center gap-2 text-sm mt-2">
                                    {loading ? <Loader2 size={16} className="animate-spin" /> : (<>Send Code <ArrowRight size={15} /></>)}
                                </button>
                                <Link to="/login" className="flex items-center justify-center gap-2 text-xs text-dark-textMuted hover:text-white transition-colors mt-4">
                                    <ArrowLeft size={14} /> Back to Sign in
                                </Link>
                            </form>
                        </div>
                    )}

                    {step === 'otp' && (
                        <div className="space-y-5 animate-fade-in">
                            <h1 className="text-lg font-bold text-white mb-1">Verify Recovery Code</h1>
                            <p className="text-sm text-dark-textMuted mb-4">A 6-digit code was sent to <span className="text-white font-medium">{email}</span></p>

                            <div className="flex justify-between gap-2">
                                {otp.map((digit, idx) => (
                                    <input
                                        key={idx}
                                        ref={otpRefs[idx]}
                                        type="text"
                                        maxLength={1}
                                        value={digit}
                                        onChange={(e) => handleOtpChange(idx, e.target.value)}
                                        onKeyDown={(e) => handleKeyDown(idx, e)}
                                        className="flex-1 min-w-0 h-12 bg-dark-bg border-2 border-dark-border rounded-lg text-center text-lg font-bold text-blue-400 focus:border-blue-500 focus:outline-none transition-all"
                                    />
                                ))}
                            </div>

                            <div className="flex items-center justify-between text-xs">
                                <span className={`font-mono font-bold ${timer === 0 ? 'text-red-400' : 'text-dark-textMuted'}`}>
                                    {timer === 0 ? 'Code expired' : `Expires in ${formatTime(timer)}`}
                                </span>
                                <button type="button" onClick={() => setStep('request')} className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
                                    Change email
                                </button>
                            </div>

                            <button
                                onClick={handleVerifyOtp}
                                disabled={loading || timer === 0 || otp.some(d => !d)}
                                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2.5 rounded-lg transition-all flex items-center justify-center gap-2 text-sm"
                            >
                                {loading ? <Loader2 size={16} className="animate-spin" /> : 'Verify Code'}
                            </button>
                        </div>
                    )}

                    {step === 'reset' && (
                        <div className="animate-fade-in">
                            <h1 className="text-lg font-bold text-white mb-1">New Password</h1>
                            <p className="text-sm text-dark-textMuted mb-6">Create a secure password for your account</p>

                            <form onSubmit={handleResetPassword} className="space-y-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-medium text-dark-textMuted block">New Password</label>
                                    <div className="relative">
                                        <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-textMuted" />
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            required
                                            className={`${inputClass} pr-10`}
                                            placeholder="Min 8 chars, 1 uppercase, 1 number"
                                        />
                                        <button type="button" onClick={() => setShowPassword(p => !p)} className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-textMuted hover:text-blue-400" tabIndex={-1}>
                                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                        </button>
                                    </div>
                                </div>
                                <button type="submit" disabled={loading} className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-2.5 rounded-lg transition-all flex items-center justify-center gap-2 text-sm mt-2">
                                    {loading ? <Loader2 size={16} className="animate-spin" /> : (<>Update Password <Key size={15} /></>)}
                                </button>
                            </form>
                        </div>
                    )}

                    {step === 'success' && (
                        <div className="text-center py-8 space-y-4 animate-scale-in">
                            <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto border-2 border-emerald-500">
                                <CheckCircle2 size={36} />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-white">Password Updated</h2>
                                <p className="text-sm text-dark-textMuted mt-1">Your account is now secure. Redirecting to login...</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
