import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    icon?: React.ReactNode;
    error?: string;
}

const Input: React.FC<InputProps> = ({
    label,
    icon,
    error,
    className = '',
    ...props
}) => {
    return (
        <div className="space-y-3 w-full group">
            {label && (
                <label className="block text-[11px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1 transition-colors group-focus-within:text-indigo-400">
                    {label}
                </label>
            )}
            <div className="relative">
                {icon && (
                    <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none text-slate-500 group-focus-within:text-indigo-400 transition-colors">
                        {React.cloneElement(icon as React.ReactElement<any>, { size: 18 })}
                    </div>
                )}
                <input
                    className={`
                        w-full bg-white/[0.03] border border-white/5 rounded-[1.8rem] px-6 py-4.5 text-white placeholder:text-slate-600 
                        focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500/40 transition-all font-medium
                        ${icon ? 'pl-16' : ''}
                        ${error ? 'border-rose-500/50 focus:border-rose-500 focus:ring-rose-500/10' : ''}
                        ${className}
                    `}
                    {...props}
                />
            </div>
            {error && <p className="text-rose-500 text-[10px] font-bold uppercase tracking-widest ml-1">{error}</p>}
        </div>
    );
};

export default Input;
