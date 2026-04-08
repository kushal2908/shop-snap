export type WatermarkOptions = {
    opacity?: number;
    margin?: number;
    scale?: number;
};

export async function overlayWatermark(canvas: HTMLCanvasElement, logoDataUrl: string, options: WatermarkOptions = {}): Promise<void> {
    const image = await loadImage(logoDataUrl);

    const ctx = canvas.getContext('2d');
    if (!ctx) {
        throw new Error('Canvas context is unavailable.');
    }

    const scale = options.scale ?? 0.22;
    const margin = options.margin ?? 20;
    const opacity = options.opacity ?? 0.7;

    const maxWidth = canvas.width * scale;
    const ratio = image.width / image.height;
    const width = Math.min(maxWidth, image.width);
    const height = Math.round(width / ratio);

    const x = canvas.width - width - margin;
    const y = canvas.height - height - margin;

    ctx.save();
    ctx.globalAlpha = opacity;
    ctx.drawImage(image, x, y, width, height);
    ctx.restore();
}

function loadImage(src: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error('Unable to load watermark logo.'));
        img.src = src;
    });
}
