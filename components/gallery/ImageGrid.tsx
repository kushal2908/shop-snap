'use client';

import ImageCard from './ImageCard';
import EmptyState from './EmptyState';
import type { ImageItem } from '@/lib/types';

interface ImageGridProps {
    items: ImageItem[];
    onRemove: (id: string) => void;
    onDownloadSingle: (item: ImageItem) => void;
    onPreview: (item: ImageItem) => void;
    watermarkApplied: boolean;
}

export default function ImageGrid({ items, onRemove, onDownloadSingle, onPreview, watermarkApplied }: ImageGridProps) {
    if (items.length === 0) {
        return <EmptyState />;
    }

    return (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {items.map((item) => (
                <ImageCard
                    key={item.id}
                    item={item}
                    onRemove={onRemove}
                    onDownloadSingle={onDownloadSingle}
                    onPreview={onPreview}
                    watermarkApplied={watermarkApplied}
                />
            ))}
        </div>
    );
}
