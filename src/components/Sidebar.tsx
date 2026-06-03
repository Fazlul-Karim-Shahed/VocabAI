"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sparkles, Library, Bookmark, Settings } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { cn } from "@/lib/utils";

export function Sidebar() {
  const pathname = usePathname();

  const routes = [
    {
      href: "/",
      label: "Learn",
      icon: Sparkles,
    },
    {
      href: "/flashcards",
      label: "Flashcards",
      icon: Library,
    },
    {
      href: "/saved",
      label: "Saved",
      icon: Bookmark,
    },
    {
      href: "/settings",
      label: "Settings",
      icon: Settings,
    },
  ];

  return (
    <aside className="hidden md:flex flex-col w-72 h-screen sticky top-0 border-r border-slate-200 dark:border-white/10 glass-panel z-40 bg-white/50 dark:bg-black/20">
      <div className="p-6">
        <Link href="/" className="flex items-center gap-3 transition-opacity hover:opacity-80">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/20">
            <Sparkles className="h-5 w-5" />
          </div>
          <span className="text-2xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-br from-slate-900 to-slate-600 dark:from-white dark:to-white/60">
            VocabAI
          </span>
        </Link>
      </div>

      <div className="flex-1 px-4 py-6 overflow-y-auto space-y-2">
        {routes.map((route) => (
          <Link
            key={route.href}
            href={route.href}
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all duration-300 relative group",
              pathname === route.href
                ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 shadow-sm"
                : "text-slate-600 dark:text-white/60 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5"
            )}
          >
            {pathname === route.href && (
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-blue-600 dark:bg-blue-500 rounded-r-full" />
            )}
            <route.icon className={cn(
              "h-5 w-5 transition-transform duration-300 group-hover:scale-110",
              pathname === route.href ? "text-blue-600 dark:text-blue-400" : "opacity-70"
            )} />
            {route.label}
          </Link>
        ))}
      </div>

      <div className="p-6 border-t border-slate-200 dark:border-white/10 mt-auto flex items-center justify-between">
        <div className="text-xs font-medium text-slate-500 dark:text-white/40">Theme</div>
        <ThemeToggle />
      </div>
    </aside>
  );
}
