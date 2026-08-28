'use client';

import { ImagePlus } from 'lucide-react';
import Slider from '@/components/shared/Slider';
import Toggle from '@/components/shared/Toggle';
import LogoUploader from './LogoUploader';
import WatermarkPreview from './WatermarkPreview';
import PositionPicker from './PositionPicker';
import type { WatermarkPosition } from '@/lib/watermarkEngine';

interface SettingsPanelProps {
    logoPreview: string | null;
    onLogoUpload: (file: File) => void;
    watermarkEnabled: boolean;
    onWatermarkToggle: (enabled: boolean) => void;
    position: WatermarkPosition;
    onPositionChange: (position: WatermarkPosition) => void;
    opacity: number;
    onOpacityChange: (opacity: number) => void;
    size: number;
    onSizeChange: (size: number) => void;
    quality: number;
    onQualityChange: (quality: number) => void;
    onReprocessAll: () => void;
    canReprocess: boolean;
    isProcessing: boolean;
}

export default function SettingsPanel({
    logoPreview,
    onLogoUpload,
    watermarkEnabled,
    onWatermarkToggle,
    position,
    onPositionChange,
    opacity,
    onOpacityChange,
    size,
    onSizeChange,
    quality,
    onQualityChange,
    onReprocessAll,
    canReprocess,
    isProcessing,
}: SettingsPanelProps) {
    return (
        <div className="space-y-4">
            {/* Live watermark preview */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-4">
                <WatermarkPreview
                    logoDataUrl={logoPreview}
                    enabled={watermarkEnabled}
                    position={position}
                    opacity={opacity}
                    scale={size / 100}
                />
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-4">
                <LogoUploader logoPreview={logoPreview} onUpload={onLogoUpload} />
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-4">
                <Toggle
                    enabled={watermarkEnabled}
                    onChange={onWatermarkToggle}
                    label="Watermark"
                    description="Add your logo to each image"
                />
            </div>

            {/* Watermark position */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-4">
                <p className="mb-3 text-sm font-semibold text-slate-900">Position</p>
                <PositionPicker value={position} onChange={onPositionChange} />
            </div>

            {/* Watermark size */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-4">
                <Slider
                    min={10}
                    max={60}
                    value={size}
                    onChange={onSizeChange}
                    label="Watermark size"
                    description="Larger is more visible"
                    suffix="%"
                />
            </div>

            {/* Watermark opacity */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-4">
                <Slider
                    min={10}
                    max={100}
                    value={opacity}
                    onChange={onOpacityChange}
                    label="Watermark opacity"
                    description="Higher is more solid"
                    suffix="%"
                />
            </div>

            {/* Compression quality */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-4">
                <Slider
                    min={50}
                    max={100}
                    value={quality}
                    onChange={onQualityChange}
                    label="Compression quality"
                    description="80–92 recommended for Facebook"
                />
            </div>

            <button
                type="button"
                onClick={onReprocessAll}
                disabled={!canReprocess || isProcessing}
                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
                <ImagePlus className="h-4 w-4" />
                {isProcessing ? 'Reprocessing…' : 'Reprocess all'}
            </button>
        </div>
    );
}
