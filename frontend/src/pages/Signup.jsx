import React, { useState, useEffect, useRef } from 'react';
import {
    Shield,
    Mail,
    Lock,
    User,
    Briefcase,
    Loader2,
    ArrowRight,
    RefreshCw,
    PencilLine,
    CheckCircle2,
    Eye,
    EyeOff
} from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';

const Signup = () => {
    const [step, setStep] = useState('register');
    const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'PATIENT' });
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [timer, setTimer] = useState(300);
    const [loading, setLoading] = useState(false);
    const [resending, setResending] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [canResendAction, setCanResendAction] = useState(true);
    const [showPassword, setShowPassword] = useState(false);

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

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

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

    const handleChangeEmail = () => {
        setStep('register');
        setOtp(['', '', '', '', '', '']);
        setTimer(300);
        setErrorMessage('');
    };

    const handleRegisterSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrorMessage('');
        try {
            await api.post('/auth/register', formData);
            toast.success('Registration successful. Verify your email.');
            setStep('otp');
            setTimer(300);
        } catch (err) {
            const message = err.response?.data?.message || 'Registration failed. Please try again.';
            setErrorMessage(message);
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    const handleResendOtp = async () => {
        if (!canResendAction) return;
        setResending(true);
        setErrorMessage('');
        try {
            await api.post('/auth/resend-otp', { email: formData.email });
            toast.success('New code sent successfully.');
            setTimer(300);
            setCanResendAction(false);
            setTimeout(() => setCanResendAction(true), 30000);
        } catch (err) {
            const message = err.response?.data?.message || 'Failed to resend code.';
            setErrorMessage(message);
            toast.error(message);
        } finally {
            setResending(false);
        }
    };

    const handleVerifyOtp = async (e) => {
        if (e) e.preventDefault();
        const otpString = otp.join('');
        if (otpString.length < 6) { setErrorMessage('Please enter the complete 6-digit code.'); return; }
        setLoading(true);
        setErrorMessage('');
        try {
            await api.post('/auth/verify-otp', { email: formData.email, otp: otpString });
            setStep('verified');
            toast.success('Email verified successfully!');
            setTimeout(() => navigate('/login'), 2000);
        } catch (err) {
            const message = err.response?.data?.message || 'Invalid or expired OTP.';
            setErrorMessage(message);
            toast.error(message);
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
                        <p className="text-xs text-dark-textMuted mt-0.5">TetherX Hackathon</p>
                    </div>
                </div>

                {/* Card */}
                <div className="bg-dark-card border border-dark-border rounded-xl p-6 shadow-xl">

                    {step === 'register' && (
                        <>
                            <h1 className="text-lg font-bold text-white mb-1">Create account</h1>
                            <p className="text-sm text-dark-textMuted mb-6">Register to access the healthcare portal</p>
                        </>
                    )}
                    {step === 'otp' && (
                        <>
                            <h1 className="text-lg font-bold text-white mb-1">Verify email</h1>
                            <p className="text-sm text-dark-textMuted mb-6">Enter the 6-digit code sent to your email</p>
                        </>
                    )}
                    {step === 'verified' && (
                        <div className="text-center py-8 space-y-4 animate-scale-in">
                            <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto border-2 border-emerald-500">
                                <CheckCircle2 size={36} />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-white">Verified!</h2>
                                <p className="text-sm text-dark-textMuted mt-1">Redirecting to login...</p>
                            </div>
                        </div>
                    )}

                    {errorMessage && (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg mb-5 text-sm animate-shake">
                            {errorMessage}
                        </div>
                    )}

                    {/* STEP 1: REGISTER */}
                    {step === 'register' && (
                        <form onSubmit={handleRegisterSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-medium text-dark-textMuted block">Full Name</label>
                                    <div className="relative">
                                        <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-textMuted" />
                                        <input type="text" name="name" value={formData.name} onChange={handleChange} required className={inputClass} placeholder="Your full name" />
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-medium text-dark-textMuted block">Role</label>
                                    <div className="relative">
                                        <Briefcase size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-textMuted" />
                                        <select name="role" value={formData.role} onChange={handleChange} className={`${inputClass} appearance-none cursor-pointer`}>
                                            <option value="PATIENT">PATIENT</option>
                                            <option value="DOCTOR">DOCTOR</option>
                                            <option value="NURSE">NURSE</option>
                                            <option value="ADMIN">ADMIN</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-medium text-dark-textMuted block">Email Address</label>
                                <div className="relative">
                                    <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-textMuted" />
                                    <input type="email" name="email" value={formData.email} onChange={handleChange} required className={inputClass} placeholder="you@example.com" />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-medium text-dark-textMuted block">Password</label>
                                <div className="relative">
                                    <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-textMuted" />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                        className={`${inputClass} pr-10`}
                                        placeholder="Create a strong password"
                                    />
                                    {formData.password.length > 0 && (
                                        <button type="button" onClick={() => setShowPassword(p => !p)} className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-textMuted hover:text-blue-400 transition-colors" tabIndex={-1}>
                                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                        </button>
                                    )}
                                </div>
                            </div>

                            <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2.5 rounded-lg transition-all disabled:opacity-50 disabled:cursor-wait flex items-center justify-center gap-2 text-sm mt-2">
                                {loading ? <Loader2 size={16} className="animate-spin" /> : (<>Continue <ArrowRight size={15} /></>)}
                            </button>
                        </form>
                    )}

                    {/* STEP 2: OTP */}
                    {step === 'otp' && (
                        <div className="space-y-5 animate-fade-in">
                            <div className="flex justify-between items-center bg-dark-bg px-4 py-3 rounded-lg border border-dark-border">
                                <div>
                                    <p className="text-[10px] text-dark-textMuted uppercase tracking-wider mb-0.5">Sending to</p>
                                    <p className="text-sm font-medium text-white">{formData.email}</p>
                                </div>
                                <button onClick={handleChangeEmail} className="p-2 rounded-lg bg-blue-600/10 text-blue-400 hover:bg-blue-600/20 transition-all" title="Change Email">
                                    <PencilLine size={15} />
                                </button>
                            </div>

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
                                <button onClick={handleResendOtp} disabled={!canResendAction || resending} className="text-blue-400 hover:text-blue-300 font-medium disabled:opacity-30 disabled:cursor-wait flex items-center gap-1.5 transition-colors">
                                    <RefreshCw size={13} className={resending ? 'animate-spin' : ''} />
                                    {resending ? 'Sending...' : 'Resend code'}
                                </button>
                            </div>

                            <button
                                onClick={handleVerifyOtp}
                                disabled={loading || timer === 0 || otp.some(d => !d)}
                                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2.5 rounded-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
                            >
                                {loading ? <Loader2 size={16} className="animate-spin" /> : 'Verify & Continue'}
                            </button>
                        </div>
                    )}
                </div>

                {step !== 'verified' && (
                    <p className="mt-4 text-center text-sm text-dark-textMuted">
                        Already have an account?{' '}
                        <Link to="/login" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
                            Sign in
                        </Link>
                    </p>
                )}
            </div>
        </div>
    );
};

export default Signup;
