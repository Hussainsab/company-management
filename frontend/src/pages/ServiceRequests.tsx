import React, { useState, useEffect } from 'react';
import {
    Plus,
    Clock,
    CheckCircle2,
    AlertCircle,
    Tag,
    Search,
    Building2,
    Briefcase,
    Loader2,
    MessageSquare,
    User,
    Users,
    ArrowRight,
    ChevronRight,
    ClipboardList
} from 'lucide-react';
import { useInView } from 'react-intersection-observer';
import Button from '../components/ui/Button.tsx';
import Card from '../components/ui/Card.tsx';
import { useAuth } from '../store/AuthContext.tsx';
import {
    useGetRequestsQuery,
    useCreateRequestMutation,
    useUpdateRequestStatusMutation,
    useGetProjectsQuery,
    useGetCompaniesQuery
} from '../services/apiService.ts';
import Modal from '../components/ui/Modal.tsx';
import Input from '../components/ui/Input.tsx';

const ServiceRequests = () => {
    const { user } = useAuth();
    const [showModal, setShowModal] = useState(false);
    const [newRequest, setNewRequest] = useState({ projectName: '', employeeCount: 1, note: '', projectId: '', clientId: '' });

    const [page, setPage] = useState(1);
    const [limit] = useState(9);
    const [statusFilter, setStatusFilter] = useState<string | null>(null);

    const { data: requestsData, isLoading: requestsLoading, isFetching: requestsFetching } = useGetRequestsQuery({
        page,
        limit,
        status: statusFilter || undefined
    });
    const { data: projectsData } = useGetProjectsQuery({ page: 1, limit: 100 });
    const { data: companiesData } = useGetCompaniesQuery({ page: 1, limit: 100 }, { skip: user?.role !== 'admin' });

    const [createRequest] = useCreateRequestMutation();
    const [updateStatus] = useUpdateRequestStatusMutation();

    const requests = requestsData?.requests || [];
    const projects = projectsData?.projects || [];
    const companies = companiesData?.companies || [];
    const hasMore = requestsData ? requests.length < requestsData.total : true;

    const counts = {
        pending: requestsData?.totalPending || 0,
        approved: requestsData?.totalApproved || 0,
        rejected: requestsData?.totalRejected || 0
    };

    const { ref: sentinelRef, inView } = useInView({
        threshold: 0.1,
        rootMargin: '200px',
    });

    useEffect(() => {
        setPage(1);
    }, [statusFilter]);

    useEffect(() => {
        if (inView && hasMore && !requestsFetching && requests.length > 0) {
            setPage(prev => prev + 1);
        }
    }, [inView, hasMore, requestsFetching, requests.length]);

    const handleCreateRequest = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const payload = {
                requestedProjectName: newRequest.projectName,
                requestedEmployeeCount: newRequest.employeeCount,
                note: newRequest.note,
                projectId: newRequest.projectId || undefined,
                clientId: user?.role === 'admin' ? (newRequest.clientId || undefined) : (user?.clientId || undefined)
            };
            await createRequest(payload).unwrap();
            setShowModal(false);
            setNewRequest({ projectName: '', employeeCount: 1, note: '', projectId: '', clientId: '' });
            setPage(1);
        } catch (error) {
            console.error('Failed to create request:', error);
        }
    };

    const handleApprove = async (id: string) => {
        try {
            await updateStatus({ id, status: 'approve' }).unwrap();
        } catch (error) {
            console.error('Failed to approve request:', error);
        }
    };

    const handleReject = async (id: string) => {
        try {
            await updateStatus({ id, status: 'reject' }).unwrap();
        } catch (error) {
            console.error('Failed to reject request:', error);
        }
    };

    const stats = [
        { label: 'Pending Inquiry', count: counts.pending, icon: <AlertCircle size={24} />, color: 'amber', status: 'pending' },
        { label: 'Active Pipeline', count: counts.approved, icon: <Clock size={24} />, color: 'indigo', status: 'approved' },
        { label: 'Resolved Cases', count: counts.rejected, icon: <CheckCircle2 size={24} />, color: 'emerald', status: 'rejected' },
    ];

    return (
        <div className="space-y-12 animate-in fade-in duration-1000 pb-20">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
                <div className="space-y-3">
                    <div className="flex items-center gap-3">
                        <div className="w-2 h-8 bg-amber-500 rounded-full" />
                        <span className="text-amber-400 text-sm font-bold uppercase tracking-[0.3em]">Services Desk</span>
                    </div>
                    <h1 className="text-5xl font-black text-white tracking-tighter">Services</h1>
                    <p className="text-slate-400 text-lg font-medium max-w-xl">
                        Monitor and manage service inquiries, resource allocations, and institutional requests.
                    </p>
                </div>

                <Button
                    variant="primary"
                    size="lg"
                    className="shadow-amber-500/20"
                    icon={<Plus size={22} />}
                    onClick={() => setShowModal(true)}
                >
                    Request Service
                </Button>
            </div>

            {/* Top Stats Bar */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {stats.map((stat) => (
                    <Card
                        key={stat.label}
                        className={`group relative overflow-hidden transition-all duration-500 ${statusFilter === stat.status ? 'border-amber-500/50 shadow-[0_20px_40px_-15px_rgba(245,158,11,0.2)]' : 'hover:border-white/10'}`}
                        onClick={() => setStatusFilter(statusFilter === stat.status ? null : stat.status)}
                        hover={true}
                    >
                        <div className={`absolute -right-8 -top-8 w-32 h-32 bg-${stat.color}-500/5 rounded-full blur-3xl transition-transform duration-500 group-hover:scale-150`} />

                        <div className="flex items-center gap-6 relative z-10">
                            <div className={`p-4 rounded-3xl bg-${stat.color}-500/10 text-${stat.color}-400 border border-${stat.color}-500/20 shadow-inner group-hover:scale-110 transition-transform`}>
                                {stat.icon}
                            </div>
                            <div>
                                <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mb-1">{stat.label}</p>
                                <h3 className="text-3xl font-black text-white">{stat.count}</h3>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Results Section */}
            <div className="space-y-6">
                {requestsLoading && requests.length === 0 ? (
                    <div className="grid grid-cols-1 gap-6">
                        {Array(3).fill(0).map((_, i) => (
                            <div key={i} className="h-40 rounded-[2.5rem] bg-white/5 animate-pulse border border-white/5" />
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6">
                        {requests.length > 0 ? (
                            requests.map((request) => (
                                <Card
                                    key={request.id}
                                    className="group !p-6"
                                    variant="solid"
                                    hover={true}
                                >
                                    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
                                        <div className="flex items-start gap-6 flex-1 min-w-0">
                                            <div className="w-16 h-16 rounded-[1.5rem] bg-[#0a0f1d] border border-white/5 flex items-center justify-center text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500 shrink-0">
                                                <Briefcase size={28} />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-3 mb-2 flex-wrap">
                                                    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${request.status === 'pending' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' : request.status === 'approved' ? 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'}`}>
                                                        {request.status.toUpperCase()}
                                                    </span>
                                                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                                                        <Clock size={12} className="opacity-50" />
                                                        Received {new Date(request.createdAt).toLocaleDateString()}
                                                    </span>
                                                </div>
                                                <h3 className="text-2xl font-black text-white tracking-tight leading-none group-hover:text-amber-400 transition-colors truncate">
                                                    {request.requestedProjectName}
                                                </h3>
                                                <div className="flex items-center gap-4 mt-3 flex-wrap">
                                                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/5">
                                                        <Building2 size={14} className="text-slate-500" />
                                                        <span className="text-xs font-bold text-slate-400 truncate max-w-[150px]">{request.client?.name || 'External Entity'}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/5">
                                                        <Users size={14} className="text-slate-500" />
                                                        <span className="text-xs font-bold text-slate-400">{request.requestedEmployeeCount} Professional{request.requestedEmployeeCount !== 1 ? 's' : ''}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4 shrink-0">
                                            {request.status === 'pending' && user?.role === 'admin' ? (
                                                <div className="flex gap-3">
                                                    <Button
                                                        variant="secondary"
                                                        size="sm"
                                                        className="!rounded-2xl border-rose-500/20 text-rose-400 hover:bg-rose-500/10"
                                                        onClick={() => handleReject(request.id)}
                                                    >
                                                        Reject
                                                    </Button>
                                                    <Button
                                                        variant="primary"
                                                        size="sm"
                                                        className="!rounded-2xl"
                                                        onClick={() => handleApprove(request.id)}
                                                    >
                                                        Approve
                                                    </Button>
                                                </div>
                                            ) : (
                                                <div className="px-6 py-3 rounded-2xl bg-white/5 border border-white/5">
                                                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Verified Registry</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {request.note && (
                                        <div className="mt-6 p-4 rounded-2xl bg-black/20 border border-white/5 group-hover:bg-black/30 transition-colors">
                                            <p className="text-slate-400 text-sm font-medium leading-relaxed italic">
                                                "{request.note}"
                                            </p>
                                        </div>
                                    )}
                                </Card>
                            ))
                        ) : (
                            <div className="flex flex-col items-center justify-center py-20 text-slate-500 border-2 border-dashed border-white/5 rounded-[3rem]">
                                <MessageSquare size={64} className="opacity-10 mb-6" />
                                <h3 className="text-2xl font-black text-white mb-2">Service desk clear</h3>
                                <p className="text-slate-400 font-medium">No active inquiries match your current filters.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Sentinel */}
            <div ref={sentinelRef} className="py-10 flex flex-col items-center justify-center">
                {requestsFetching && hasMore && (
                    <div className="flex flex-col items-center gap-3 text-amber-400">
                        <Loader2 className="w-8 h-8 animate-spin" />
                        <span className="text-xs font-black uppercase tracking-[0.2em]">Updating Operational Log...</span>
                    </div>
                )}
            </div>

            {/* Modal */}
            <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Request New Service" maxWidth="2xl">
                <form onSubmit={handleCreateRequest} className="space-y-8 pt-4">
                    <Input
                        label="Project Name"
                        required
                        value={newRequest.projectName}
                        onChange={(e) => setNewRequest({ ...newRequest, projectName: e.target.value })}
                        placeholder="Apollo Growth Framework"
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <Input
                            label="Resource Requirement (Staff Count)"
                            type="number"
                            min="1"
                            required
                            value={newRequest.employeeCount}
                            onChange={(e) => setNewRequest({ ...newRequest, employeeCount: parseInt(e.target.value) })}
                        />
                    </div>

                    {user?.role === 'admin' && (
                        <div className="space-y-2">
                            <label className="text-[13px] font-bold text-slate-500 uppercase tracking-wider ml-1">Institutional Client</label>
                            <select
                                required
                                className="w-full bg-white/5 border border-white/5 rounded-[2rem] px-6 py-4 text-white focus:outline-none focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500/50 transition-all font-medium"
                                value={newRequest.clientId}
                                onChange={(e) => setNewRequest({ ...newRequest, clientId: e.target.value })}
                            >
                                <option value="" className="bg-[#131c31]">Select Account Holder</option>
                                {companies.map(c => (
                                    <option key={c.id} value={c.clientUserId} className="bg-[#131c31]">{c.name}</option>
                                ))}
                            </select>
                        </div>
                    )}

                    <div className="space-y-2">
                        <label className="text-[13px] font-bold text-slate-500 uppercase tracking-wider ml-1">Strategic Note</label>
                        <textarea
                            className="w-full bg-white/5 border border-white/5 rounded-[1.5rem] px-6 py-4 text-white placeholder:text-slate-600 focus:outline-none focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500/50 transition-all font-medium h-32 resize-none"
                            value={newRequest.note}
                            onChange={(e) => setNewRequest({ ...newRequest, note: e.target.value })}
                            placeholder="Provide operational context for this resource request..."
                        />
                    </div>

                    <div className="flex gap-6 pt-6">
                        <Button type="button" variant="secondary" className="flex-1 !rounded-[2rem]" size="lg" onClick={() => setShowModal(false)}>
                            Discard
                        </Button>
                        <Button type="submit" className="flex-1 !rounded-[2rem] shadow-amber-600/30" size="lg">
                            Submit Request
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default ServiceRequests;
