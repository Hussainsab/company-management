import React from 'react';
import Modal from './Modal';
import Button from './Button';
import { AlertTriangle, Info, CheckCircle2, AlertCircle } from 'lucide-react';

interface ConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    variant?: 'danger' | 'warning' | 'info' | 'success';
    isAlert?: boolean;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    variant = 'info',
    isAlert = false
}) => {
    const getIcon = () => {
        switch (variant) {
            case 'danger': return <AlertCircle className="text-rose-500" size={36} strokeWidth={2.5} />;
            case 'warning': return <AlertTriangle className="text-amber-500" size={36} strokeWidth={2.5} />;
            case 'success': return <CheckCircle2 className="text-emerald-500" size={36} strokeWidth={2.5} />;
            default: return <Info className="text-indigo-500" size={36} strokeWidth={2.5} />;
        }
    };

    const getConfirmVariant = () => {
        if (variant === 'danger') return 'danger';
        if (variant === 'success') return 'success';
        return 'primary';
    };

    const getAccentColor = () => {
        switch (variant) {
            case 'danger': return 'rose';
            case 'warning': return 'amber';
            case 'success': return 'emerald';
            default: return 'indigo';
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="sm">
            <div className="flex flex-col items-center text-center space-y-6">
                <div className={`w-20 h-20 rounded-[2rem] bg-${getAccentColor()}-500/10 border border-${getAccentColor()}-500/20 flex items-center justify-center shadow-inner`}>
                    {getIcon()}
                </div>

                <div className="space-y-2">
                    <p className="text-slate-300 font-medium text-lg leading-relaxed px-2">
                        {message}
                    </p>
                </div>

                <div className="flex gap-4 w-full pt-4">
                    {!isAlert && (
                        <Button
                            variant="secondary"
                            className="flex-1 !rounded-2xl"
                            onClick={onClose}
                        >
                            {cancelText}
                        </Button>
                    )}
                    <Button
                        variant={getConfirmVariant()}
                        className="flex-1 !rounded-2xl shadow-xl"
                        onClick={() => {
                            onConfirm();
                            if (isAlert) onClose();
                        }}
                    >
                        {confirmText}
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

export default ConfirmModal;
