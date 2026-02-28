import React, { useState, useEffect } from 'react';
import {
    Users as UsersIcon,
    Mail,
    Search,
    UserPlus,
    Loader2,
    MoreHorizontal,
    Phone,
} from 'lucide-react';
import { useInView } from 'react-intersection-observer';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import ConfirmModal from '../components/ui/ConfirmModal';
import Modal from '../components/ui/Modal';
import { useGetUsersQuery, useCreateUserMutation } from '../services/apiService';
import type { UserRole } from '../types';

const Users = () => {
    const [search, setSearch] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [activeRole, setActiveRole] = useState<string | null>(null);
    const [confirmModal, setConfirmModal] = useState<{
        isOpen: boolean;
        title: string;
        message: string;
        onConfirm: () => void;
        variant?: 'danger' | 'warning' | 'info' | 'success';
        isAlert?: boolean;
    }>({
        isOpen: false,
        title: '',
        message: '',
        onConfirm: () => { },
    });
    const [page, setPage] = useState(1);
    const [limit] = useState(9);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        role: 'employee' as UserRole,
        firstName: '',
        lastName: '',
        phone: '',
    });

    const { data, isLoading, isFetching } = useGetUsersQuery({
        page,
        limit,
        role: activeRole || undefined
    });
    const [createUser, { isLoading: creating }] = useCreateUserMutation();

    const users = data?.users || [];
    const totalUsers = data?.total || 0;
    const hasMore = data ? users.length < data.total : true;

    const { ref: sentinelRef, inView } = useInView({
        threshold: 0.1,
        rootMargin: '200px',
    });

    useEffect(() => {
        setPage(1);
    }, [activeRole]);

    useEffect(() => {
        if (inView && hasMore && !isFetching && users.length > 0) {
            setPage((prev: number) => (prev || 1) + 1);
        }
    }, [inView, hasMore, isFetching, users.length]);

    const handleCreateUser = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await createUser(formData).unwrap();
            setShowModal(false);
            setFormData({ email: '', password: '', role: 'employee', firstName: '', lastName: '', phone: '' });
            setPage(1);
        } catch (error) {
            console.error('Failed to create user:', error);
            setConfirmModal({
                isOpen: true,
                title: 'Creation Failed',
                message: 'Failed to create user. Please check if the email already exists.',
                onConfirm: () => { },
                variant: 'danger',
                isAlert: true
            });
        }
    };

    const roles: { label: string; value: UserRole | null; color: string }[] = [
        { label: 'All Members', value: null, color: 'indigo' },
        { label: 'Admin', value: 'admin', color: 'rose' },
        { label: 'Staff', value: 'employee', color: 'emerald' },
        { label: 'Clients', value: 'client', color: 'amber' },
    ];

    const filteredUsers = users.filter(u =>
        u.email.toLowerCase().includes(search.toLowerCase()) ||
        (`${u.profile?.firstName || ''} ${u.profile?.lastName || ''}`).toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-10 animate-in fade-in duration-700">
            {/* Header Section */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
                <div className="space-y-3">
                    <div className="flex items-center gap-3">
                        <div className="w-2 h-8 bg-emerald-500 rounded-full" />
                        <span className="text-emerald-400 text-sm font-bold uppercase tracking-[0.3em]">Member Directory</span>
                    </div>
                    <h1 className="text-5xl font-black text-white tracking-tighter">System Users</h1>
                    <p className="text-slate-400 text-lg font-medium max-w-xl">
                        Manage organizational access, roles, and professional profiles.
                    </p>
                </div>

                <div className="flex items-center gap-4">
                    <Button
                        variant="primary"
                        size="lg"
                        className="shadow-emerald-500/20"
                        icon={<UserPlus size={20} />}
                        onClick={() => setShowModal(true)}
                    >
                        Onboard User
                    </Button>
                </div>
            </div>

            {/* Filters Section */}
            <Card variant="glass" className="!p-4">
                <div className="flex flex-col md:flex-row items-center gap-6">
                    <div className="flex-1 w-full">
                        <Input
                            placeholder="Search by name, email or role..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            icon={<Search />}
                            className="bg-black/20 border-white/5"
                        />
                    </div>
                    <div className="flex items-center gap-2 p-1.5 bg-black/20 rounded-[1.5rem] border border-white/5 overflow-x-auto no-scrollbar">
                        {roles.map((role) => (
                            <button
                                key={role.label}
                                onClick={() => setActiveRole(role.value)}
                                className={`
                                    px-5 py-2.5 rounded-2xl text-xs font-bold uppercase tracking-widest transition-all duration-300 whitespace-nowrap
                                    ${activeRole === role.value
                                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20 scale-105'
                                        : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'}
                                `}
                            >
                                {role.label}
                            </button>
                        ))}
                    </div>
                </div>
            </Card>

            {/* Results Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-20">
                {isLoading ? (
                    Array(6).fill(0).map((_, i) => (
                        <div key={i} className="h-64 rounded-[2.5rem] bg-white/5 animate-pulse border border-white/5" />
                    ))
                ) : filteredUsers.length > 0 ? (
                    filteredUsers.map((u) => (
                        <Card key={u.id} className="group overflow-visible" variant="solid">
                            <div className="absolute top-0 right-0 p-4">
                                <button className="p-2 text-slate-500 hover:text-white hover:bg-white/5 rounded-xl transition-colors">
                                    <MoreHorizontal size={20} />
                                </button>
                            </div>

                            <div className="flex flex-col items-center text-center">
                                <div className="relative mb-6">
                                    <div className="w-24 h-24 rounded-[2rem] bg-gradient-to-br from-indigo-500/10 to-blue-500/10 border border-indigo-500/20 flex items-center justify-center text-3xl font-black text-indigo-400 shadow-inner group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                                        {u.profile?.firstName?.[0] || u.email[0].toUpperCase()}
                                    </div>
                                    <div className={`absolute -bottom-1 -right-1 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border shadow-xl
                                        ${u.role === 'admin' ? 'bg-rose-500 text-white border-rose-400' : u.role === 'employee' ? 'bg-emerald-500 text-white border-emerald-400' : 'bg-amber-500 text-white border-amber-400'}
                                    `}>
                                        {u.role}
                                    </div>
                                </div>

                                <h3 className="text-xl font-bold text-white tracking-tight leading-tight">
                                    {u.profile ? `${u.profile.firstName} ${u.profile.lastName}` : 'System Member'}
                                </h3>
                                <p className="text-slate-500 text-sm font-medium mt-1 mb-6 flex items-center gap-1.5 justify-center">
                                    <Mail size={14} className="opacity-50" />
                                    {u.email}
                                </p>

                                <div className="w-full grid grid-cols-2 gap-3 pt-6 border-t border-white/5">
                                    <div className="flex flex-col items-center px-4 py-3 rounded-2xl bg-white/5 border border-white/5">
                                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Impact</span>
                                        <span className="text-sm font-bold text-white">High</span>
                                    </div>
                                    <div className="flex flex-col items-center px-4 py-3 rounded-2xl bg-white/5 border border-white/5">
                                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Status</span>
                                        <div className="flex items-center gap-1.5">
                                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                            <span className="text-sm font-bold text-white">Online</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="w-full mt-4 flex items-center gap-4 text-slate-500 px-2 group/info transition-all">
                                    <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider">
                                        <Phone size={14} />
                                        {u.profile?.phone || 'No Contact'}
                                    </div>
                                </div>
                            </div>
                        </Card>
                    ))
                ) : (
                    <div className="col-span-full py-20 flex flex-col items-center justify-center text-slate-500">
                        <UsersIcon size={64} className="opacity-10 mb-4" />
                        <h3 className="text-xl font-bold text-white mb-2">No matching members</h3>
                        <p className="text-slate-400">Try adjusting your filters or search query.</p>
                    </div>
                )}
            </div>

            {/* Sentinel for Infinite Scroll */}
            <div ref={sentinelRef} className="col-span-full py-10 flex flex-col items-center justify-center gap-4">
                {isFetching && hasMore && (
                    <div className="flex flex-col items-center gap-3 text-indigo-400">
                        <Loader2 className="w-8 h-8 animate-spin" />
                        <span className="text-xs font-bold uppercase tracking-[0.2em]">Synchronizing...</span>
                    </div>
                )}
                {!hasMore && totalUsers > 0 && (
                    <div className="px-6 py-3 rounded-full bg-white/5 border border-white/5 text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">
                        Endpoint Discovered • Total {totalUsers} Member{totalUsers !== 1 ? 's' : ''}
                    </div>
                )}
            </div>

            {/* Modal & Overlay */}
            <Modal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                title="Member Onboarding"
                maxWidth="lg"
            >
                <form onSubmit={handleCreateUser} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input
                            label="First Name"
                            value={formData.firstName}
                            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                            placeholder="John"
                            required
                        />
                        <Input
                            label="Last Name"
                            value={formData.lastName}
                            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                            placeholder="Doe"
                            required
                        />
                    </div>
                    <Input
                        label="Email Address"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="john@company.com"
                        required
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input
                            label="Initial Password"
                            type="password"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            placeholder="••••••••"
                            required
                        />
                        <Input
                            label="Phone Number"
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            placeholder="+1 234 567 8900"
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[13px] font-bold text-slate-500 uppercase tracking-wider ml-1">Member Role</label>
                        <div className="grid grid-cols-3 gap-3 p-1.5 bg-black/20 rounded-2xl border border-white/5">
                            {['admin', 'employee', 'client'].map((r) => (
                                <button
                                    key={r}
                                    type="button"
                                    onClick={() => setFormData({ ...formData, role: r as UserRole })}
                                    className={`
                                        py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all
                                        ${formData.role === r
                                            ? 'bg-indigo-600 text-white shadow-lg'
                                            : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'}
                                    `}
                                >
                                    {r}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex gap-4 pt-4">
                        <Button type="button" variant="secondary" className="flex-1" onClick={() => setShowModal(false)}>
                            clear
                        </Button>
                        <Button type="submit" className="flex-1 shadow-indigo-600/30" isLoading={creating}>
                            create
                        </Button>
                    </div>
                </form>
            </Modal>

            <ConfirmModal
                isOpen={confirmModal.isOpen}
                title={confirmModal.title}
                message={confirmModal.message}
                variant={confirmModal.variant}
                isAlert={confirmModal.isAlert}
                onClose={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
                onConfirm={confirmModal.onConfirm}
            />
        </div>
    );
};

export default Users;
