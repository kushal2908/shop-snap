'use client';

import { useState } from 'react';
import { Save } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import DropZone from '@/components/upload/DropZone';
import ImageGrid from '@/components/gallery/ImageGrid';
import PreviewModal from '@/components/gallery/PreviewModal';
import SettingsDrawer from '@/components/settings/SettingsDrawer';
import SettingsPanel from '@/components/settings/SettingsPanel';
import DownloadButton, { downloadSingleImage } from '@/components/actions/DownloadButton';
import BatchProgressBar from '@/components/progress/BatchProgressBar';
import ProcessingSummary from '@/components/progress/ProcessingSummary';
import StepIndicator, { type Step } from '@/components/progress/StepIndicator';
import { processImageFile } from '@/lib/imageProcessor';
import type { WatermarkPosition } from '@/lib/watermarkEngine';
import type { ImageItem } from '@/lib/types';

export const dynamic = 'force-dynamic';
export const runtime = 'edge';

const supportedTypes = ['image/jpeg', 'image/png', 'image/heic', 'image/heif'];

const getOutputName = (fileName: string) => `${fileName.replace(/\.[^.]+$/, '')}.jpg`;

export default function Home() {
    const [items, setItems] = useState<ImageItem[]>([]);
    const [logoPreview, setLogoPreview] = useState<string | null>(null);
    const [watermarkEnabled, setWatermarkEnabled] = useState(true);
    const [position, setPosition] = useState<WatermarkPosition>('br');
    const [opacity, setOpacity] = useState(85);
    const [size, setSize] = useState(24);
    const [quality, setQuality] = useState(88);
    const [busyMessage, setBusyMessage] = useState<string>('');
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [step, setStep] = useState<Step>('upload');

    const completedCount = items.filter((item) => item.status === 'ready').length;
    const processingCount = items.filter((item) => item.status === 'processing').length;
    const errorCount = items.filter((item) => item.status === 'error').length;
    const allDone = items.length > 0 && processingCount === 0 && completedCount === items.length;

    const handleFiles = async (files: File[]) => {
        const valid = files.filter((file) => supportedTypes.includes(file.type) || /\.(heic|heif)$/i.test(file.name));
        if (valid.length === 0) return;

        const newItems: ImageItem[] = valid.map((file) => ({
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
        const watermarkOptions = { opacity: opacity / 100, scale: size / 100, position };

        await Promise.all(
            newItems.map(async (item) => {
                setItems((current) => current.map((next) => (next.id === item.id ? { ...next, status: 'processing' } : next)));

                try {
                    const blob = await processImageFile(item.file, {
                        maxWidth: 1080,
                        quality: qualityRatio,
                        watermark: useWatermark,
                        logoDataUrl: watermarkLogo,
                        watermarkOptions,
                    });

                    setItems((current) =>
                        current.map((next) =>
                            next.id === item.id
                                ? {
                                      ...next,
                                      status: 'ready',
                                      blob,
                                      outputUrl: URL.createObjectURL(blob),
                                      name: getOutputName(item.name),
                                  }
                                : next
                        )
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
                                : next
                        )
                    );
                }
            })
        );

        setStep((current) => (current === 'upload' ? 'configure' : current));
    };

    const handleLogoUpload = (file: File) => {
        setLogoPreview(URL.createObjectURL(file));
    };

    const removeItem = (id: string) => {
        setItems((current) => {
            const candidate = current.find((item) => item.id === id);
            if (candidate?.preview) URL.revokeObjectURL(candidate.preview);
            if (candidate?.outputUrl) URL.revokeObjectURL(candidate.outputUrl);
            return current.filter((item) => item.id !== id);
        });
    };

    const reprocessAll = async () => {
        setBusyMessage('Re-processing images with current settings…');
        const currentItems = items;
        setItems((current) => current.map((item) => ({ ...item, status: 'processing', error: undefined })));

        const watermarkLogo = logoPreview ?? undefined;
        const useWatermark = watermarkEnabled;
        const qualityRatio = quality / 100;
        const watermarkOptions = { opacity: opacity / 100, scale: size / 100, position };

        await Promise.all(
            currentItems.map(async (item) => {
                if (!item.file) return;
                try {
                    const blob = await processImageFile(item.file, {
                        maxWidth: 1080,
                        quality: qualityRatio,
                        watermark: useWatermark,
                        logoDataUrl: watermarkLogo,
                        watermarkOptions,
                    });

                    setItems((current) =>
                        current.map((next) =>
                            next.id === item.id
                                ? { ...next, status: 'ready', blob, outputUrl: URL.createObjectURL(blob), name: getOutputName(item.name) }
                                : next
                        )
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
                                : next
                        )
                    );
                }
            })
        );

        setBusyMessage('');
        setStep('download');
    };

    const handlePreview = (item: ImageItem) => {
        if (item.outputUrl) setPreviewUrl(item.outputUrl);
    };

    const settingsProps = {
        logoPreview,
        onLogoUpload: handleLogoUpload,
        watermarkEnabled,
        onWatermarkToggle: setWatermarkEnabled,
        position,
        onPositionChange: setPosition,
        opacity,
        onOpacityChange: setOpacity,
        size,
        onSizeChange: setSize,
        quality,
        onQualityChange: setQuality,
        onReprocessAll: reprocessAll,
        canReprocess: items.length > 0,
        isProcessing: processingCount > 0,
    };

    return (
        <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900">
            <Header />

            <main className="flex-1 px-4 py-6 sm:px-6 lg:px-10">
                <div className="mx-auto max-w-7xl">
                    <section className="mb-8 text-center">
                        <h1 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                            Optimize product photos with your logo
                        </h1>
                        <p className="mx-auto mt-2 max-w-2xl text-sm text-slate-600 sm:text-base">
                            Convert HEIC to JPG, resize to the 1080px Facebook gold standard, and watermark your shop logo — all
                            in your browser.
                        </p>
                    </section>

                    <StepIndicator current={step} hasItems={items.length > 0} hasReadyItems={completedCount > 0} />

                    {items.length > 0 && (
                        <div className="mt-5 space-y-3">
                            <BatchProgressBar total={items.length} completed={completedCount} errors={errorCount} />

                            {/* Mobile action bar */}
                            <div className="flex items-center justify-between gap-3 lg:hidden">
                                <button
                                    type="button"
                                    onClick={() => setDrawerOpen(true)}
                                    className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700"
                                >
                                    Settings
                                </button>
                                <div className="flex-1">
                                    <DownloadButton items={items} onBusyChange={setBusyMessage} />
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="mt-6 grid gap-6 lg:grid-cols-[1.8fr_0.95fr]">
                        <section className="min-w-0 space-y-6">
                            <DropZone onFiles={handleFiles} />

                            {items.length > 0 && (
                                <div className="rounded-3xl bg-white p-5 shadow-sm">
                                    <div className="mb-4 flex items-center justify-between gap-4">
                                        <div>
                                            <h2 className="text-lg font-semibold text-slate-950">Your photos</h2>
                                            <p className="text-sm text-slate-500">
                                                Track processing, preview optimized results, or download each photo.
                                            </p>
                                        </div>
                                        <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700">
                                            <Save className="h-3.5 w-3.5" />
                                            {items.length}
                                        </span>
                                    </div>

                                    <ProcessingSummary items={items} />

                                    <div className="mt-4">
                                        <ImageGrid
                                            items={items}
                                            onRemove={removeItem}
                                            onDownloadSingle={downloadSingleImage}
                                            onPreview={handlePreview}
                                            watermarkApplied={watermarkEnabled && !!logoPreview}
                                        />
                                    </div>
                                </div>
                            )}
                        </section>

                        <aside className="hidden self-start rounded-3xl border border-slate-200 bg-white p-5 shadow-sm lg:block">
                            <div className="mb-4">
                                <h2 className="text-lg font-semibold text-slate-950">Settings</h2>
                                <p className="text-sm text-slate-500">Watermark &amp; quality controls.</p>
                            </div>
                            <SettingsPanel {...settingsProps} />
                        </aside>
                    </div>

                    {busyMessage && (
                        <div className="mt-6 rounded-2xl bg-slate-950 px-4 py-3 text-sm text-slate-100">
                            <div className="flex items-center gap-2">
                                <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-500 border-t-white" />
                                <span>{busyMessage}</span>
                            </div>
                        </div>
                    )}

                    {allDone && step !== 'download' && (
                        <div className="mt-8 rounded-3xl bg-slate-950 p-6 text-slate-50 shadow-lg sm:p-8">
                            <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                    <h3 className="text-lg font-semibold">All {items.length} photos are ready!</h3>
                                    <p className="mt-1 text-sm text-slate-400">
                                        Download your optimized, watermarked photos as a single ZIP file.
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setStep('download')}
                                    className="inline-flex items-center gap-2 rounded-full bg-sky-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-sky-600"
                                >
                                    <Save className="h-4 w-4" />
                                    Go to download
                                </button>
                            </div>
                        </div>
                    )}

                    {step === 'download' && items.length > 0 && allDone && (
                        <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                            <div className="flex flex-col items-center gap-6 text-center sm:flex-row sm:justify-between sm:text-left">
                                <div>
                                    <h3 className="text-xl font-bold text-slate-950">All set!</h3>
                                    <p className="mt-1 text-sm text-slate-600">
                                        {completedCount} optimized photos. Download individually or grab the full ZIP.
                                    </p>
                                </div>
                                <div className="w-full sm:w-64">
                                    <DownloadButton items={items} onBusyChange={setBusyMessage} />
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>

            <Footer />

            <SettingsDrawer
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                {...settingsProps}
            />

            {previewUrl && <PreviewModal imageUrl={previewUrl} onClose={() => setPreviewUrl(null)} />}
        </div>
    );
}
