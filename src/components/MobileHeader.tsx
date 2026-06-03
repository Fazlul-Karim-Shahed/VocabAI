"use client";

import Link from "next/link";
import { Sparkles } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";

export function MobileHeader() {
  return (
    <header className="md:hidden sticky top-0 z-50 w-full glass-panel border-b border-slate-200 dark:border-white/10 bg-white/80 dark:bg-black/60">
      <div className="container flex h-14 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-md shadow-blue-500/20">
            <Sparkles className="h-4 w-4" />
          </div>
          <span className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-br from-slate-900 to-slate-600 dark:from-white dark:to-white/60">
            VocabAI
          </span>
        </Link>
        <ThemeToggle />
      </div>
    </header>
  );
}
