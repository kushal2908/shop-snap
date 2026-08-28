'use client';

import { useEffect, useRef, useState } from 'react';
import { overlayWatermark, type WatermarkPosition } from '@/lib/watermarkEngine';

interface WatermarkPreviewProps {
    logoDataUrl: string | null;
    enabled: boolean;
    position: WatermarkPosition;
    opacity: number;
    scale: number;
}

const SAMPLE_SRC =
    'data:image/svg+xml;base64,' +
    btoa(
        `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="480">
            <defs>
                <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stop-color="#93c5fd"/>
                    <stop offset="100%" stop-color="#a5b4fc"/>
                </linearGradient>
            </defs>
            <rect width="640" height="480" fill="url(#g)"/>
            <circle cx="200" cy="150" r="60" fill="#ffffff" opacity="0.8"/>
            <circle cx="450" cy="300" r="90" fill="#ffffff" opacity="0.6"/>
            <rect x="80" y="360" width="480" height="20" rx="10" fill="#ffffff" opacity="0.5"/>
        </svg>`,
    );

export default function WatermarkPreview({ logoDataUrl, enabled, position, opacity, scale }: WatermarkPreviewProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [overlayUrl, setOverlayUrl] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;

        const render = async () => {
            const canvas = canvasRef.current;
            if (!canvas) return;

            const ctx = canvas.getContext('2d');
            if (!ctx) return;

            const img = new Image();
            img.onload = () => {
                if (cancelled) return;
                canvas.width = 640;
                canvas.height = 480;
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

                if (enabled && logoDataUrl) {
                    // Render watermark onto a copy of the base preview and capture it
                    overlayWatermark(canvas, logoDataUrl, {
                        opacity,
                        scale,
                        position,
                        margin: 16,
                    }).then(() => {
                        if (!cancelled) setOverlayUrl(canvas.toDataURL('image/png'));
                    });
                } else {
                    if (!cancelled) setOverlayUrl(null);
                }
            };
            img.src = SAMPLE_SRC;
        };

        render();

        return () => {
            cancelled = true;
        };
    }, [logoDataUrl, enabled, position, opacity, scale]);

    return (
        <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Preview</p>
            <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
                <canvas ref={canvasRef} className="hidden" />
                {overlayUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={overlayUrl} alt="Watermark preview" className="block h-auto w-full" />
                ) : logoDataUrl ? (
                    <div className="flex h-40 items-center justify-center text-xs text-slate-400">
                        {enabled ? 'Rendering preview…' : 'Watermark is off'}
                    </div>
                ) : (
                    <div className="flex h-40 items-center justify-center px-6 text-center text-xs text-slate-400">
                        Upload a logo to preview how your watermark will look
                    </div>
                )}
            </div>
        </div>
    );
}
