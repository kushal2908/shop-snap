import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
    title: 'Terms of Service | shopSnap',
    description: 'Read the shopSnap terms of service for using the batch photo optimizer tool.',
};

export default function TermsPage() {
    return (
        <main className="min-h-screen bg-slate-50 px-4 py-10 text-slate-900 sm:px-6 lg:px-10">
            <div className="mx-auto max-w-4xl rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
                <div className="mb-6 flex items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-950">Terms of Service</h1>
                        <p className="mt-2 text-sm text-slate-600">
                            Review the terms that apply to your use of the shopSnap online image optimizer.
                        </p>
                    </div>
                    <Link href="/" className="text-sm font-medium text-slate-700 hover:text-slate-900">
                        Back to home
                    </Link>
                </div>

                <section className="space-y-6 text-slate-700">
                    <div>
                        <h2 className="text-xl font-semibold text-slate-900">Use of the Service</h2>
                        <p className="mt-3 text-sm leading-7">
                            shopSnap is provided as a free browser-based tool for resizing and optimizing images. By using the tool, you
                            agree to use it responsibly and only for lawful purposes.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-xl font-semibold text-slate-900">No Warranty</h2>
                        <p className="mt-3 text-sm leading-7">
                            The service is provided &quot;as is&quot; without warranties. shopSnap is not liable for any issues arising from
                            image conversion, file handling, or browser behavior.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-xl font-semibold text-slate-900">Content Responsibility</h2>
                        <p className="mt-3 text-sm leading-7">
                            You are responsible for the content of the images you process. Do not use the app to process copyrighted or
                            restricted content without proper authorization.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-xl font-semibold text-slate-900">Changes to Terms</h2>
                        <p className="mt-3 text-sm leading-7">
                            shopSnap may update these terms as needed. Continued use of the tool after changes implies acceptance of the
                            updated terms.
                        </p>
                    </div>
                </section>
            </div>
        </main>
    );
}
