'use client';

import { type DragEvent } from 'react';
import { UploadCloud } from 'lucide-react';

const supportedTypes = ['image/jpeg', 'image/png', 'image/heic', 'image/heif'];

interface DropZoneProps {
    onFiles: (files: File[]) => void;
}

export default function DropZone({ onFiles }: DropZoneProps) {
    const handleDrop = async (event: DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
        if (event.dataTransfer.files.length > 0) {
            const incoming = Array.from(event.dataTransfer.files).filter(
                (file) => supportedTypes.includes(file.type) || /\.(heic|heif)$/i.test(file.name)
            );
            if (incoming.length > 0) onFiles(incoming);
        }
    };

    const handleBrowse = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            const incoming = Array.from(event.target.files).filter(
                (file) => supportedTypes.includes(file.type) || /\.(heic|heif)$/i.test(file.name)
            );
            if (incoming.length > 0) onFiles(incoming);
            event.target.value = '';
        }
    };

    return (
        <div
            className="group relative rounded-3xl border-2 border-dashed border-slate-300 bg-white/80 px-6 py-12 text-center transition hover:border-sky-400 hover:bg-sky-50/30"
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
        >
            <UploadCloud className="mx-auto h-12 w-12 text-slate-400 transition group-hover:text-sky-500" />
            <div className="mt-6 space-y-3">
                <p className="text-lg font-semibold text-slate-900">Drop your product photos here</p>
                <p className="text-sm text-slate-500">
                    JPG, PNG, HEIC supported &mdash; auto-converted &amp; resized to 1080px
                </p>
                <label className="inline-flex cursor-pointer items-center justify-center rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800">
                    Browse files
                    <input type="file" accept="image/*" multiple className="sr-only" onChange={handleBrowse} />
                </label>
            </div>
        </div>
    );
}
