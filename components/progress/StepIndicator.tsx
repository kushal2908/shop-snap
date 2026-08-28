'use client';

import { Upload, Settings2, Download, Check } from 'lucide-react';

export type Step = 'upload' | 'configure' | 'download';

interface StepIndicatorProps {
    current: Step;
    hasItems: boolean;
    hasReadyItems: boolean;
}

const steps: { id: Step; label: string; icon: typeof Upload }[] = [
    { id: 'upload', label: 'Upload', icon: Upload },
    { id: 'configure', label: 'Configure', icon: Settings2 },
    { id: 'download', label: 'Download', icon: Download },
];

export default function StepIndicator({ current, hasItems, hasReadyItems }: StepIndicatorProps) {
    return (
        <div className="flex items-center justify-center gap-2 sm:gap-4">
            {steps.map((step, index) => {
                // Determine if this step is "done"
                const isDone =
                    (step.id === 'upload' && hasItems) ||
                    (step.id === 'configure' && hasReadyItems);

                const isActive = current === step.id;
                const Icon = step.icon;

                return (
                    <div key={step.id} className="flex items-center gap-2 sm:gap-4">
                        <div className="flex flex-col items-center gap-1">
                            <div
                                className={`flex h-9 w-9 items-center justify-center rounded-full border-2 transition ${
                                    isDone
                                        ? 'border-emerald-500 bg-emerald-500 text-white'
                                        : isActive
                                          ? 'border-sky-600 bg-sky-600 text-white'
                                          : 'border-slate-200 bg-white text-slate-400'
                                }`}
                            >
                                {isDone && step.id !== 'download' ? <Check className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
                            </div>
                            <span
                                className={`text-[11px] font-semibold ${
                                    isActive ? 'text-sky-700' : isDone ? 'text-emerald-600' : 'text-slate-400'
                                }`}
                            >
                                {step.label}
                            </span>
                        </div>
                        {index < steps.length - 1 && <div className="h-px w-6 bg-slate-200 sm:w-12" />}
                    </div>
                );
            })}
        </div>
    );
}
