import React, { useState, useEffect } from 'react';
import {
    Building2,
    Plus,
    Mail,
    Globe,
    Search,
    Loader2,
    MoreVertical,
    MapPin,
    Briefcase,
    UserCircle2
} from 'lucide-react';
import { useInView } from 'react-intersection-observer';
// import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Modal from '../components/ui/Modal';
import { useGetCompaniesQuery, useCreateCompanyMutation, useGetUsersQuery } from '../services/apiService';
import Card from '../components/ui/Card';

const Companies = () => {
    const [search, setSearch] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [page, setPage] = useState(1);
    const [limit] = useState(9);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        website: '',
        clientUserId: '',
    });

    const { data: companiesData, isLoading: companiesLoading, isFetching: companiesFetching } = useGetCompaniesQuery({
        page,
        limit
    });
    const { data: clientsData } = useGetUsersQuery({ page: 1, limit: 100, role: 'client' });
    const [createCompany, { isLoading: creating }] = useCreateCompanyMutation();

    const companies = companiesData?.companies || [];
    const clients = clientsData?.users || [];
    const hasMore = companiesData ? companies.length < companiesData.total : true;

    const { ref: sentinelRef, inView } = useInView({
        threshold: 0.1,
        rootMargin: '200px',
    });

    useEffect(() => {
        if (inView && hasMore && !companiesFetching && companies.length > 0) {
            setPage(prev => prev + 1);
        }
    }, [inView, hasMore, companiesFetching, companies.length]);

    const handleCreateCompany = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await createCompany(formData).unwrap();
            setShowModal(false);
            setFormData({ name: '', email: '', phone: '', address: '', website: '', clientUserId: '' });
            setPage(1);
        } catch (error) {
            console.error('Failed to create company:', error);
        }
    };

    const filteredCompanies = companies.filter(c =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.email?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-12 animate-in fade-in duration-1000">
            {/* Header Section */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
                <div className="space-y-3">
                    <div className="flex items-center gap-3">
                        <div className="w-2 h-8 bg-blue-500 rounded-full" />
                        <span className="text-blue-400 text-sm font-bold uppercase tracking-[0.3em]">Corporate Registry</span>
                    </div>
                    <h1 className="text-5xl font-black text-white tracking-tighter">Companies</h1>
                    <p className="text-slate-400 text-lg font-medium max-w-xl">
                        Monitor institutional partnerships, contractual links, and operational touchpoints.
                    </p>
                </div>

                <Button
                    variant="primary"
                    size="lg"
                    className="shadow-blue-500/20"
                    icon={<Plus size={22} />}
                    onClick={() => setShowModal(true)}
                >
                    Register Company
                </Button>
            </div>

            {/* Filter Section */}
            <Card variant="glass" className="!p-4">
                <div className="flex items-center gap-6">
                    <div className="flex-1">
                        <Input
                            placeholder="Filter by organization name, domain or industry..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            icon={<Search />}
                            className="bg-black/20 border-white/5"
                        />
                    </div>
                    <div className="hidden md:flex items-center gap-4 px-6 py-3 border-l border-white/10">
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Total verified</span>
                        <span className="text-xl font-black text-white">{companiesData?.total || 0}</span>
                    </div>
                </div>
            </Card>

            {/* Grid Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {companiesLoading && companies.length === 0 ? (
                    Array(6).fill(0).map((_, i) => (
                        <div key={i} className="h-80 rounded-[2.5rem] bg-white/5 animate-pulse border border-white/5" />
                    ))
                ) : filteredCompanies.length > 0 ? (
                    filteredCompanies.map((company) => (
                        <Card key={company.id} className="group relative pr-4" variant="solid" hover={true}>

                            <div className="flex flex-col h-full">
                                <div className="flex items-center gap-5 mb-8">
                                    <div className="w-16 h-16 rounded-2xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500 shadow-inner">
                                        <Building2 size={24} />
                                    </div>
                                    <div className="min-w-0">
                                        <h3 className="text-2xl font-black text-white tracking-tight truncate group-hover:text-blue-400 transition-colors">
                                            {company.name}
                                        </h3>
                                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                                            <Globe size={12} className="opacity-50" />
                                            {company.website?.replace('https://', '').replace('www.', '') || 'internal_domain'}
                                        </span>
                                    </div>
                                </div>

                                <div className="space-y-4 mb-8">
                                    <div className="flex items-center gap-4 p-3.5 rounded-2xl bg-white/[0.03] border border-white/5 group-hover:border-blue-500/20 transition-colors">
                                        <div className="p-2 rounded-lg bg-slate-800 text-slate-400">
                                            <Mail size={16} />
                                        </div>
                                        <span className="text-sm font-bold text-slate-300 truncate">{company.email}</span>
                                    </div>
                                    <div className="flex items-center gap-4 p-3.5 rounded-2xl bg-white/[0.03] border border-white/5 group-hover:border-blue-500/20 transition-colors">
                                        <div className="p-2 rounded-lg bg-slate-800 text-slate-400">
                                            <MapPin size={16} />
                                        </div>
                                        <span className="text-sm font-bold text-slate-300 truncate">{company.address || 'Operational HQ undisclosed'}</span>
                                    </div>
                                    <div className="flex items-center gap-4 p-3.5 rounded-2xl bg-white/[0.03] border border-white/5 group-hover:border-blue-500/20 transition-colors">
                                        <div className="p-2 rounded-lg bg-slate-800 text-slate-400">
                                            <UserCircle2 size={16} />
                                        </div>
                                        <span className="text-sm font-bold text-slate-300 truncate">
                                            {company.clientUser?.profile
                                                ? `${company.clientUser.profile.firstName} ${company.clientUser.profile.lastName}`
                                                : company.clientUser?.email || 'No assigned client'}
                                            <span className="ml-2 text-[10px] uppercase text-slate-500 tracking-widest bg-white/5 px-2 py-0.5 rounded-md">Account Holder</span>
                                        </span>
                                    </div>
                                </div>

                                <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between">
                                    <div className="flex items-center gap-1.5">
                                        <div className="flex -space-x-2">
                                            <div className="w-8 h-8 rounded-full bg-slate-800 border-2 border-[#131c31] flex items-center justify-center text-[10px] font-black text-slate-500">
                                                <Briefcase size={12} />
                                            </div>
                                        </div>
                                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Active ventures</span>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    ))
                ) : (
                    <div className="col-span-full py-24 flex flex-col items-center justify-center text-slate-500 border-2 border-dashed border-white/5 rounded-[3rem]">
                        <Building2 size={64} className="opacity-10 mb-6" />
                        <h3 className="text-2xl font-black text-white mb-2">No organizations found</h3>
                        <p className="text-slate-400 font-medium">Reset your filters or add a new institutional partner to the registry.</p>
                    </div>
                )}
            </div>

            {/* Pagination / Infinite Scroll */}
            <div ref={sentinelRef} className="py-16 flex flex-col items-center gap-5">
                {companiesFetching && hasMore && (
                    <div className="flex flex-col items-center gap-4 text-blue-400">
                        <Loader2 className="w-10 h-10 animate-spin" />
                        <span className="text-xs font-black uppercase tracking-[0.3em]">Querying Global registry...</span>
                    </div>
                )}
                {!hasMore && companies.length > 0 && (
                    <div className="px-8 py-3.5 rounded-full bg-white/5 border border-white/5 text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] shadow-inner">
                        Operational Capacity Reached • {companiesData?.total} Partners Verified
                    </div>
                )}
            </div>

            {/* Modal Section */}
            <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Partner Registration Protocol" maxWidth="2xl">
                <form onSubmit={handleCreateCompany} className="space-y-8 pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <Input
                            label="Organization Name"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="HSS Dynamics"
                        />
                        <Input
                            label="Official Domain"
                            value={formData.website}
                            onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                            placeholder="https://hss-dynamics.ly"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <Input
                            label="Communication Endpoint (Email)"
                            required
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            placeholder="ops@organization.com"
                        />
                        <Input
                            label="Operational Hotline"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            placeholder="+1 (555) 000-0000"
                        />
                    </div>

                    <Input
                        label="Institutional Headquarters (Address)"
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        placeholder="123 Innovation Drive, Sector 7"
                    />

                    <div className="space-y-2">
                        <label className="text-[13px] font-bold text-slate-500 uppercase tracking-wider ml-1">Assigned Executive Liaison</label>
                        <select
                            required
                            className="w-full bg-white/5 border border-white/5 rounded-[2rem] px-6 py-4 text-white focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/50 transition-all font-medium"
                            value={formData.clientUserId}
                            onChange={(e) => setFormData({ ...formData, clientUserId: e.target.value })}
                        >
                            <option value="" className="bg-[#131c31]">Select Account Holder</option>
                            {clients.map(c => (
                                <option key={c.id} value={c.id} className="bg-[#131c31]">
                                    {c.profile ? `${c.profile.firstName} ${c.profile.lastName}` : c.email}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex gap-6 pt-6">
                        <Button type="button" variant="secondary" className="flex-1 !rounded-[2rem]" size="lg" onClick={() => setShowModal(false)}>
                            Discard
                        </Button>
                        <Button type="submit" className="flex-1 !rounded-[2rem] shadow-blue-600/30" size="lg" isLoading={creating}>
                            Verify & Register
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default Companies;
