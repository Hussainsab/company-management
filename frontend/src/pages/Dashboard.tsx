import React from 'react';
import {
    TrendingUp,
    Users,
    Briefcase,
    AlertCircle,
    ChevronRight,
    ArrowUpRight,
    ArrowDownRight,
    Calendar,
    ArrowRight,
    Building2,
    FolderKanban,
    ClipboardList,
    MessageSquare
} from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { useGetDashboardStatsQuery, useGetProjectsQuery } from '../services/apiService';
import { useAuth } from '../store/AuthContext';
import { useNavigate } from 'react-router-dom';

const StatCard = ({ title, value, icon, trend, trendValue, color, loading }: any) => {
    const colors: any = {
        indigo: 'from-indigo-600/20 to-indigo-600/5 text-indigo-400 border-indigo-500/20',
        blue: 'from-blue-600/20 to-blue-600/5 text-blue-400 border-blue-500/20',
        emerald: 'from-emerald-600/20 to-emerald-600/5 text-emerald-400 border-emerald-500/20',
        amber: 'from-amber-600/20 to-amber-600/5 text-amber-400 border-amber-500/20',
    };

    return (
        <Card variant="glass" className="relative group overflow-hidden" hover={true}>
            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${colors[color]} rounded-full blur-3xl opacity-20 -mr-16 -mt-16 transition-transform duration-500 group-hover:scale-150`} />

            <div className="flex justify-between items-start mb-6">
                <div className={`p-4 rounded-2xl bg-gradient-to-br ${colors[color]} border shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                    {icon}
                </div>
                {!loading && trendValue && (
                    <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${trend === 'up' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'} border border-emerald-500/10`}>
                        {trend === 'up' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                        {trendValue}
                    </div>
                )}
            </div>

            <div>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">{title}</p>
                {loading ? (
                    <div className="h-9 w-24 bg-white/5 animate-pulse rounded-full mt-2" />
                ) : (
                    <h3 className="text-4xl font-black text-white tracking-tight">{value}</h3>
                )}
            </div>
        </Card>
    );
};

const Dashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const { data: stats, isLoading: statsLoading } = useGetDashboardStatsQuery();
    const { data: projectsData, isLoading: projectsLoading } = useGetProjectsQuery({ page: 1, limit: 5 });

    const recentProjects = projectsData?.projects || [];
    const loading = statsLoading || (projectsLoading && recentProjects.length === 0);

    let statCards: any[] = [];
    if (user?.role === 'admin') {
        statCards = [
            { title: 'Employees', value: stats?.totalEmployees || '0', icon: <Users size={24} />, color: 'indigo' },
            { title: 'Companies', value: stats?.totalClients || '0', icon: <Users size={24} />, color: 'blue' },
            { title: 'Projects', value: stats?.totalProjects || '0', icon: <Briefcase size={24} />, color: 'emerald' },
            { title: 'Pending Requests', value: stats?.pendingRequests || '0', icon: <AlertCircle size={24} />, color: 'amber' },
        ];
    } else if (user?.role === 'employee') {
        statCards = [
            { title: 'Assigned projects', value: stats?.totalProjects || '0', icon: <Briefcase size={24} />, color: 'emerald' },
            { title: 'Active projects', value: stats?.activeProjects || '0', icon: <FolderKanban size={24} />, color: 'indigo' },
        ];
    } else if (user?.role === 'client') {
        statCards = [
            { title: 'My Projects', value: stats?.totalProjects || '0', icon: <Briefcase size={24} />, color: 'emerald' },
            { title: 'My Requests', value: stats?.totalRequests || '0', icon: <ClipboardList size={24} />, color: 'amber' },
        ];
    }

    return (
        <div className="space-y-12 animate-in fade-in duration-1000">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-2">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-2 h-8 bg-indigo-500 rounded-full" />
                        <span className="text-indigo-400 text-sm font-bold uppercase tracking-[0.3em]">Operational Hub</span>
                    </div>
                    <h1 className="text-5xl font-black text-white tracking-tighter items-center flex gap-4">
                        System Overview
                    </h1>
                    <p className="text-slate-400 text-lg font-medium max-w-2xl">
                        Monitor your organizational performance and project lifecycles in real-time.
                    </p>
                </div>

                <div className="flex items-center gap-4 bg-white/5 p-2 rounded-2xl border border-white/5">
                    <div className="p-3 bg-indigo-600 rounded-xl shadow-lg shadow-indigo-500/20 text-white">
                        <Calendar size={20} />
                    </div>
                    <div className="pr-4">
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Today's Date</p>
                        <p className="text-sm font-bold text-white text-nowrap">
                            {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                        </p>
                    </div>
                </div>
            </div>

            {/* Statistics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {statCards.map((stat, idx) => (
                    <StatCard key={idx} {...stat} loading={loading} />
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Project Pipeline */}
                <Card className="lg:col-span-2" title="Active Pipeline" subtitle="Real-time monitoring of project progression and output.">
                    <div className="space-y-8 mt-6">
                        {loading ? (
                            Array(3).fill(0).map((_, i) => (
                                <div key={i} className="h-24 w-full bg-white/5 animate-pulse rounded-[2rem]" />
                            ))
                        ) : recentProjects.length > 0 ? (
                            recentProjects.map((project) => (
                                <div key={project.id} className="group relative flex items-center gap-6 p-2 rounded-[2.5rem] hover:bg-white/[0.03] transition-all duration-500">
                                    <div className="w-16 h-16 rounded-[1.5rem] bg-slate-800 flex items-center justify-center text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500 shadow-inner">
                                        <TrendingUp size={28} />
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-center mb-3">
                                            <div className="flex flex-col">
                                                <h4 className="font-bold text-xl text-white tracking-tight group-hover:text-indigo-400 transition-colors">
                                                    {project.name}
                                                </h4>
                                                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">
                                                    {project.client?.profile ? `${project.client.profile.firstName} ${project.client.profile.lastName}` : project.client?.email}
                                                </span>
                                            </div>
                                            <div className="text-right">
                                                <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${project.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'}`}>
                                                    {project.status.replace('_', ' ')}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="relative h-2.5 bg-slate-800/50 rounded-full overflow-hidden mb-2">
                                            <div
                                                className={`absolute inset-y-0 left-0 rounded-full transition-all duration-1000 ease-out ${project.status === 'completed' ? 'bg-emerald-500' : 'bg-gradient-to-r from-indigo-600 to-indigo-400 shadow-[0_0_15px_rgba(79,70,229,0.5)]'}`}
                                                style={{ width: project.status === 'completed' ? '100%' : '45%' }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="flex flex-col items-center justify-center py-12 text-slate-500 border-2 border-dashed border-white/5 rounded-[2rem]">
                                <Briefcase size={40} className="mb-3 opacity-20" />
                                <p className="font-bold uppercase tracking-widest text-sm">No active projects</p>
                            </div>
                        )}
                    </div>
                </Card>

                {/* Direct Actions Container */}
                <div className="space-y-8">
                    <Card variant="glass" className="h-full">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-1.5 h-6 bg-indigo-500 rounded-full" />
                            <h3 className="text-xl font-bold text-white tracking-tight">Rapid Deployment</h3>
                        </div>

                        <div className="space-y-4">
                            {user?.role === 'admin' && (
                                <>
                                    <button
                                        onClick={() => navigate('/companies')}
                                        className="w-full flex items-center justify-between p-5 rounded-2xl bg-indigo-600 text-white hover:bg-indigo-500 transition-all duration-300 shadow-lg shadow-indigo-600/20 group hover:scale-[1.02]"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="p-2.5 bg-white/20 rounded-xl">
                                                <Building2 size={20} />
                                            </div>
                                            <span className="font-bold text-[15px]">Register Company</span>
                                        </div>
                                        <ChevronRight size={18} className="translate-x-0 group-hover:translate-x-1 transition-transform" />
                                    </button>

                                    <button
                                        onClick={() => navigate('/projects')}
                                        className="w-full flex items-center justify-between p-5 rounded-2xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all duration-300 group hover:scale-[1.02]"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="p-2.5 bg-indigo-500/20 text-indigo-400 rounded-xl">
                                                <FolderKanban size={20} />
                                            </div>
                                            <span className="font-bold text-[15px]">Launch Project</span>
                                        </div>
                                        <ChevronRight size={18} className="translate-x-0 group-hover:translate-x-1 transition-transform" />
                                    </button>
                                </>
                            )}

                            <button
                                onClick={() => navigate(user?.role === 'client' ? '/service-requests' : '/messages')}
                                className="w-full flex items-center justify-between p-5 rounded-2xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all duration-300 group hover:scale-[1.02]"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="p-2.5 bg-amber-500/20 text-amber-400 rounded-xl">
                                        {user?.role === 'client' ? <ClipboardList size={20} /> : <MessageSquare size={20} />}
                                    </div>
                                    <span className="font-bold text-[15px]">
                                        {user?.role === 'client' ? 'Request Service' : 'Team Messenger'}
                                    </span>
                                </div>
                                <ChevronRight size={18} className="translate-x-0 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
