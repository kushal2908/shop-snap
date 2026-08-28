interface BadgeProps {
    variant: 'success' | 'processing' | 'error' | 'pending' | 'neutral';
    children: React.ReactNode;
}

const variantStyles: Record<BadgeProps['variant'], string> = {
    success: 'bg-emerald-100 text-emerald-700',
    processing: 'bg-sky-100 text-sky-700',
    error: 'bg-rose-100 text-rose-700',
    pending: 'bg-slate-100 text-slate-700',
    neutral: 'bg-slate-100 text-slate-700',
};

export default function Badge({ variant, children }: BadgeProps) {
    return (
        <span
            className={`rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] ${
                variantStyles[variant]
            }`}
        >
            {children}
        </span>
    );
}
