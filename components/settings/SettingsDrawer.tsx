'use client';

import { X } from 'lucide-react';
import SettingsPanel from './SettingsPanel';
import type { WatermarkPosition } from '@/lib/watermarkEngine';

interface SettingsDrawerProps {
    open: boolean;
    onClose: () => void;
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

export default function SettingsDrawer({
    open,
    onClose,
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
}: SettingsDrawerProps) {
    return (
        <div className={`fixed inset-0 z-40 transition lg:hidden ${open ? 'visible' : 'invisible pointer-events-none'}`}>
            <div
                className={`absolute inset-0 bg-black/50 transition-opacity ${open ? 'opacity-100' : 'opacity-0'}`}
                onClick={onClose}
            />
            <div
                className={`absolute inset-x-0 bottom-0 max-h-[85vh] overflow-y-auto rounded-t-3xl bg-white p-5 shadow-2xl transition-transform duration-300 ${
                    open ? 'translate-y-0' : 'translate-y-full'
                }`}
            >
                <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-slate-200" />
                <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-slate-900">Settings</h3>
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-full p-2 text-slate-500 transition hover:bg-slate-100"
                        aria-label="Close settings"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>
                <SettingsPanel
                    logoPreview={logoPreview}
                    onLogoUpload={onLogoUpload}
                    watermarkEnabled={watermarkEnabled}
                    onWatermarkToggle={onWatermarkToggle}
                    position={position}
                    onPositionChange={onPositionChange}
                    opacity={opacity}
                    onOpacityChange={onOpacityChange}
                    size={size}
                    onSizeChange={onSizeChange}
                    quality={quality}
                    onQualityChange={onQualityChange}
                    onReprocessAll={onReprocessAll}
                    canReprocess={canReprocess}
                    isProcessing={isProcessing}
                />
                <button
                    type="button"
                    onClick={onClose}
                    className="mt-4 inline-flex w-full items-center justify-center rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white"
                >
                    Done
                </button>
            </div>
        </div>
    );
}
