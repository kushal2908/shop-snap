import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://shopsnap.xyz';

    return [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 1,
        },
        // If you add a blog or "How-to" guides later for AdSense,
        // you would list them here:
        // {
        //   url: `${baseUrl}/guides/how-to-resize-fb-photos`,
        //   lastModified: new Date(),
        //   changeFrequency: 'monthly',
        //   priority: 0.8,
        // },
    ];
}
