'use client';

import { Loader2 } from 'lucide-react';

interface BatchProgressBarProps {
    total: number;
    completed: number;
    errors: number;
}

export default function BatchProgressBar({ total, completed, errors }: BatchProgressBarProps) {
    if (total === 0) return null;

    const percent = total > 0 ? Math.round(((completed + errors) / total) * 100) : 0;
    const isActive = completed + errors < total;

    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 text-slate-700">
                    {isActive && <Loader2 className="h-3.5 w-3.5 animate-spin text-sky-500" />}
                    <span className="font-medium">
                        {isActive ? 'Processing…' : 'Complete'}
                    </span>
                </div>
                <span className="text-slate-500">
                    {completed}/{total} done
                    {errors > 0 && <span className="ml-1 text-rose-500">({errors} failed)</span>}
                </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-slate-200">
                <div
                    className={`h-full rounded-full transition-all duration-300 ${
                        errors > 0 ? 'bg-sky-500' : 'bg-sky-500'
                    }`}
                    style={{ width: `${percent}%` }}
                />
            </div>
        </div>
    );
}
