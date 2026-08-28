'use client';

import { saveAs } from 'file-saver';
import JSZip from 'jszip';
import { Download } from 'lucide-react';
import type { ImageItem } from '@/lib/types';

interface DownloadButtonProps {
    items: ImageItem[];
    onBusyChange: (message: string) => void;
}

export async function downloadSingleImage(item: ImageItem) {
    if (!item.blob) return;
    saveAs(item.blob, item.name);
}

export default function DownloadButton({ items, onBusyChange }: DownloadButtonProps) {
    const readyItems = items.filter((item) => item.status === 'ready' && item.blob);
    const disabled = readyItems.length === 0;

    const handleDownload = async () => {
        if (disabled) return;
        onBusyChange('Building ZIP file…');
        const zip = new JSZip();
        readyItems.forEach((item) => {
            if (item.blob) zip.file(item.name, item.blob);
        });
        const blob = await zip.generateAsync({ type: 'blob' });
        saveAs(blob, 'shop-snap-optimized.zip');
        onBusyChange('');
    };

    return (
        <button
            type="button"
            onClick={handleDownload}
            disabled={disabled}
            className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-sky-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
            <Download className="h-4 w-4" />
            Download ZIP ({readyItems.length})
        </button>
    );
}
