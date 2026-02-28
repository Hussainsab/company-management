import React, { useState, useEffect } from 'react';
import {
    MessageSquare,
    Send,
    Search,
    MoreVertical,
    CheckCheck,
    UserPlus,
    X,
    Loader2,
    Hash,
    MoreHorizontal,
    ChevronRight,
    MoreHorizontal as MoreHorizontalIcon
} from 'lucide-react';
import { useAuth } from '../store/AuthContext';
import {
    useGetConversationsQuery,
    useGetThreadQuery,
    useGetMessagePartnersQuery,
    useSendMessageMutation
} from '../services/apiService';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';

const Messages = () => {
    const [messages, setMessages] = useState<any[]>([]);
    const [activeChat, setActiveChat] = useState<any>(null);
    const [messageText, setMessageText] = useState('');
    const [showNewChatModal, setShowNewChatModal] = useState(false);

    // Queries
    const { data: chats = [], isLoading: chatsLoading } = useGetConversationsQuery(undefined);
    const { data: threadData } = useGetThreadQuery(activeChat?.partner?.id, {
        skip: !activeChat?.partner?.id,
    });
    const { data: availableUsers = [], isFetching: fetchingUsers } = useGetMessagePartnersQuery(undefined, {
        skip: !showNewChatModal,
    });

    // Mutations
    const [sendMessage] = useSendMessageMutation();

    useEffect(() => {
        if (threadData) {
            setMessages(threadData);
        }
    }, [threadData]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!messageText.trim() || !activeChat) return;

        try {
            const receiverId = activeChat.partner.id;
            const content = messageText;
            setMessageText('');
            await sendMessage({ receiverId, content }).unwrap();
        } catch (error) {
            console.error('Failed to send message:', error);
        }
    };

    return (
        <div className="h-[calc(100vh-10rem)] flex gap-10 animate-in fade-in duration-1000">
            {/* Sidebar - Chat List */}
            <div className="w-96 flex flex-col gap-8">
                <div className="flex items-center justify-between px-2">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <div className="w-1.5 h-4 bg-indigo-500 rounded-full" />
                            <span className="text-indigo-400 text-[10px] font-black uppercase tracking-[0.3em]">Communications</span>
                        </div>
                        <h1 className="text-4xl font-black text-white tracking-tighter">Messenger</h1>
                    </div>
                    <button
                        onClick={() => setShowNewChatModal(true)}
                        className="w-12 h-12 flex items-center justify-center bg-indigo-600 rounded-2xl text-white hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-500/20 active:scale-90"
                    >
                        <UserPlus size={20} />
                    </button>
                </div>

                <div className="px-2">
                    <Input
                        placeholder="Search conversations..."
                        icon={<Search size={18} />}
                        className="bg-white/5 border-white/5 !rounded-2xl"
                    />
                </div>

                <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
                    {chatsLoading ? (
                        Array(4).fill(0).map((_, i) => (
                            <div key={i} className="h-24 rounded-[2rem] bg-white/5 animate-pulse border border-white/5" />
                        ))
                    ) : chats.map((chat: any) => (
                        <button
                            key={chat.partner.id}
                            onClick={() => setActiveChat(chat)}
                            className={`w-full text-left p-5 rounded-[2rem] transition-all duration-300 border group
                                ${activeChat?.partner.id === chat.partner.id
                                    ? 'bg-indigo-600 border-indigo-500 shadow-xl shadow-indigo-600/20'
                                    : 'bg-white/5 border-white/5 hover:bg-white/[0.08] hover:border-white/10'}
                            `}
                        >
                            <div className="flex justify-between items-start">
                                <div className="flex items-center gap-4 min-w-0">
                                    <div className="relative shrink-0">
                                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xl transition-all duration-300
                                            ${activeChat?.partner.id === chat.partner.id ? 'bg-white/20 text-white' : 'bg-indigo-600/10 text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white'}
                                        `}>
                                            {chat.partner.profile?.firstName?.[0] || chat.partner.email[0]}
                                        </div>
                                        {chat.partner.isActive && (
                                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-[#131c31] rounded-full" />
                                        )}
                                    </div>
                                    <div className="min-w-0">
                                        <h4 className={`font-bold text-[17px] truncate tracking-tight ${activeChat?.partner.id === chat.partner.id ? 'text-white' : 'text-slate-200 group-hover:text-white'}`}>
                                            {chat.partner.profile ? `${chat.partner.profile.firstName} ${chat.partner.profile.lastName}` : chat.partner.email}
                                        </h4>
                                        <p className={`text-xs truncate font-medium mt-0.5 ${activeChat?.partner.id === chat.partner.id ? 'text-white/60' : 'text-slate-500'}`}>
                                            {chat.lastMessage?.content || 'Initial connection established'}
                                        </p>
                                    </div>
                                </div>
                                <div className="shrink-0 text-right ml-2">
                                    <p className={`text-[10px] font-black uppercase tracking-widest ${activeChat?.partner.id === chat.partner.id ? 'text-white/50' : 'text-slate-600'}`}>
                                        {chat.lastMessage ? new Date(chat.lastMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                                    </p>
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Main Chat Area */}
            <Card variant="solid" className="flex-1 flex flex-col p-0 overflow-hidden shadow-2xl border-white/5 !rounded-[3rem]" hover={false}>
                {activeChat ? (
                    <>
                        {/* Chat Header */}
                        <div className="px-8 py-6 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                            <div className="flex items-center gap-5">
                                <div className="relative">
                                    <div className="w-14 h-14 rounded-2xl bg-indigo-600 flex items-center justify-center text-white font-black text-xl border border-white/10 shadow-lg">
                                        {activeChat.partner.profile?.firstName?.[0] || activeChat.partner.email[0]}
                                    </div>
                                    <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-[#131c31] ${activeChat.partner.isActive ? 'bg-emerald-500' : 'bg-slate-600'}`} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white tracking-tight">
                                        {activeChat.partner.profile ? `${activeChat.partner.profile.firstName} ${activeChat.partner.profile.lastName}` : activeChat.partner.email}
                                    </h3>
                                    <div className="flex items-center gap-2 mt-0.5">
                                        <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${activeChat.partner.isActive ? 'text-emerald-400' : 'text-slate-500'}`}>
                                            {activeChat.partner.isActive ? 'Active System Node' : 'Node Dormant'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <button className="p-3 text-slate-500 hover:text-white transition-all bg-white/5 rounded-[1.25rem] hover:bg-white/10 active:scale-95">
                                    <Search size={20} />
                                </button>
                                <button className="p-3 text-slate-500 hover:text-white transition-all bg-white/5 rounded-[1.25rem] hover:bg-white/10 active:scale-95">
                                    <MoreHorizontal size={20} />
                                </button>
                            </div>
                        </div>

                        {/* Messages body */}
                        <div className="flex-1 overflow-y-auto p-10 space-y-8 custom-scrollbar bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.03),transparent)]">
                            {messages.map((msg, idx) => {
                                const isMe = msg.senderId !== activeChat.partner.id;
                                const isFirstInGroup = idx === 0 || messages[idx - 1].senderId !== msg.senderId;

                                return (
                                    <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 duration-400`}>
                                        <div className={`max-w-[65%] space-y-2 ${isMe ? 'items-end' : 'items-start'} flex flex-col`}>
                                            <div className={`px-6 py-4 rounded-[2rem] text-[15px] font-medium leading-relaxed shadow-sm
                                                ${isMe
                                                    ? 'bg-indigo-600 text-white rounded-tr-none'
                                                    : 'bg-white/5 text-slate-200 border border-white/5 rounded-tl-none'}
                                            `}>
                                                {msg.content}
                                            </div>
                                            <div className={`flex items-center gap-2 px-3 ${isMe ? 'flex-row-reverse' : ''}`}>
                                                <span className="text-[10px] text-slate-600 font-black uppercase tracking-widest whitespace-nowrap">
                                                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                                {isMe && <CheckCheck size={14} className="text-indigo-400" />}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Input area */}
                        <div className="p-8 border-t border-white/5 bg-white/[0.01]">
                            <form
                                className="flex items-center gap-4 bg-white/5 p-2 rounded-[2.5rem] border border-white/5 focus-within:border-indigo-500/50 focus-within:ring-4 focus-within:ring-indigo-500/10 transition-all duration-300"
                                onSubmit={handleSendMessage}
                            >
                                <div className="flex-1">
                                    <input
                                        placeholder="Synchronize your message..."
                                        className="w-full bg-transparent border-none text-white px-6 py-3 focus:outline-none placeholder:text-slate-600 font-medium"
                                        value={messageText}
                                        onChange={(e) => setMessageText(e.target.value)}
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={!messageText.trim()}
                                    className="h-14 w-14 flex items-center justify-center rounded-[2rem] bg-indigo-600 text-white hover:bg-indigo-500 transition-all shadow-lg active:scale-90 disabled:opacity-50 disabled:scale-100"
                                >
                                    <Send size={22} className="translate-x-0.5 -translate-y-0.5 rotate-[-20deg]" />
                                </button>
                            </form>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-slate-500 space-y-6">
                        <div className="w-32 h-32 rounded-[3.5rem] bg-white/5 flex items-center justify-center border border-white/5 shadow-inner">
                            <MessageSquare size={56} className="opacity-20 animate-float" />
                        </div>
                        <div className="text-center space-y-2">
                            <h3 className="text-2xl font-black text-white tracking-tight">Encrypted Channel</h3>
                            <p className="max-w-xs mx-auto text-sm font-medium leading-relaxed">
                                Select an active system node from the directory to initialize communication.
                            </p>
                        </div>
                    </div>
                )}
            </Card>

            {/* New Chat Modal */}
            <Modal
                isOpen={showNewChatModal}
                onClose={() => setShowNewChatModal(false)}
                title="Initialize Connection"
                maxWidth="sm"
            >
                <div className="space-y-6">
                    <div className="relative">
                        <Input placeholder="Search personnel..." icon={<Search size={18} />} className="bg-white/5 border-white/5 !rounded-2xl" />
                    </div>

                    <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                        {fetchingUsers ? (
                            <div className="flex items-center justify-center py-10 text-indigo-400">
                                <Loader2 className="w-10 h-10 animate-spin" />
                            </div>
                        ) : availableUsers.length > 0 ? (
                            availableUsers.map(u => (
                                <button
                                    key={u.id}
                                    onClick={() => {
                                        setActiveChat({ partner: u });
                                        setShowNewChatModal(false);
                                    }}
                                    className="w-full flex items-center gap-5 p-4 rounded-3xl bg-white/5 border border-white/5 hover:border-indigo-500/50 hover:bg-white/10 transition-all text-left group"
                                >
                                    <div className="w-14 h-14 rounded-2xl bg-indigo-600/10 flex items-center justify-center text-indigo-400 font-black text-lg border border-indigo-500/20 shadow-inner group-hover:scale-110 transition-transform">
                                        {u.profile?.firstName?.[0] || u.email[0].toUpperCase()}
                                    </div>
                                    <div>
                                        <p className="text-base font-bold text-white tracking-tight">
                                            {u.profile ? `${u.profile.firstName} ${u.profile.lastName}` : u.email}
                                        </p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="w-1.5 h-1.5 rounded-full bg-slate-500" />
                                            <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest">{u.role} Node</span>
                                        </div>
                                    </div>
                                    <ChevronRight size={18} className="ml-auto text-slate-700 group-hover:text-indigo-400 transition-colors" />
                                </button>
                            ))
                        ) : (
                            <div className="text-center py-10 text-slate-600 font-bold uppercase tracking-widest text-xs">
                                No active nodes found
                            </div>
                        )}
                    </div>

                    <Button variant="secondary" className="w-full" onClick={() => setShowNewChatModal(false)}>
                        Cancel Inquiry
                    </Button>
                </div>
            </Modal>
        </div>
    );
};

export default Messages;
