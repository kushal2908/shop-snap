import { FileImage, FileType } from 'lucide-react';

interface FileBadgeProps {
    type: 'heic' | 'jpg' | 'png' | 'unknown';
}

const labels: Record<FileBadgeProps['type'], { icon: typeof FileImage; text: string; color: string }> = {
    heic: { icon: FileType, text: 'HEIC', color: 'bg-violet-100 text-violet-700' },
    jpg: { icon: FileImage, text: 'JPG', color: 'bg-sky-100 text-sky-700' },
    png: { icon: FileImage, text: 'PNG', color: 'bg-amber-100 text-amber-700' },
    unknown: { icon: FileImage, text: '?', color: 'bg-slate-100 text-slate-600' },
};

export function getFileType(fileName: string): FileBadgeProps['type'] {
    const ext = fileName.split('.').pop()?.toLowerCase();
    if (ext === 'heic' || ext === 'heif') return 'heic';
    if (ext === 'jpg' || ext === 'jpeg') return 'jpg';
    if (ext === 'png') return 'png';
    return 'unknown';
}

export default function FileBadge({ type }: FileBadgeProps) {
    const { icon: Icon, text, color } = labels[type];
    return (
        <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${color}`}>
            <Icon className="h-3 w-3" />
            {text}
        </span>
    );
}
