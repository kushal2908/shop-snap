'use client';

import { X } from 'lucide-react';

interface PreviewModalProps {
    imageUrl: string;
    onClose: () => void;
}

export default function PreviewModal({ imageUrl, onClose }: PreviewModalProps) {
    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
            onClick={onClose}
        >
            <div className="relative max-h-[90vh] max-w-3xl overflow-hidden rounded-2xl bg-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
                <button
                    type="button"
                    onClick={onClose}
                    className="absolute right-3 top-3 rounded-full bg-black/60 p-2 text-white transition hover:bg-black/80"
                    aria-label="Close preview"
                >
                    <X className="h-4 w-4" />
                </button>
                <img src={imageUrl} alt="Preview" className="max-h-[80vh] w-auto object-contain" />
            </div>
        </div>
    );
}
