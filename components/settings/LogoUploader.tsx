'use client';

interface LogoUploaderProps {
    logoPreview: string | null;
    onUpload: (file: File) => void;
}

export default function LogoUploader({ logoPreview, onUpload }: LogoUploaderProps) {
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) onUpload(file);
    };

    return (
        <div>
            <p className="text-sm font-semibold text-slate-900">Shop logo</p>
            <p className="mt-1 text-xs text-slate-500">Applied as a watermark to every image</p>
            <div className="mt-3 flex items-center gap-3">
                <div className="h-16 w-16 overflow-hidden rounded-xl bg-white shadow-sm">
                    {logoPreview ? (
                        <img src={logoPreview} alt="Logo preview" className="h-full w-full object-contain p-1.5" />
                    ) : (
                        <div className="flex h-full w-full items-center justify-center text-[10px] font-medium text-slate-400">
                            Logo
                        </div>
                    )}
                </div>
                <label className="inline-flex cursor-pointer items-center rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-slate-800">
                    {logoPreview ? 'Change' : 'Upload logo'}
                    <input type="file" accept="image/*" className="sr-only" onChange={handleChange} />
                </label>
            </div>
        </div>
    );
}
