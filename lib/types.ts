export type ImageItem = {
    id: string;
    file: File;
    name: string;
    preview: string;
    status: 'pending' | 'processing' | 'ready' | 'error';
    outputUrl?: string;
    blob?: Blob;
    error?: string;
};
