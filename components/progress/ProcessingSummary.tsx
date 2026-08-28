'use client';

import { TrendingDown } from 'lucide-react';
import type { ImageItem } from '@/lib/types';

interface ProcessingSummaryProps {
    items: ImageItem[];
}

export default function ProcessingSummary({ items }: ProcessingSummaryProps) {
    const readyItems = items.filter((item) => item.status === 'ready');
    if (readyItems.length === 0) return null;

    const totalOriginal = items.reduce((sum, item) => sum + item.file.size, 0);
    const totalCompressed = readyItems.reduce((sum, item) => sum + (item.blob?.size ?? 0), 0);
    const savedBytes = totalOriginal - totalCompressed;
    const savedPercent = totalOriginal > 0 ? Math.round((savedBytes / totalOriginal) * 100) : 0;

    if (savedPercent <= 0) return null;

    return (
        <div className="flex items-center gap-3 rounded-2xl bg-emerald-50 px-4 py-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-100">
                <TrendingDown className="h-4 w-4 text-emerald-600" />
            </div>
            <div>
                <p className="text-sm font-semibold text-emerald-800">
                    {savedPercent}% smaller overall
                </p>
                <p className="text-xs text-emerald-600">
                    {formatSize(totalOriginal)} &rarr; {formatSize(totalCompressed)} saved
                </p>
            </div>
        </div>
    );
}

function formatSize(bytes: number): string {
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
