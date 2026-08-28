import { ImagePlus } from 'lucide-react';

export default function EmptyState() {
    return (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50/50 p-12 text-center">
            <ImagePlus className="mx-auto h-10 w-10 text-slate-400" />
            <p className="mt-4 text-sm font-medium text-slate-600">No files uploaded yet</p>
            <p className="mt-1 text-xs text-slate-400">Drop photos above to get started</p>
        </div>
    );
}
