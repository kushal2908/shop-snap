import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="mt-auto border-t border-slate-200 bg-white">
            <div className="mx-auto max-w-7xl px-4 py-6 text-center sm:px-6 lg:px-10">
                <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-slate-500">
                    <Link href="/privacy-policy" className="transition hover:text-slate-900">
                        Privacy Policy
                    </Link>
                    <Link href="/terms" className="transition hover:text-slate-900">
                        Terms
                    </Link>
                    <span>&copy; {new Date().getFullYear()} shopSnap</span>
                </div>
            </div>
        </footer>
    );
}
