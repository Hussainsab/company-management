import React from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success';
    size?: 'sm' | 'md' | 'lg' | 'xl';
    isLoading?: boolean;
    icon?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
    children,
    className = '',
    variant = 'primary',
    size = 'md',
    isLoading = false,
    icon,
    disabled,
    ...props
}) => {
    const variants = {
        primary: 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20 hover:bg-indigo-500 hover:scale-[1.02] active:scale-[0.98]',
        secondary: 'bg-white/10 text-white border border-white/10 hover:bg-white/20',
        outline: 'bg-transparent text-white border-2 border-indigo-500/30 hover:border-indigo-500/60 hover:bg-indigo-500/5',
        ghost: 'bg-transparent text-slate-400 hover:text-white hover:bg-white/5',
        danger: 'bg-rose-500/10 text-rose-500 border border-rose-500/20 hover:bg-rose-500 hover:text-white',
        success: 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 hover:bg-emerald-500 hover:text-white',
    };

    const sizes = {
        sm: 'px-5 py-2.5 text-[10px] font-black uppercase tracking-widest',
        md: 'px-8 py-4 text-xs font-black uppercase tracking-widest',
        lg: 'px-10 py-5 text-sm font-black uppercase tracking-widest',
        xl: 'px-12 py-6 text-base font-black uppercase tracking-widest',
    };

    return (
        <button
            className={`
                relative inline-flex items-center justify-center gap-3 rounded-[1.5rem] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed
                ${variants[variant]}
                ${sizes[size]}
                ${className}
            `}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
            {!isLoading && icon && <span className="opacity-80 group-hover:scale-110 transition-transform">{icon}</span>}
            <span className="relative z-10">{children}</span>
        </button>
    );
};

export default Button;
