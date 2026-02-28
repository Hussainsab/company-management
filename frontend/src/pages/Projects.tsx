import React, { useState, useEffect } from 'react';
import {
    Plus,
    Calendar,
    Search,
    Loader2,
    TrendingUp,
    Clock,
    CheckCircle2,
    AlertCircle,
    User,
    ArrowRight,
    Building2,
    MoreHorizontal,
    ChevronRight,
    Filter
} from 'lucide-react';
import { useInView } from 'react-intersection-observer';
import { useNavigate } from 'react-router-dom';
import Card from '../components/ui/Card.tsx';
import Button from '../components/ui/Button.tsx';
import Input from '../components/ui/Input.tsx';
import Modal from '../components/ui/Modal.tsx';
import {
    useGetProjectsQuery,
    useCreateProjectMutation,
    useGetCompaniesQuery,
    useGetUsersQuery,
    useAssignEmployeesMutation,
    useUnassignEmployeeMutation,
    useUpdateRequestStatusMutation // re-using a generic name or we need a specific one for projects - wait, I need to check apiService for updateProjectStatus.
} from '../services/apiService.ts';
import { useAuth } from '../store/AuthContext.tsx';
import type { Project, ProjectStatus } from '../types';

const Projects = () => {
    const navigate = useNavigate();
    const [search, setSearch] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [page, setPage] = useState(1);
    const [limit] = useState(9);
    const [activeTab, setActiveTab] = useState('All Projects');
    const [assignModalOpen, setAssignModalOpen] = useState(false);
    const [selectedProjectForAssign, setSelectedProjectForAssign] = useState<Project | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        clientId: '',
        startDate: '',
        endDate: '',
        status: 'planned' as ProjectStatus,
    });
    const { user } = useAuth();

    const { data, isLoading, isFetching } = useGetProjectsQuery({
        page,
        limit,
        status: activeTab === 'All Projects' ? undefined : activeTab.toLowerCase().replace(' ', '_'),
    });
    const { data: companiesData } = useGetCompaniesQuery({ page: 1, limit: 100 });
    const { data: usersData } = useGetUsersQuery({ page: 1, limit: 100, role: 'employee' }, { skip: user?.role !== 'admin' });
    const [createProject, { isLoading: creating }] = useCreateProjectMutation();
    const [assignEmployee] = useAssignEmployeesMutation();
    const [unassignEmployee] = useUnassignEmployeeMutation();
    // I need to add useUpdateProjectStatusMutation to apiService first if it's missing, let's use a generic fetch for now or add it. I'll modify apiService concurrently.

    const projects = data?.projects || [];
    const companies = companiesData?.companies || [];
    const hasMore = data ? projects.length < data.total : true;

    const { ref: sentinelRef, inView } = useInView({
        threshold: 0.1,
        rootMargin: '200px',
    });

    useEffect(() => {
        setPage(1);
    }, [activeTab]);

    useEffect(() => {
        if (inView && hasMore && !isFetching && projects.length > 0) {
            setPage(prev => prev + 1);
        }
    }, [inView, hasMore, isFetching, projects.length]);

    const handleCreateProject = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await createProject(formData).unwrap();
            setShowModal(false);
            setFormData({ name: '', description: '', clientId: '', startDate: '', endDate: '', status: 'planned' });
            setPage(1);
        } catch (error) {
            console.error('Failed to create project:', error);
        }
    };

    const handleAssignEmployee = async (projectId: string, employeeId: string) => {
        try {
            const updatedProject = await assignEmployee({ projectId, employeeId }).unwrap();
            setSelectedProjectForAssign(updatedProject);
        } catch (error) {
            console.error('Failed to assign employee:', error);
        }
    };

    const handleUnassignEmployee = async (projectId: string, employeeId: string) => {
        try {
            const updatedProject = await unassignEmployee({ projectId, employeeId }).unwrap();
            setSelectedProjectForAssign(updatedProject);
        } catch (error) {
            console.error('Failed to unassign employee:', error);
        }
    };

    // Replace update project status with a direct fetch if mutation is not available yet, or I can add it to apiService. I'll add the mutation handler here but implement it later if missing.
    const handleUpdateStatus = async (projectId: string, newStatus: ProjectStatus) => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/projects/${projectId}/status`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ status: newStatus })
            });

            if (!res.ok) throw new Error('Failed to update status');
            // Trigger a refetch or optimistic update (hard refresh for now)
            window.location.reload();
        } catch (error) {
            console.error('Failed to update status:', error);
        }
    };

    const filteredProjects = projects.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        (p.client?.name || '').toLowerCase().includes(search.toLowerCase())
    );

    const filterTabs = ['All Projects', 'Planned', 'In Progress', 'Completed', 'On Hold'];

    return (
        <div className="space-y-12 animate-in fade-in duration-1000">
            {/* Header Section */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
                <div className="space-y-3">
                    <div className="flex items-center gap-3">
                        <div className="w-2 h-8 bg-indigo-500 rounded-full" />
                        <span className="text-indigo-400 text-sm font-bold uppercase tracking-[0.3em]">Lifecycle management</span>
                    </div>
                    <h1 className="text-5xl font-black text-white tracking-tighter">Projects</h1>
                    <p className="text-slate-400 text-lg font-medium max-w-xl">
                        Monitor project progression, resource allocation, and milestone achievement across the enterprise.
                    </p>
                </div>

                <Button
                    variant="primary"
                    size="lg"
                    className="shadow-indigo-500/20"
                    icon={<Plus size={22} />}
                    onClick={() => setShowModal(true)}
                >
                    Create Project
                </Button>
            </div>

            {/* Navigation & Search */}
            <div className="flex flex-col xl:flex-row gap-6 items-center">
                <div className="flex items-center gap-2 p-1.5 bg-black/20 rounded-[2rem] border border-white/5 overflow-x-auto no-scrollbar w-full xl:w-auto">
                    {filterTabs.map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`
                                px-6 py-3 rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 whitespace-nowrap
                                ${activeTab === tab
                                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                                    : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'}
                            `}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
                <div className="flex-1 w-full relative group">
                    <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none text-slate-500 group-focus-within:text-indigo-400 transition-colors">
                        <Search size={18} />
                    </div>
                    <input
                        type="text"
                        placeholder="Search projects by name, client or lead..."
                        className="w-full bg-white/5 border border-white/5 rounded-[2rem] pl-16 pr-8 py-4 text-white placeholder:text-slate-600 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500/50 transition-all font-medium"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            {/* Projects Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-20">
                {isLoading && projects.length === 0 ? (
                    Array(6).fill(0).map((_, i) => (
                        <div key={i} className="h-64 rounded-[2.5rem] bg-white/5 animate-pulse border border-white/5" />
                    ))
                ) : filteredProjects.length > 0 ? (
                    filteredProjects.map((project) => (
                        <Card key={project.id} className="group overflow-visible relative" variant="solid" hover={true}>
                            {/* <div className="absolute top-0 right-0 p-6">
                                <button className="p-2 text-slate-500 hover:text-white transition-colors bg-white/5 rounded-xl">
                                    <MoreHorizontal size={18} />
                                </button>
                            </div> */}

                            {/* Dropdowns for Admin (Assign) and Employee (Status) are placed intelligently */}
                            {user?.role === 'admin' && (
                                <button
                                    onClick={() => {
                                        setSelectedProjectForAssign(project);
                                        setAssignModalOpen(true);
                                    }}
                                    className="absolute top-0 right-6 z-20 opacity-0 group-hover:opacity-100 transition-opacity bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-xl shadow-lg border border-indigo-500/50"
                                >
                                    Manage Team
                                </button>
                            )}

                            {/* Employee Direct Status Select */}
                            {user?.role === 'employee' ? (
                                <div className="mb-6 relative z-20">
                                    <div className="relative inline-block mb-4">
                                        <select
                                            className={`flex items-center gap-2 pl-3 pr-8 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border outline-none cursor-pointer appearance-none shadow-sm transition-all
                                                ${project.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20' : project.status === 'in_progress' ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20 hover:bg-indigo-500/20' : project.status === 'on_hold' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20 hover:bg-amber-500/20' : 'bg-slate-500/10 text-slate-400 border-white/10 hover:bg-white/5'}
                                            `}
                                            onChange={(e) => handleUpdateStatus(project.id, e.target.value as ProjectStatus)}
                                            value={project.status}
                                        >
                                            <option value="planned" className="bg-[#131c31] text-slate-400 font-bold">Planned</option>
                                            <option value="in_progress" className="bg-[#131c31] text-indigo-400 font-bold">In Progress</option>
                                            <option value="completed" className="bg-[#131c31] text-emerald-400 font-bold">Completed</option>
                                            <option value="on_hold" className="bg-[#131c31] text-amber-400 font-bold">On Hold</option>
                                        </select>
                                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                                            <ChevronRight size={12} className={`rotate-90 ${project.status === 'completed' ? 'text-emerald-400/50' : project.status === 'in_progress' ? 'text-indigo-400/50' : project.status === 'on_hold' ? 'text-amber-400/50' : 'text-slate-400/50'}`} />
                                        </div>
                                    </div>
                                    <h3 className="text-2xl font-black text-white tracking-tight leading-none group-hover:text-indigo-400 transition-colors">
                                        {project.name}
                                    </h3>
                                    <p className="text-slate-500 text-xs font-bold tracking-widest mt-2 flex items-center gap-2">
                                        <Building2 size={12} className="opacity-50" />
                                        {project.description}
                                    </p>
                                </div>
                            ) : (
                                <div className="mb-6">
                                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border mb-4
                                        ${project.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : project.status === 'in_progress' ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' : project.status === 'on_hold' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 'bg-slate-500/10 text-slate-400 border-white/10'}
                                    `}>
                                        <div className={`w-1 h-1 rounded-full ${project.status === 'completed' ? 'bg-emerald-500' : project.status === 'in_progress' ? 'bg-indigo-500' : project.status === 'on_hold' ? 'bg-amber-500' : 'bg-slate-500'}`} />
                                        {project.status.replace('_', ' ')}
                                    </div>
                                    <h3 className="text-2xl font-black text-white tracking-tight leading-none group-hover:text-indigo-400 transition-colors">
                                        {project.name}
                                    </h3>
                                    <p className="text-slate-500 text-xs font-bold tracking-widest mt-2 flex items-center gap-2">
                                        <Building2 size={12} className="opacity-50" />
                                        {project.description}
                                    </p>
                                </div>
                            )}

                            <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between">
                                <div className="flex -space-x-3">
                                    {(project.employees || []).slice(0, 3).map((emp, i) => (
                                        <div key={emp.id} className="w-9 h-9 rounded-xl bg-slate-800 border-2 border-[#131c31] flex items-center justify-center text-[10px] font-black text-indigo-400 ring-2 ring-transparent group-hover:ring-indigo-500/20 transition-all shadow-lg" title={emp.email}>
                                            {emp.name?.[0] || emp.email[0].toUpperCase()}
                                        </div>
                                    ))}
                                    {(project.employees || []).length > 3 && (
                                        <div className="w-9 h-9 rounded-xl bg-indigo-600 border-2 border-[#131c31] flex items-center justify-center text-[10px] font-black text-white shadow-lg">
                                            +{(project.employees || []).length - 3}
                                        </div>
                                    )}
                                    {(project.employees || []).length === 0 && (
                                        <div className="text-[10px] font-black text-slate-600 uppercase tracking-widest pl-2">Unassigned</div>
                                    )}
                                </div>
                            </div>
                        </Card>
                    ))
                ) : (
                    <div className="col-span-full py-24 flex flex-col items-center justify-center text-slate-500 border-2 border-dashed border-white/5 rounded-[3rem]">
                        <TrendingUp size={64} className="opacity-10 mb-6" />
                        <h3 className="text-2xl font-black text-white mb-2">No projects discovered</h3>
                        <p className="text-slate-400 font-medium">Expand your search or initialize a new project flow.</p>
                    </div>
                )}
            </div>

            {/* Loading Indicator for Infinite Scroll */}
            <div ref={sentinelRef} className="py-12 flex flex-col items-center justify-center">
                {isFetching && hasMore && (
                    <div className="flex flex-col items-center gap-4 text-indigo-400">
                        <Loader2 className="w-10 h-10 animate-spin" />
                        <span className="text-xs font-black uppercase tracking-[0.3em]">Synchronizing Registry...</span>
                    </div>
                )}
            </div>

            {/* Modal for Project Creation */}
            <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Create New Project" maxWidth="2xl">
                <form onSubmit={handleCreateProject} className="space-y-8 pt-4">
                    <Input
                        label="Project Name"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Apollo Growth Framework"
                    />

                    <div className="space-y-2">
                        <label className="text-[13px] font-bold text-slate-500 uppercase tracking-wider ml-1">Contextual Description</label>
                        <textarea
                            className="w-full bg-white/5 border border-white/5 rounded-[1.5rem] px-6 py-4 text-white placeholder:text-slate-600 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500/50 transition-all font-medium h-32 resize-none"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Detail the strategic objectives and expected outcomes of this initiative..."
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                            <label className="text-[13px] font-bold text-slate-500 uppercase tracking-wider ml-1">Institutional Partner</label>
                            <select
                                required
                                className="w-full bg-white/5 border border-white/5 rounded-[2rem] px-6 py-4 text-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500/50 transition-all font-medium"
                                value={formData.clientId}
                                onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
                            >
                                <option value="" className="bg-[#131c31]">Select Client</option>
                                {companies.map(c => (
                                    <option key={c.id} value={c.clientUserId} className="bg-[#131c31]">{c.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[13px] font-bold text-slate-500 uppercase tracking-wider ml-1">Operational State</label>
                            <select
                                className="w-full bg-white/5 border border-white/5 rounded-[2rem] px-6 py-4 text-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500/50 transition-all font-medium"
                                value={formData.status}
                                onChange={(e) => setFormData({ ...formData, status: e.target.value as ProjectStatus })}
                            >
                                <option value="planned" className="bg-[#131c31]">Planned</option>
                                <option value="in_progress" className="bg-[#131c31]">In Progress</option>
                                <option value="completed" className="bg-[#131c31]">Completed</option>
                                <option value="on_hold" className="bg-[#131c31]">On Hold</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <Input
                            label="Commencement"
                            type="date"
                            required
                            value={formData.startDate}
                            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                        />
                        <Input
                            label="Target Completion"
                            type="date"
                            required
                            value={formData.endDate}
                            onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                        />
                    </div>

                    <div className="flex gap-6 pt-6">
                        <Button type="button" variant="secondary" className="flex-1 !rounded-[2rem]" size="lg" onClick={() => setShowModal(false)}>
                            Discard
                        </Button>
                        <Button type="submit" className="flex-1 !rounded-[2rem] shadow-indigo-600/30" size="lg" isLoading={creating}>
                            Create Project
                        </Button>
                    </div>
                </form>
            </Modal>

            <Modal isOpen={assignModalOpen} onClose={() => { setAssignModalOpen(false); setSelectedProjectForAssign(null); }} title="Manage Team" maxWidth="md">
                <div className="space-y-6 pt-4 pb-2">
                    <p className="text-sm text-slate-400 font-medium px-1">
                        Manage personnel allocated to <span className="text-white font-bold">{selectedProjectForAssign?.name}</span>.
                    </p>
                    <div className="space-y-6 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">

                        {/* Assigned Personnel Section */}
                        <div className="space-y-3">
                            <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest pl-1 mb-2">Assigned Personnel</h4>
                            {selectedProjectForAssign?.employees && selectedProjectForAssign.employees.length > 0 ? (
                                selectedProjectForAssign.employees.map((u: any) => (
                                    <div key={u.id} className="flex items-center justify-between p-4 rounded-3xl bg-indigo-500/5 border border-indigo-500/20 hover:border-indigo-500/40 hover:bg-indigo-500/10 transition-all group">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-[#131c31] border border-white/5 text-slate-300 flex items-center justify-center font-black text-lg group-hover:text-indigo-400 group-hover:border-indigo-500/50 transition-colors shadow-inner">
                                                {u.profile?.firstName?.[0] || u.name?.[0] || u.email[0].toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="font-bold text-white text-sm tracking-tight">{u.profile?.firstName || u.name} {u.profile?.lastName || ''}</p>
                                                <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mt-1">{u.email}</p>
                                            </div>
                                        </div>
                                        <Button size="sm" variant="danger" className="!rounded-xl shadow-lg group-hover:bg-rose-500/20" onClick={() => handleUnassignEmployee(selectedProjectForAssign!.id, u.id)}>
                                            Remove
                                        </Button>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-6 text-slate-500 font-medium bg-white/5 rounded-3xl border border-white/5 shadow-inner text-sm">
                                    No personnel currently assigned.
                                </div>
                            )}
                        </div>

                        {/* Available Personnel Section */}
                        <div className="space-y-3 pt-4 border-t border-white/10">
                            <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest pl-1 mb-2">Available to Assign</h4>
                            {usersData?.users?.filter(u => !selectedProjectForAssign?.employees?.some(e => e.id === u.id)).length && usersData.users.filter(u => !selectedProjectForAssign?.employees?.some(e => e.id === u.id)).length > 0 ? (
                                usersData.users
                                    .filter(u => !selectedProjectForAssign?.employees?.some(e => e.id === u.id))
                                    .map((u: any) => (
                                        <div key={u.id} className="flex items-center justify-between p-4 rounded-3xl bg-white/5 border border-white/5 hover:border-indigo-500/30 hover:bg-white/10 transition-all group">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-2xl bg-[#131c31] border border-white/5 text-slate-300 flex items-center justify-center font-black text-lg group-hover:text-indigo-400 group-hover:border-indigo-500/50 transition-colors shadow-inner">
                                                    {u.profile?.firstName?.[0] || u.name?.[0] || u.email[0].toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-white text-sm tracking-tight">{u.profile?.firstName || u.name} {u.profile?.lastName || ''}</p>
                                                    <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mt-1">{u.email}</p>
                                                </div>
                                            </div>
                                            <Button size="sm" className="!rounded-xl shadow-lg border border-white/10 group-hover:border-indigo-500/30" onClick={() => handleAssignEmployee(selectedProjectForAssign!.id, u.id)}>
                                                Assign Node
                                            </Button>
                                        </div>
                                    ))
                            ) : (
                                <div className="text-center py-6 text-slate-500 font-medium bg-white/5 rounded-3xl border border-white/5 shadow-inner text-sm">
                                    No eligible personnel available.
                                </div>
                            )}
                        </div>

                    </div>
                </div>
            </Modal>
        </div >
    );
};

export default Projects;
