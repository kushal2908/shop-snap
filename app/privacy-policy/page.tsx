import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
    title: 'Privacy Policy | shopSnap',
    description: 'Read the shopSnap privacy policy covering client-side image processing, data handling, and browser security.',
};

export default function PrivacyPolicyPage() {
    return (
        <main className="min-h-screen bg-slate-50 px-4 py-10 text-slate-900 sm:px-6 lg:px-10">
            <div className="mx-auto max-w-4xl rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
                <div className="mb-6 flex items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-950">Privacy Policy</h1>
                        <p className="mt-2 text-sm text-slate-600">
                            Learn how shopSnap protects your data, keeps image processing local, and respects your privacy.
                        </p>
                    </div>
                    <Link href="/" className="text-sm font-medium text-slate-700 hover:text-slate-900">
                        Back to home
                    </Link>
                </div>

                <section className="space-y-6 text-slate-700">
                    <div>
                        <h2 className="text-xl font-semibold text-slate-900">Client-Side Processing</h2>
                        <p className="mt-3 text-sm leading-7">
                            All image conversion, resizing, and watermarking happens entirely in your browser. Your photos never leave your
                            device and are not uploaded to any server.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-xl font-semibold text-slate-900">No Data Collection</h2>
                        <p className="mt-3 text-sm leading-7">
                            shopSnap does not store, track, or analyze your images. We do not collect personal data related to your image
                            content or processing session.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-xl font-semibold text-slate-900">Cookies and Third-Party Tools</h2>
                        <p className="mt-3 text-sm leading-7">
                            The app uses only essential browser features and does not rely on analytics cookies or third-party tracking
                            services for processing.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-xl font-semibold text-slate-900">Security</h2>
                        <p className="mt-3 text-sm leading-7">
                            The application is built to minimize network access during use. Any external resources are limited to static
                            assets and UI dependencies.
                        </p>
                    </div>
                </section>
            </div>
        </main>
    );
}
