import React from 'react';

interface CardProps {
    children: React.ReactNode;
    className?: string;
    title?: string;
    subtitle?: string;
    variant?: 'glass' | 'solid' | 'outline';
    hover?: boolean;
    onClick?: () => void;
}

const Card: React.FC<CardProps> = ({
    children,
    className = '',
    title,
    subtitle,
    variant = 'glass',
    hover = false,
    onClick
}) => {
    const variants = {
        glass: 'bg-white/[0.03] backdrop-blur-xl border-white/5 shadow-2xl',
        solid: 'bg-[#0f172a] border-white/5 shadow-xl',
        outline: 'bg-transparent border-white/10'
    };

    return (
        <div
            onClick={onClick}
            className={`
                p-8 rounded-[2.5rem] border transition-all duration-500
                ${variants[variant]}
                ${hover ? 'hover:border-indigo-500/30 hover:bg-white/[0.05] cursor-pointer' : ''}
                ${className}
            `}
        >
            {(title || subtitle) && (
                <div className="mb-8">
                    {title && <h3 className="text-2xl font-black text-white tracking-tight leading-none mb-2">{title}</h3>}
                    {subtitle && <p className="text-slate-500 text-sm font-medium tracking-tight">{subtitle}</p>}
                </div>
            )}
            {children}
        </div>
    );
};

export default Card;
