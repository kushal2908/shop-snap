'use client';

import { CheckCircle2, Download, Loader2, Trash2, XCircle, Eye, Paintbrush } from 'lucide-react';
import Badge from '@/components/shared/Badge';
import FileBadge, { getFileType } from '@/components/upload/FileBadge';
import type { ImageItem } from '@/lib/types';

interface ImageCardProps {
    item: ImageItem;
    onRemove: (id: string) => void;
    onDownloadSingle: (item: ImageItem) => void;
    onPreview: (item: ImageItem) => void;
    watermarkApplied: boolean;
}

export default function ImageCard({ item, onRemove, onDownloadSingle, onPreview, watermarkApplied }: ImageCardProps) {
    const statusLabel = item.status === 'ready' ? 'Done' : item.status === 'processing' ? 'Processing' : item.status === 'error' ? 'Failed' : 'Pending';
    const displaySrc = item.status === 'ready' && item.outputUrl ? item.outputUrl : item.preview;

    return (
        <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:shadow-md">
            <div className="relative h-44 overflow-hidden bg-slate-100">
                <img src={displaySrc} alt={item.name} className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 transition group-hover:opacity-100" />
                <div className="absolute right-2 top-2 flex gap-1.5">
                    <button
                        type="button"
                        onClick={() => onRemove(item.id)}
                        className="rounded-full bg-white/90 p-1.5 text-slate-600 shadow-sm transition hover:bg-rose-50 hover:text-rose-600"
                        aria-label="Remove"
                    >
                        <Trash2 className="h-3.5 w-3.5" />
                    </button>
                </div>
                <div className="absolute bottom-2 left-2">
                    <FileBadge type={getFileType(item.name)} />
                </div>
                {item.status === 'ready' && (
                    <>
                        {watermarkApplied && (
                            <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-sky-600/90 px-2 py-0.5 text-[10px] font-semibold text-white">
                                <Paintbrush className="h-3 w-3" />
                                Watermarked
                            </span>
                        )}
                        <button
                            type="button"
                            onClick={() => onPreview(item)}
                            className="absolute bottom-2 right-2 rounded-full bg-white/90 p-1.5 text-slate-600 shadow-sm transition hover:bg-white"
                            aria-label="Preview"
                        >
                            <Eye className="h-3.5 w-3.5" />
                        </button>
                    </>
                )}
            </div>
            <div className="space-y-2 p-3">
                <div className="flex items-center justify-between gap-2">
                    <p className="truncate text-xs font-medium text-slate-700">{item.name}</p>
                    <Badge
                        variant={
                            item.status === 'ready' ? 'success' : item.status === 'processing' ? 'processing' : item.status === 'error' ? 'error' : 'pending'
                        }
                    >
                        {statusLabel}
                    </Badge>
                </div>
                {item.status === 'processing' && (
                    <div className="flex items-center gap-2 text-slate-500">
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        <span className="text-xs">Processing&hellip;</span>
                    </div>
                )}
                {item.status === 'ready' && (
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-emerald-600">
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            <span className="text-xs font-medium">Ready</span>
                        </div>
                        <button
                            type="button"
                            onClick={() => onDownloadSingle(item)}
                            className="inline-flex items-center gap-1 rounded-full bg-sky-50 px-2.5 py-1 text-[11px] font-semibold text-sky-700 transition hover:bg-sky-100"
                        >
                            <Download className="h-3 w-3" />
                            Save
                        </button>
                    </div>
                )}
                {item.status === 'error' && (
                    <div className="flex items-center gap-1.5 text-rose-600">
                        <XCircle className="h-3.5 w-3.5" />
                        <span className="text-xs">{item.error ?? 'Failed'}</span>
                    </div>
                )}
            </div>
        </div>
    );
}
