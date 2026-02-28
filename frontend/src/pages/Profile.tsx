import React, { useState, useEffect } from 'react';
import { User as UserIcon, Mail, Phone, UserCircle, Save, Loader2, Shield, Settings, Key, Bell, CreditCard } from 'lucide-react';
import { useGetUserByIdQuery, useUpdateProfileMutation } from '../services/apiService';
import { useAuth } from '../store/AuthContext';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

const Profile = () => {
    const { user, login, token } = useAuth();
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        phone: '',
    });
    const [message, setMessage] = useState({ type: '', text: '' });

    const { data: userData, isLoading: fetching } = useGetUserByIdQuery(user?.id || '', {
        skip: !user?.id
    });
    const [updateProfile, { isLoading: loading }] = useUpdateProfileMutation();

    useEffect(() => {
        if (userData?.profile) {
            setFormData({
                firstName: userData.profile.firstName || '',
                lastName: userData.profile.lastName || '',
                phone: userData.profile.phone || '',
            });
        }
    }, [userData]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage({ type: '', text: '' });

        try {
            await updateProfile(formData).unwrap();

            // Update the local user object in context if needed
            if (user) {
                const updatedUser = { ...user, name: `${formData.firstName} ${formData.lastName}`.trim() || user.name };
                login(updatedUser, token!);
            }

            setMessage({ type: 'success', text: 'Profile modifications synchronized successfully.' });
        } catch (error: any) {
            console.error('Failed to update profile:', error);
            setMessage({ type: 'error', text: error.data?.message || 'Failed to sync modifications. Please re-validate entries.' });
        }
    };

    if (fetching) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
                <div className="w-16 h-16 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
                <span className="text-xs font-black uppercase tracking-[0.3em] text-indigo-400">Authenticating Registry...</span>
            </div>
        );
    }

    const settingsTabs = [
        { id: 'profile', label: 'Personal Registry', icon: <UserCircle size={18} /> },

    ];

    return (
        <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in duration-1000 pb-20">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                <div className="space-y-3">
                    <div className="flex items-center gap-3">
                        <div className="w-2 h-8 bg-indigo-500 rounded-full" />
                        <span className="text-indigo-400 text-sm font-bold uppercase tracking-[0.3em]">Account Management</span>
                    </div>
                    <h1 className="text-5xl font-black text-white tracking-tighter">Identity Settings</h1>
                    <p className="text-slate-400 text-lg font-medium max-w-xl">
                        Monitor and maintain your professional identity and operational preferences.
                    </p>
                </div>

                <div className="flex items-center gap-3 bg-white/5 p-2 rounded-2xl border border-white/5">
                    <div className="px-4 py-2 rounded-xl bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-widest">
                        Access Level: {user?.role}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
                {/* Navigation Sidebar */}
                <div className="lg:col-span-1 space-y-3">
                    {settingsTabs.map((tab) => (
                        <button
                            key={tab.id}
                            className={`w-full flex items-center justify-between px-6 py-4 rounded-[1.75rem] transition-all duration-300 group
                                ${tab.id === 'profile'
                                    ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/20'
                                    : 'text-slate-500 hover:text-white hover:bg-white/5'}
                            `}
                        >
                            <div className="flex items-center gap-3.5">
                                {tab.icon}
                                <span className="font-bold text-[15px] tracking-tight">{tab.label}</span>
                            </div>
                            <div className={`w-1.5 h-1.5 rounded-full transition-all ${tab.id === 'profile' ? 'bg-white scale-125' : 'bg-transparent group-hover:bg-slate-700'}`} />
                        </button>
                    ))}
                </div>

                {/* Main Settings Card */}
                <Card variant="solid" className="lg:col-span-3 !p-0 overflow-hidden shadow-2xl border-white/5 !rounded-[2.5rem]" hover={false}>
                    <div className="px-10 py-10 border-b border-white/5 bg-white/[0.01]">
                        <div className="flex flex-col md:flex-row items-center gap-8">
                            <div className="relative group">
                                <div className="absolute inset-0 bg-indigo-500 rounded-[2.5rem] blur-2xl opacity-20 group-hover:opacity-40 transition-opacity" />
                                <div className="relative w-32 h-32 rounded-[2.5rem] bg-gradient-to-br from-indigo-500/20 to-blue-500/10 flex items-center justify-center text-indigo-400 border-2 border-indigo-500/20 shadow-inner overflow-hidden">
                                    <UserCircle size={72} strokeWidth={1} />
                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-white">Modify</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex-1 text-center md:text-left space-y-1.5">
                                <h3 className="text-3xl font-black text-white tracking-tight">{user?.name}</h3>
                                <div className="flex flex-col md:flex-row items-center gap-4 text-slate-500 font-medium">
                                    <span className="flex items-center gap-2">
                                        <Mail size={16} className="text-indigo-400/50" />
                                        {user?.email}
                                    </span>
                                    <span className="hidden md:block w-1.5 h-1.5 rounded-full bg-slate-800" />
                                    <span className="flex items-center gap-2 capitalize">
                                        <Shield size={16} className="text-indigo-400/50" />
                                        {user?.role} Tier Account
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-10">
                        <form onSubmit={handleSubmit} className="space-y-10">
                            {message.text && (
                                <Card variant="glass" className={`!p-5 !rounded-2xl border-none ${message.type === 'success' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                                    <div className="flex items-center gap-3">
                                        {message.type === 'success' ? <Settings className="animate-spin" size={18} /> : <Shield size={18} />}
                                        <span className="text-sm font-bold tracking-tight">{message.text}</span>
                                    </div>
                                </Card>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                <Input
                                    label="Legal First Name"
                                    value={formData.firstName}
                                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                    placeholder="e.g. Alexander"
                                    icon={<UserIcon />}
                                />
                                <Input
                                    label="Legal Last Name"
                                    value={formData.lastName}
                                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                    placeholder="e.g. Sterling"
                                    icon={<UserIcon />}
                                />
                            </div>

                            <div className="max-w-md">
                                <Input
                                    label="Operational Contact Line"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    placeholder="+1 (555) 000-0000"
                                    icon={<Phone />}
                                />
                            </div>

                            <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
                                <p className="text-slate-500 text-sm font-medium italic">
                                    Last synchronized: {new Date().toLocaleDateString()}
                                </p>
                                <Button
                                    type="submit"
                                    size="lg"
                                    className="w-full md:w-auto px-12 !rounded-[1.75rem] shadow-xl shadow-indigo-600/30"
                                    isLoading={loading}
                                    icon={<Save size={20} />}
                                >
                                    Commit Modifications
                                </Button>
                            </div>
                        </form>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default Profile;
