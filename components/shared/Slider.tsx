'use client';

interface SliderProps {
    min: number;
    max: number;
    step?: number;
    value: number;
    onChange: (value: number) => void;
    label?: string;
    description?: string;
    suffix?: string;
    disabled?: boolean;
}

export default function Slider({ min, max, step = 1, value, onChange, label, description, suffix = '%', disabled }: SliderProps) {
    return (
        <div>
            <div className="flex items-center justify-between gap-4">
                <div>
                    {label && <p className="text-sm font-semibold text-slate-900">{label}</p>}
                    {description && <p className="mt-1 text-sm text-slate-500">{description}</p>}
                </div>
                <span className="shrink-0 rounded-full bg-white px-3 py-1 text-sm font-semibold text-slate-900 shadow-sm">
                    {value}{suffix}
                </span>
            </div>
            <input
                type="range"
                min={min}
                max={max}
                step={step}
                value={value}
                onChange={(e) => onChange(Number(e.target.value))}
                disabled={disabled}
                className="mt-4 w-full accent-sky-600 disabled:opacity-60"
            />
        </div>
    );
}
