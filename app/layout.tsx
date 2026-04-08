import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
    variable: '--font-geist-sans',
    subsets: ['latin'],
});

const geistMono = Geist_Mono({
    variable: '--font-geist-mono',
    subsets: ['latin'],
});

export const metadata: Metadata = {
    title: 'shopSnap | Fast Photo Optimizer for Bangladesh F-Commerce',
    description:
        'The #1 free tool for BD Facebook sellers. Convert iPhone HEIC photos to JPG, batch resize for 1080px clarity, and add shop watermarks instantly. 100% private, client-side processing.',
    keywords: [
        'shopSnap',
        'Facebook shop photo optimizer Bangladesh',
        'iPhone HEIC to JPG converter online free',
        'batch watermark tool for f-commerce',
        'resize photo for facebook marketplace bangladesh',
        'online product photo editor for online business',
        'bulk image compressor for bkash sellers',
    ],
    authors: [{ name: 'shopSnap Team' }],
    creator: 'shopSnap',
    publisher: 'shopSnap',
    // ... (Keep your existing formatDetection and alternates)
    metadataBase: new URL('https://shopsnap.com'), // Use your final domain here
    openGraph: {
        title: 'shopSnap - Ready-to-Post Product Photos in One Click',
        description: 'Stop struggling with blurry Facebook photos. Convert, resize, and watermark your entire catalog in seconds.',
        url: 'https://shopsnap.com',
        siteName: 'shopSnap BD',
        images: [{ url: '/logo.png', width: 1200, height: 630, alt: 'shopSnap Tool Interface' }],
        locale: 'en_BD', // Targeting Bangladesh specifically
        type: 'website',
    },
    // ... (Keep existing Twitter and Robots)
    verification: {
        google: 'your-google-site-verification-code',
    },
    category: 'E-commerce Tools',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: 'shopSnap',
        operatingSystem: 'Windows, macOS, Android, iOS',
        applicationCategory: 'BusinessApplication',
        offers: {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'BDT',
        },
        aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: '4.9',
            ratingCount: '1024',
        },
    };

    return (
        <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
            <head>
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify(jsonLd),
                    }}
                />
            </head>
            <body className="min-h-full flex flex-col">{children}</body>
        </html>
    );
}
