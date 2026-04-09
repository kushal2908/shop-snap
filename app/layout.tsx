import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { GoogleAnalytics, GoogleTagManager } from '@next/third-parties/google';
import { Script } from 'vm';

const geistSans = Geist({
    variable: '--font-geist-sans',
    subsets: ['latin'],
});

const geistMono = Geist_Mono({
    variable: '--font-geist-mono',
    subsets: ['latin'],
});

export const metadata: Metadata = {
    title: 'shopSnap | Batch Photo Optimizer for Facebook & Instagram Sellers',
    description:
        'The fastest 100% client-side tool for Bangladesh F-Commerce. Bulk convert HEIC, resize to 1080px for high-definition Facebook posts, and add shop watermarks. Privacy-first image processing.',
    keywords: [
        'shopSnap',
        'F-commerce photo optimizer',
        'Facebook marketplace image resizer',
        'bulk watermark photos online free',
        'HEIC to JPG converter Bangladesh',
        'product photography post-processing tool',
        'sell on facebook marketplace bangladesh',
        'online business photo branding',
    ],
    authors: [{ name: 'shopSnap Team' }],
    creator: 'shopSnap',
    publisher: 'shopSnap',
    metadataBase: new URL('https://shopsnap.xyz'),
    alternates: {
        canonical: '/',
    },
    openGraph: {
        title: 'shopSnap - Professional Product Photos in Seconds',
        description: 'Stop uploading blurry photos. Get high-definition, watermarked images optimized for the Facebook algorithm.',
        url: 'https://shopsnap.xyz',
        siteName: 'shopSnap Bangladesh',
        images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'shopSnap Dashboard' }],
        locale: 'en_BD',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'shopSnap | Social Commerce Photo Optimizer',
        description: 'Batch resize and watermark your product photos. 100% browser-based and private.',
        images: ['/og-image.png'],
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-image-preview': 'large',
        },
    },
    verification: {
        google: 'your-google-site-verification-code',
    },
    category: 'E-commerce Utility',
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
                {/* Google Ads */}
                <script
                    async
                    src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5391881178707156"
                    crossOrigin="anonymous"
                ></script>
                {/* Google Tag Manager */}
                <script>
                    {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                        'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                        })(window,document,'script','dataLayer','GTM-T64T2TPP')`}
                </script>

                <script async src="https://www.googletagmanager.com/gtag/js?id=G-LJZ31EJGPK" />
                <script>
                    {` window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-LJZ31EJGPK')`}
                </script>
            </head>
            <body className="min-h-full flex flex-col">
                <noscript>
                    <iframe
                        src="https://www.googletagmanager.com/ns.html?id=GTM-T64T2TPP"
                        height="0"
                        width="0"
                        style={{ display: 'none', visibility: 'hidden' }}
                    ></iframe>
                </noscript>
                {children}
            </body>
        </html>
    );
}
