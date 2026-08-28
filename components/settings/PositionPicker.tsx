'use client';

import { Check } from 'lucide-react';
import type { WatermarkPosition } from '@/lib/watermarkEngine';

interface PositionPickerProps {
    value: WatermarkPosition;
    onChange: (position: WatermarkPosition) => void;
}

const positions: WatermarkPosition[] = ['tl', 'tc', 'tr', 'lc', 'c', 'rc', 'bl', 'bc', 'br'];

const positionAria: Record<WatermarkPosition, string> = {
    tl: 'Top left',
    tc: 'Top center',
    tr: 'Top right',
    lc: 'Middle left',
    c: 'Center',
    rc: 'Middle right',
    bl: 'Bottom left',
    bc: 'Bottom center',
    br: 'Bottom right',
};

export default function PositionPicker({ value, onChange }: PositionPickerProps) {
    return (
        <div className="grid grid-cols-3 gap-1.5">
            {positions.map((pos) => {
                const selected = value === pos;
                return (
                    <button
                        key={pos}
                        type="button"
                        onClick={() => onChange(pos)}
                        title={positionAria[pos]}
                        aria-label={positionAria[pos]}
                        className={`flex h-9 items-center justify-center rounded-lg border transition ${
                            selected
                                ? 'border-sky-500 bg-sky-50 text-sky-600'
                                : 'border-slate-200 bg-white text-slate-400 hover:border-slate-300'
                        }`}
                    >
                        {selected ? <Check className="h-4 w-4" /> : <span className="h-2 w-2 rounded-full bg-current" />}
                    </button>
                );
            })}
        </div>
    );
}
