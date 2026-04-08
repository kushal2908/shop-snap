import heic2any from 'heic2any';
import imageCompression from 'browser-image-compression';
import { overlayWatermark, WatermarkOptions } from '@/lib/watermarkEngine';

export type ImageProcessOptions = {
    maxWidth?: number;
    quality?: number;
    watermark?: boolean;
    logoDataUrl?: string;
    watermarkOptions?: WatermarkOptions;
};

export async function processImageFile(file: File, options: ImageProcessOptions): Promise<Blob> {
    let workFile = file;
    const originalName = file.name.replace(/\.[^.]+$/, '');

    if (file.type === 'image/heic' || /\.(heic|heif)$/i.test(file.name)) {
        const convertedBlob = (await heic2any({
            blob: file,
            toType: 'image/jpeg',
            quality: 0.95,
            useCanvas: true,
        })) as Blob;

        workFile = new File([convertedBlob], `${originalName}.jpg`, {
            type: 'image/jpeg',
        });
    }

    const image = await loadImage(URL.createObjectURL(workFile));
    const maxWidth = options.maxWidth ?? 1080;
    const targetWidth = Math.min(maxWidth, image.naturalWidth);
    const targetHeight = Math.round((image.naturalHeight * targetWidth) / image.naturalWidth);

    const canvas = document.createElement('canvas');
    canvas.width = targetWidth;
    canvas.height = targetHeight;

    const ctx = canvas.getContext('2d');
    if (!ctx) {
        throw new Error('Canvas is not available in this browser.');
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

    if (options.watermark && options.logoDataUrl) {
        await overlayWatermark(canvas, options.logoDataUrl, {
            opacity: 0.7,
            margin: 20,
            scale: 0.24,
            ...(options.watermarkOptions ?? {}),
        });
    }

    const jpegBlob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob(
            (blob) => {
                if (!blob) {
                    reject(new Error('Failed to export canvas image.'));
                    return;
                }
                resolve(blob);
            },
            'image/jpeg',
            options.quality ?? 0.88,
        );
    });

    const compressedBlob = await imageCompression(jpegBlob, {
        maxSizeMB: 1,
        maxWidthOrHeight: maxWidth,
        initialQuality: options.quality ?? 0.88,
        useWebWorker: true,
        fileType: 'image/jpeg',
    });

    return compressedBlob;
}

async function loadImage(src: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
            resolve(img);
        };
        img.onerror = () => {
            reject(new Error('Unable to load image.'));
        };
        img.src = src;
    });
}
