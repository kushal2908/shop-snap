export type WatermarkOptions = {
    opacity?: number;
    margin?: number;
    scale?: number;
    position?: WatermarkPosition;
};

export type WatermarkPosition = 'tl' | 'tr' | 'bl' | 'br' | 'tc' | 'bc' | 'lc' | 'rc' | 'c';

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

    const { x, y } = resolvePosition(
        options.position ?? 'br',
        canvas.width,
        canvas.height,
        width,
        height,
        margin,
    );

    ctx.save();
    ctx.globalAlpha = opacity;
    ctx.drawImage(image, x, y, width, height);
    ctx.restore();
}

function resolvePosition(
    position: WatermarkPosition,
    canvasWidth: number,
    canvasHeight: number,
    width: number,
    height: number,
    margin: number,
): { x: number; y: number } {
    let x = 0;
    let y = 0;

    if (position.includes('l')) x = margin;
    else if (position.includes('r')) x = canvasWidth - width - margin;
    else x = (canvasWidth - width) / 2;

    if (position.includes('t')) y = margin;
    else if (position.includes('b')) y = canvasHeight - height - margin;
    else y = (canvasHeight - height) / 2;

    return { x: Math.max(0, x), y: Math.max(0, y) };
}

function loadImage(src: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error('Unable to load watermark logo.'));
        img.src = src;
    });
}
