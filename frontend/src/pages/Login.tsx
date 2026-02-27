import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Shield, ArrowRight, Trophy } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../store/AuthContext';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response: any = await api.post('/auth/login', { email, password });
            login(response.user, response.token);
            navigate('/dashboard');
        } catch (err: any) {
            setError(err.message || 'Authentication failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0a0f1d] p-6 relative overflow-hidden selection:bg-indigo-500/30">
            {/* Dynamic Background elements */}
            <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-indigo-600/10 rounded-full blur-[160px] animate-float" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-blue-600/5 rounded-full blur-[140px]" />

            <div className="w-full max-w-[480px] relative z-10 animate-in fade-in zoom-in-95 duration-1000">
                {/* Branding */}
                <div className="flex flex-col items-center mb-12">
                    <div className="w-20 h-20 bg-indigo-600 rounded-[2rem] flex items-center justify-center mb-6 shadow-2xl shadow-indigo-600/40 relative group cursor-pointer hover:scale-110 transition-transform duration-500">
                        <div className="absolute inset-0 bg-white/20 rounded-[2rem] animate-ping opacity-20 group-hover:opacity-100" />
                        <Trophy className="text-white w-10 h-10 relative z-10" />
                    </div>
                    <h1 className="text-5xl font-black text-white tracking-tighter text-center">
                        HSS <span className="text-indigo-500">Portal</span>
                    </h1>
                    <p className="text-slate-500 mt-3 font-bold uppercase tracking-[0.4em] text-[10px]">Enterprise Resource Management</p>
                </div>

                <Card variant="solid" className="!p-10 shadow-[0_40px_80px_-15px_rgba(0,0,0,0.7)] border-white/5 !rounded-[3rem] group" hover={false}>
                    <div className="mb-10">
                        <h2 className="text-2xl font-black text-white tracking-tight mb-2">System Authentication</h2>
                        <p className="text-slate-400 font-medium">Access your professional dashboard and assets.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        <Input
                            label="Operational Identity"
                            type="email"
                            placeholder="name@hss-enterprise.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            icon={<Mail />}
                            required
                            disabled={loading}
                        />

                        <div className="relative">
                            <Input
                                label="Security Protocol"
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                icon={<Lock />}
                                required
                                disabled={loading}
                            />
                            <button
                                type="button"
                                className="absolute right-4 bottom-4 text-[10px] font-black text-indigo-400/50 hover:text-indigo-400 uppercase tracking-widest transition-colors"
                            >
                                Recover
                            </button>
                        </div>

                        {error && (
                            <div className="p-5 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-sm font-bold text-rose-500 animate-in shake duration-500">
                                <div className="flex items-center gap-3">
                                    <Shield size={18} />
                                    {error}
                                </div>
                            </div>
                        )}

                        <Button
                            type="submit"
                            size="xl"
                            variant="primary"
                            className="w-full shadow-2xl shadow-indigo-600/30 group/btn"
                            isLoading={loading}
                        >
                            <span className="flex items-center gap-3">
                                Initialize Secure Entry
                                <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
                            </span>
                        </Button>
                    </form>

                    <div className="mt-12 flex items-center justify-between text-[11px] font-bold uppercase tracking-widest text-slate-600 pt-8 border-t border-white/5">
                        <span className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                            Encryption Active
                        </span>
                        <span className="hover:text-indigo-400 cursor-pointer transition-colors">v.4.0.2 Stable</span>
                    </div>
                </Card>
            </div>

            {/* Footer decoration */}
            <div className="absolute bottom-10 left-0 right-0 flex justify-center opacity-20">
                <p className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-500">
                    © 2026 Hussain Software Solutions Global
                </p>
            </div>
        </div>
    );
};

export default Login;
