import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import Card from './Card';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: React.ReactNode;
    maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '4xl';
    className?: string;
}

const Modal: React.FC<ModalProps> = ({
    isOpen,
    onClose,
    title,
    children,
    maxWidth = 'md',
    className = ''
}) => {
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            window.addEventListener('keydown', handleEscape);
        }
        return () => {
            document.body.style.overflow = 'unset';
            window.removeEventListener('keydown', handleEscape);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const maxWidthClasses = {
        sm: 'max-w-sm',
        md: 'max-w-md',
        lg: 'max-w-lg',
        xl: 'max-w-xl',
        '2xl': 'max-w-2xl',
        '4xl': 'max-w-4xl',
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 md:p-10 overflow-y-auto">
            {/* Backdrop with enhanced blur */}
            <div
                className="fixed inset-0 bg-[#0a0f1d]/80 backdrop-blur-xl animate-in fade-in duration-500"
                onClick={onClose}
            />

            <div
                className={`w-full ${maxWidthClasses[maxWidth]} relative z-10 animate-in zoom-in-95 fade-in duration-300 ${className}`}
                onClick={(e) => e.stopPropagation()}
            >
                <Card variant="solid" hover={false} className="shadow-[0_32px_64px_-15px_rgba(0,0,0,0.6)] border-white/10 !rounded-[2.5rem]">
                    <div className="flex justify-between items-center mb-8">
                        <div className="flex items-center gap-3">
                            <div className="w-1.5 h-6 bg-indigo-500 rounded-full" />
                            <h2 className="text-2xl font-black text-white tracking-tight">{title || 'Modal Title'}</h2>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-slate-500 hover:text-white transition-all p-2 hover:bg-white/5 rounded-2xl active:scale-90"
                        >
                            <X size={24} strokeWidth={2.5} />
                        </button>
                    </div>

                    <div className="relative">
                        {children}
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default Modal;
