import Image from 'next/image';
import { Shield } from 'lucide-react';

export default function Header() {
    return (
        <header className="border-b border-slate-200 bg-white/80 backdrop-blur-sm">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-10">
                <div className="flex items-center gap-3">
                    <Image src="/logo.png" alt="shopSnap" height={40} width={80} className="object-contain" />
                    <div className="hidden sm:block">
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-600">shopSnap</p>
                        <p className="text-[11px] text-slate-500">Photo Optimizer</p>
                    </div>
                </div>
                <div className="flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-emerald-700">
                    <Shield className="h-3.5 w-3.5" />
                    <span className="text-xs font-semibold">100% Private</span>
                </div>
            </div>
        </header>
    );
}
