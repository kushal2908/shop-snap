'use client';

interface ToggleProps {
    enabled: boolean;
    onChange: (enabled: boolean) => void;
    label?: string;
    description?: string;
    disabled?: boolean;
}

export default function Toggle({ enabled, onChange, label, description, disabled }: ToggleProps) {
    return (
        <div className="flex items-center justify-between gap-3">
            {(label || description) && (
                <div>
                    {label && <p className="text-sm font-semibold text-slate-900">{label}</p>}
                    {description && <p className="mt-1 text-sm text-slate-500">{description}</p>}
                </div>
            )}
            <button
                type="button"
                role="switch"
                aria-checked={enabled}
                disabled={disabled}
                className={`inline-flex h-10 w-20 shrink-0 items-center rounded-full p-1 transition ${
                    enabled ? 'bg-sky-600' : 'bg-slate-300'
                } ${disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}
                onClick={() => onChange(!enabled)}
            >
                <span
                    className={`h-8 w-8 rounded-full bg-white shadow-sm transition-transform ${
                        enabled ? 'translate-x-5' : 'translate-x-0'
                    }`}
                />
            </button>
        </div>
    );
}
