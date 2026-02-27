import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    Users,
    Building2,
    FolderKanban,
    MessageSquare,
    ClipboardList,
    UserCircle,
    LogOut,
    Menu,
    X
} from 'lucide-react';
import { useAuth } from '../store/AuthContext';

const Layout = ({ children }: { children: React.ReactNode }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);

    const navItems = [
        { path: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
        { path: '/users', label: 'Users', icon: <Users size={20} />, role: 'admin' },
        { path: '/companies', label: 'Companies', icon: <Building2 size={20} />, role: 'admin' },
        { path: '/projects', label: 'Projects', icon: <FolderKanban size={20} /> },
        { path: '/messages', label: 'Communication', icon: <MessageSquare size={20} /> },
        { path: '/service-requests', label: 'Services', icon: <ClipboardList size={20} />, role: ['admin', 'client'] },
        { path: '/profile', label: 'Identity', icon: <UserCircle size={20} /> },
    ];

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="flex min-h-screen bg-[#0a0f1d] text-slate-300 font-sans selection:bg-indigo-500/30">
            {/* Sidebar */}
            <aside
                className={`
                    fixed left-0 top-0 h-full z-50 transition-all duration-500 ease-out
                    border-r border-white/5 bg-[#0a0f1d]/80 backdrop-blur-3xl
                    ${isSidebarOpen ? 'w-80 translate-x-0' : 'w-20 -translate-x-full lg:translate-x-0 lg:w-24'}
                `}
            >
                <div className="h-full flex flex-col p-6">
                    {/* Brand */}
                    <div className="flex items-center justify-between mb-12 px-2">
                        {isSidebarOpen ? (
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-600/30">
                                    <span className="font-black text-xl italic mt-0.5 ml-0.5">H</span>
                                </div>
                                <span className="text-xl font-black text-white tracking-tighter">HSS Portal</span>
                            </div>
                        ) : (
                            <div className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center text-white mx-auto">
                                <span className="font-black">H</span>
                            </div>
                        )}
                        <button
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="hidden lg:block text-slate-500 hover:text-white transition-colors"
                        >
                            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
                        </button>
                    </div>

                    {/* Nav Items */}
                    <nav className="flex-1 space-y-2">
                        {navItems.map((item) => {
                            if (item.role) {
                                const roles = Array.isArray(item.role) ? item.role : [item.role];
                                if (!user || !roles.includes(user.role)) return null;
                            }

                            return (
                                <NavLink
                                    key={item.path}
                                    to={item.path}
                                    className={({ isActive }) => `
                                        flex items-center gap-4 px-4 py-4 rounded-[1.25rem] transition-all duration-300 group
                                        ${isActive
                                            ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/20'
                                            : 'text-slate-500 hover:text-white hover:bg-white/5'}
                                    `}
                                >
                                    <div className={`transition-transform duration-300 group-hover:scale-110`}>
                                        {item.icon}
                                    </div>
                                    {isSidebarOpen && (
                                        <span className="font-bold text-sm tracking-tight">{item.label}</span>
                                    )}
                                </NavLink>
                            );
                        })}
                    </nav>

                    {/* User Action */}
                    <div className="mt-auto pt-6 border-t border-white/5 space-y-4">
                        <div className={`flex items-center gap-4 px-2 ${isSidebarOpen ? '' : 'justify-center'}`}>
                            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border border-white/5 flex items-center justify-center text-xs font-black text-indigo-400">
                                {user?.name?.[0] || user?.email[0].toUpperCase()}
                            </div>
                            {isSidebarOpen && (
                                <div className="min-w-0">
                                    <p className="text-sm font-bold text-white truncate">{user?.name || 'Session Active'}</p>
                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{user?.role}</p>
                                </div>
                            )}
                        </div>
                        <button
                            onClick={handleLogout}
                            className={`
                                w-full flex items-center gap-4 px-4 py-4 rounded-[1.25rem] text-rose-500 hover:bg-rose-500/10 transition-all duration-300 group
                                ${isSidebarOpen ? '' : 'justify-center'}
                            `}
                        >
                            <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
                            {isSidebarOpen && <span className="font-bold text-sm tracking-tight text-nowrap">Terminate Session</span>}
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main
                className={`
                    flex-1 transition-all duration-500 min-h-screen
                    ${isSidebarOpen ? 'lg:pl-80' : 'lg:pl-24'}
                `}
            >
                <div className="max-w-[1600px] mx-auto p-6 md:p-10 lg:p-14">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default Layout;
