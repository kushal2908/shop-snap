'use client';

import { useMemo, useState, type DragEvent } from 'react';
import { CheckCircle2, ChevronDown, Download, ImagePlus, Loader2, SlidersHorizontal, Trash2, UploadCloud } from 'lucide-react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { processImageFile } from '@/lib/imageProcessor';
import Image from 'next/image';

export const dynamic = 'force-dynamic';
export const runtime = 'edge';

type ImageItem = {
    id: string;
    file: File;
    name: string;
    preview: string;
    status: 'pending' | 'processing' | 'ready' | 'error';
    outputUrl?: string;
    blob?: Blob;
    error?: string;
};

const supportedTypes = ['image/jpeg', 'image/png', 'image/heic', 'image/heif'];

const getOutputName = (fileName: string) => `${fileName.replace(/\.[^.]+$/, '')}.jpg`;

export default function Home() {
    const [items, setItems] = useState<ImageItem[]>([]);
    const [logoFile, setLogoFile] = useState<File | null>(null);
    const [logoPreview, setLogoPreview] = useState<string | null>(null);
    const [watermarkEnabled, setWatermarkEnabled] = useState(true);
    const [quality, setQuality] = useState(88);
    const [busyMessage, setBusyMessage] = useState<string>('');

    const completedCount = useMemo(() => items.filter((item) => item.status === 'ready').length, [items]);

    const handleInputFiles = async (files: FileList | File[]) => {
        const incoming = Array.from(files).filter((file) => supportedTypes.includes(file.type) || /\.(heic|heif)$/i.test(file.name));
        if (incoming.length === 0) {
            return;
        }

        const newItems = incoming.map((file) => ({
            id: `${Date.now()}-${file.name}-${Math.random()}`,
            file,
            name: file.name,
            preview: URL.createObjectURL(file),
            status: 'pending' as const,
        }));

        setItems((current) => [...newItems, ...current]);

        const watermarkLogo = logoPreview ?? undefined;
        const useWatermark = watermarkEnabled;
        const qualityRatio = quality / 100;

        await Promise.all(
            newItems.map(async (item) => {
                setItems((current) => current.map((next) => (next.id === item.id ? { ...next, status: 'processing' } : next)));

                try {
                    const blob = await processImageFile(item.file, {
                        maxWidth: 1080,
                        quality: qualityRatio,
                        watermark: useWatermark,
                        logoDataUrl: watermarkLogo,
                    });

                    const outputUrl = URL.createObjectURL(blob);

                    setItems((current) =>
                        current.map((next) =>
                            next.id === item.id
                                ? {
                                      ...next,
                                      status: 'ready',
                                      blob,
                                      outputUrl,
                                      name: getOutputName(item.name),
                                  }
                                : next,
                        ),
                    );
                } catch (error) {
                    setItems((current) =>
                        current.map((next) =>
                            next.id === item.id
                                ? {
                                      ...next,
                                      status: 'error',
                                      error: error instanceof Error ? error.message : 'Processing failed',
                                  }
                                : next,
                        ),
                    );
                }
            }),
        );
    };

    const handleDrop = async (event: DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
        if (event.dataTransfer.files.length > 0) {
            await handleInputFiles(event.dataTransfer.files);
        }
    };

    const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;
        const preview = URL.createObjectURL(file);
        setLogoFile(file);
        setLogoPreview(preview);
    };

    const removeItem = (id: string) => {
        setItems((current) => {
            const candidate = current.find((item) => item.id === id);
            if (candidate?.preview) {
                URL.revokeObjectURL(candidate.preview);
            }
            if (candidate?.outputUrl) {
                URL.revokeObjectURL(candidate.outputUrl);
            }
            return current.filter((item) => item.id !== id);
        });
    };

    const downloadZip = async () => {
        const readyItems = items.filter((item) => item.status === 'ready' && item.blob);
        if (readyItems.length === 0) {
            return;
        }

        setBusyMessage('Building ZIP file...');
        const zip = new JSZip();

        readyItems.forEach((item) => {
            if (item.blob) {
                zip.file(item.name, item.blob);
            }
        });

        const blob = await zip.generateAsync({ type: 'blob' });
        saveAs(blob, 'fb-photos-optimized.zip');
        setBusyMessage('');
    };

    const reprocessAll = async () => {
        setBusyMessage('Re-processing images with current settings...');
        const currentItems = items;
        setItems((current) => current.map((item) => ({ ...item, status: 'processing', error: undefined })));

        const watermarkLogo = logoPreview ?? undefined;
        const useWatermark = watermarkEnabled;
        const qualityRatio = quality / 100;

        await Promise.all(
            currentItems.map(async (item) => {
                if (!item.file) return;
                try {
                    const blob = await processImageFile(item.file, {
                        maxWidth: 1080,
                        quality: qualityRatio,
                        watermark: useWatermark,
                        logoDataUrl: watermarkLogo,
                    });

                    const outputUrl = URL.createObjectURL(blob);
                    setItems((current) =>
                        current.map((next) =>
                            next.id === item.id ? { ...next, status: 'ready', blob, outputUrl, name: getOutputName(item.name) } : next,
                        ),
                    );
                } catch (error) {
                    setItems((current) =>
                        current.map((next) =>
                            next.id === item.id
                                ? {
                                      ...next,
                                      status: 'error',
                                      error: error instanceof Error ? error.message : 'Processing failed',
                                  }
                                : next,
                        ),
                    );
                }
            }),
        );

        setBusyMessage('');
    };

    return (
        <main className="min-h-screen bg-slate-50 px-4 py-6 text-slate-900 sm:px-6 lg:px-10">
            <div className="mx-auto flex max-w-7xl flex-col gap-8">
                <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
                    <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                        <div>
                            <div className="flex items-center gap-4">
                                <Image
                                    src="/logo.png"
                                    alt="F-Commerce Batch Optimizer Logo"
                                    height={60}
                                    width={120}
                                    className="object-contain"
                                />
                                <div>
                                    <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-600">
                                        ShopSnap Photo Optimizer
                                    </p>
                                </div>
                            </div>
                            <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
                                Optimize product photos with your logo.
                            </h1>
                            <p className="mt-3 max-w-2xl text-sm text-slate-600 sm:text-base">
                                Drop JPG, PNG, or HEIC images, convert to optimized JPG, watermark with your shop logo, and download
                                everything as a ZIP.
                            </p>
                        </div>
                        <div className="rounded-3xl bg-slate-950 px-5 py-4 text-slate-50 shadow-lg sm:px-6">
                            <p className="text-sm text-slate-400">Ready items</p>
                            <p className="mt-2 text-3xl font-semibold">
                                {completedCount}/{items.length}
                            </p>
                        </div>
                    </div>
                </section>

                <div className="grid gap-6 lg:grid-cols-[1.8fr_0.95fr]">
                    <section className="space-y-6">
                        <div
                            className="group relative rounded-3xl border-2 border-dashed border-slate-300 bg-white/80 px-6 py-12 text-center transition hover:border-slate-400"
                            onDragOver={(event) => event.preventDefault()}
                            onDrop={handleDrop}
                        >
                            <UploadCloud className="mx-auto h-12 w-12 text-slate-500" />
                            <div className="mt-6 space-y-3">
                                <p className="text-lg font-semibold text-slate-900">Drag & drop product photos</p>
                                <p className="text-sm text-slate-500">
                                    JPG, PNG, HEIC supported. Automatic conversion + resize to 1080px width.
                                </p>
                                <label className="inline-flex cursor-pointer items-center justify-center rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800">
                                    Browse files
                                    <input
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        className="sr-only"
                                        onChange={(event) => {
                                            if (event.target.files) {
                                                handleInputFiles(event.target.files);
                                                event.target.value = '';
                                            }
                                        }}
                                    />
                                </label>
                            </div>
                        </div>

                        <div className="rounded-3xl bg-white p-5 shadow-sm">
                            <div className="flex items-center justify-between gap-4">
                                <div>
                                    <h2 className="text-lg font-semibold text-slate-950">Preview gallery</h2>
                                    <p className="text-sm text-slate-500">
                                        Track processing, reprocess with new settings, or remove items.
                                    </p>
                                </div>
                                <div className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700">
                                    {items.length} files
                                </div>
                            </div>

                            <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                                {items.map((item) => (
                                    <div
                                        key={item.id}
                                        className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-slate-50"
                                    >
                                        <div className="relative h-48 overflow-hidden bg-slate-200">
                                            <img src={item.preview} alt={item.name} className="h-full w-full object-cover" />
                                            <button
                                                type="button"
                                                className="absolute right-3 top-3 rounded-full bg-white/90 p-2 text-slate-600 shadow-sm transition hover:bg-white"
                                                onClick={() => removeItem(item.id)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                        <div className="space-y-3 p-4">
                                            <div className="flex items-center justify-between gap-2">
                                                <p className="truncate text-sm font-medium text-slate-900">{item.name}</p>
                                                <span
                                                    className={`rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] ${
                                                        item.status === 'ready'
                                                            ? 'bg-emerald-100 text-emerald-700'
                                                            : item.status === 'processing'
                                                              ? 'bg-sky-100 text-sky-700'
                                                              : item.status === 'error'
                                                                ? 'bg-rose-100 text-rose-700'
                                                                : 'bg-slate-100 text-slate-700'
                                                    }`}
                                                >
                                                    {item.status}
                                                </span>
                                            </div>
                                            {item.status === 'processing' ? (
                                                <div className="flex items-center gap-2 text-slate-500">
                                                    <Loader2 className="h-4 w-4 animate-spin" />
                                                    <span className="text-sm">Processing</span>
                                                </div>
                                            ) : item.status === 'ready' ? (
                                                <div className="flex items-center gap-2 text-emerald-700">
                                                    <CheckCircle2 className="h-4 w-4" />
                                                    <span className="text-sm">Ready to download</span>
                                                </div>
                                            ) : item.status === 'error' ? (
                                                <p className="text-sm text-rose-600">{item.error ?? 'Failed'}</p>
                                            ) : null}
                                        </div>
                                    </div>
                                ))}
                                {items.length === 0 ? (
                                    <div className="col-span-full rounded-3xl border border-dashed border-slate-300 p-8 text-center text-slate-500">
                                        <ImagePlus className="mx-auto h-10 w-10" />
                                        <p className="mt-4 text-sm">No files uploaded yet. Drop photos to begin.</p>
                                    </div>
                                ) : null}
                            </div>
                        </div>
                    </section>

                    <aside className="space-y-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div>
                                <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-950">
                                    <SlidersHorizontal className="h-5 w-5" />
                                    Settings
                                </h2>
                                <p className="text-sm text-slate-500">
                                    Logo, watermark toggle, and quality controls for Facebook-ready posts.
                                </p>
                            </div>
                        </div>

                        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                            <p className="text-sm font-semibold text-slate-900">Shop logo</p>
                            <p className="mt-1 text-sm text-slate-500">This logo is applied to every finished image.</p>
                            <div className="mt-4 flex items-center gap-4">
                                <div className="h-20 w-20 overflow-hidden rounded-3xl bg-white shadow-sm">
                                    {logoPreview ? (
                                        <img src={logoPreview} alt="Logo preview" className="h-full w-full object-contain p-2" />
                                    ) : (
                                        <div className="flex h-full w-full items-center justify-center text-slate-400">Logo</div>
                                    )}
                                </div>
                                <label className="inline-flex cursor-pointer items-center rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800">
                                    Upload logo
                                    <input type="file" accept="image/*" className="sr-only" onChange={handleLogoUpload} />
                                </label>
                            </div>
                        </div>

                        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                            <div className="flex items-center justify-between gap-3">
                                <div>
                                    <p className="text-sm font-semibold text-slate-900">Watermark</p>
                                    <p className="mt-1 text-sm text-slate-500">
                                        Add your shop logo to the bottom-right corner of each image.
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    className={`inline-flex h-10 w-20 items-center rounded-full p-1 transition ${
                                        watermarkEnabled ? 'bg-sky-600' : 'bg-slate-300'
                                    }`}
                                    onClick={() => setWatermarkEnabled((current) => !current)}
                                >
                                    <span
                                        className={`h-8 w-8 rounded-full bg-white transition ${watermarkEnabled ? 'translate-x-5' : 'translate-x-0'}`}
                                    />
                                </button>
                            </div>
                        </div>

                        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                            <div className="flex items-center justify-between gap-4">
                                <div>
                                    <p className="text-sm font-semibold text-slate-900">Compression quality</p>
                                    <p className="mt-1 text-sm text-slate-500">
                                        Higher quality means larger files. Recommended 80–92 for Facebook.
                                    </p>
                                </div>
                                <span className="rounded-full bg-white px-3 py-1 text-sm font-semibold text-slate-900 shadow-sm">
                                    {quality}%
                                </span>
                            </div>
                            <input
                                type="range"
                                min="50"
                                max="100"
                                step="1"
                                value={quality}
                                onChange={(event) => setQuality(Number(event.target.value))}
                                className="mt-4 w-full accent-sky-600"
                            />
                        </div>

                        <div className="space-y-3">
                            <button
                                type="button"
                                className="inline-flex w-full items-center justify-center gap-2 rounded-3xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                                onClick={reprocessAll}
                                disabled={items.length === 0}
                            >
                                <ImagePlus className="h-4 w-4" />
                                Reprocess all photos
                            </button>
                            <button
                                type="button"
                                className="inline-flex w-full items-center justify-center gap-2 rounded-3xl bg-sky-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-60"
                                onClick={downloadZip}
                                disabled={completedCount === 0}
                            >
                                <Download className="h-4 w-4" />
                                Download ZIP
                            </button>
                        </div>

                        {busyMessage ? (
                            <div className="rounded-3xl bg-slate-950 px-4 py-3 text-sm text-slate-100 shadow-sm">
                                <div className="flex items-center gap-2">
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    <span>{busyMessage}</span>
                                </div>
                            </div>
                        ) : null}
                    </aside>
                </div>

                <section className="mt-12">
                    <div className="mx-auto max-w-4xl">
                        <div className="text-center">
                            <h2 className="text-2xl font-semibold text-slate-950">Frequently Asked Questions</h2>
                            <p className="mt-2 text-sm text-slate-600">
                                Everything you need to know about optimizing your Facebook product photos.
                            </p>
                        </div>

                        <div className="mt-8 space-y-6">
                            <details className="group rounded-2xl border border-slate-200 bg-white p-4">
                                <summary className="flex cursor-pointer items-center justify-between font-semibold text-slate-900">
                                    How does this tool work?
                                    <span className="ml-2 text-slate-500 group-open:rotate-180">
                                        <ChevronDown />
                                    </span>
                                </summary>
                                <div className="mt-3 text-sm text-slate-600">
                                    <p>
                                        This tool runs entirely in your browser. When you upload photos, they&apos;re processed locally
                                        using JavaScript libraries. HEIC files are converted to JPG, images are resized to 1080px width
                                        (Facebook&apos;s optimal size), watermarks are applied, and everything is packaged into a ZIP file
                                        for download. No data ever leaves your device.
                                    </p>
                                </div>
                            </details>

                            <details className="group rounded-2xl border border-slate-200 bg-white p-4">
                                <summary className="flex cursor-pointer items-center justify-between font-semibold text-slate-900">
                                    What file formats are supported?
                                    <span className="ml-2 text-slate-500 group-open:rotate-180">
                                        <ChevronDown />
                                    </span>
                                </summary>
                                <div className="mt-3 text-sm text-slate-600">
                                    <p>
                                        Supports JPG, PNG, and HEIC formats. HEIC files (common on iPhones) are automatically converted to
                                        JPG. All output files are optimized JPGs regardless of input format.
                                    </p>
                                </div>
                            </details>

                            <details className="group rounded-2xl border border-slate-200 bg-white p-4">
                                <summary className="flex cursor-pointer items-center justify-between font-semibold text-slate-900">
                                    Why 1080px width specifically?
                                    <span className="ml-2 text-slate-500 group-open:rotate-180">
                                        <ChevronDown />
                                    </span>
                                </summary>
                                <div className="mt-3 text-sm text-slate-600">
                                    <p>
                                        Facebook Marketplace and Instagram Shop optimize best at 1080px width. This size provides the
                                        perfect balance between quality and file size for fast loading on mobile networks in Bangladesh.
                                        Higher resolutions get compressed aggressively by Facebook anyway.
                                    </p>
                                </div>
                            </details>

                            <details className="group rounded-2xl border border-slate-200 bg-white p-4">
                                <summary className="flex cursor-pointer items-center justify-between font-semibold text-slate-900">
                                    Is my data safe and private?
                                    <span className="ml-2 text-slate-500 group-open:rotate-180">
                                        <ChevronDown />
                                    </span>
                                </summary>
                                <div className="mt-3 text-sm text-slate-600">
                                    <p>
                                        Absolutely. This is a client-side only tool - all processing happens in your browser. Your photos
                                        never touch any server, database, or cloud service. You can verify this by checking your
                                        browser&apos;s network tab during processing (no external requests are made).
                                    </p>
                                </div>
                            </details>

                            <details className="group rounded-2xl border border-slate-200 bg-white p-4">
                                <summary className="flex cursor-pointer items-center justify-between font-semibold text-slate-900">
                                    What&apos;s the recommended compression quality?
                                    <span className="ml-2 text-slate-500 group-open:rotate-180">
                                        <ChevronDown />
                                    </span>
                                </summary>
                                <div className="mt-3 text-sm text-slate-600">
                                    <p>
                                        For Facebook Marketplace, we recommend 80-92% quality. This typically results in files under 600KB
                                        while maintaining excellent visual quality. Higher quality means larger files, which can be
                                        problematic on slow mobile connections in Bangladesh.
                                    </p>
                                </div>
                            </details>

                            <details className="group rounded-2xl border border-slate-200 bg-white p-4">
                                <summary className="flex cursor-pointer items-center justify-between font-semibold text-slate-900">
                                    Does it work on mobile phones?
                                    <span className="ml-2 text-slate-500 group-open:rotate-180">
                                        <ChevronDown />
                                    </span>
                                </summary>
                                <div className="mt-3 text-sm text-slate-600">
                                    <p>
                                        Yes! The tool is fully responsive and works on mobile browsers. However, for best performance with
                                        large batches, we recommend using a desktop or laptop computer. Mobile browsers have memory
                                        limitations that might affect processing of very large image batches.
                                    </p>
                                </div>
                            </details>

                            <details className="group rounded-2xl border border-slate-200 bg-white p-4">
                                <summary className="flex cursor-pointer items-center justify-between font-semibold text-slate-900">
                                    Can I process hundreds of photos at once?
                                    <span className="ml-2 text-slate-500 group-open:rotate-180">
                                        <ChevronDown />
                                    </span>
                                </summary>
                                <div className="mt-3 text-sm text-slate-600">
                                    <p>
                                        Yes, but browser memory limits apply. Most modern computers can handle 50-100 photos in a single
                                        batch. If you have thousands of photos, process them in smaller batches. The tool is optimized for
                                        Bangladesh&apos;s typical Facebook seller workflow of 20-50 product photos per listing session.
                                    </p>
                                </div>
                            </details>

                            <details className="group rounded-2xl border border-slate-200 bg-white p-4">
                                <summary className="flex cursor-pointer items-center justify-between font-semibold text-slate-900">
                                    What browsers are supported?
                                    <span className="ml-2 text-slate-500 group-open:rotate-180">
                                        <ChevronDown />
                                    </span>
                                </summary>
                                <div className="mt-3 text-sm text-slate-600">
                                    <p>
                                        Works on all modern browsers: Chrome, Firefox, Safari, and Edge. Requires JavaScript enabled. For
                                        best HEIC support, use Chrome or Safari. The tool uses modern web APIs that are widely supported in
                                        browsers from 2020 onwards.
                                    </p>
                                </div>
                            </details>
                        </div>
                    </div>
                </section>

                <footer className="mt-12">
                    <div className="mx-auto max-w-4xl text-center">
                        <h3 className="text-lg font-semibold text-slate-950">Privacy & Security</h3>
                        <div className="mt-4 space-y-3 text-sm text-slate-600">
                            <p>
                                <strong>100% Client-Side Processing:</strong> All image conversion, resizing, and watermarking happens
                                directly in your browser. Your photos never leave your device or touch any server.
                            </p>
                            <p>
                                <strong>No Data Collection:</strong> We don&apos;t store, track, or analyze your images. This tool is built
                                with privacy-first principles for Bangladesh-based Facebook sellers.
                            </p>
                            <p>
                                <strong>Open Source:</strong> The code is open source and auditable. You can verify that your data stays
                                local by inspecting the browser&apos;s network tab - no external requests are made during processing.
                            </p>
                        </div>
                        <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-xs text-slate-500">
                            <span>© {new Date().getFullYear()} SnapShot team</span>
                        </div>
                    </div>
                </footer>
            </div>
        </main>
    );
}
