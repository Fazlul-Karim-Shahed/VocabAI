"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sparkles, Library, Bookmark, Settings, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ThemeToggle } from "@/components/ThemeToggle";
import { cn } from "@/lib/utils";

export function TopNav() {
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
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-white/5 glass">
      <div className="container flex h-16 items-center justify-between px-4 md:px-8">
        <Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/20 text-blue-600 dark:text-blue-400">
            <Sparkles className="h-5 w-5" />
          </div>
          <span className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
            VocabAI
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-slate-900 dark:hover:text-white flex items-center gap-2",
                pathname === route.href
                  ? "text-slate-900 dark:text-white"
                  : "text-slate-600 dark:text-white/60"
              )}
            >
              <route.icon className="h-4 w-4" />
              {route.label}
            </Link>
          ))}
          <div className="pl-4 border-l border-slate-200 dark:border-white/10">
            <ThemeToggle />
          </div>
        </nav>

        {/* Mobile Nav */}
        <div className="md:hidden flex items-center gap-2">
          <ThemeToggle />
          <Sheet>
            <SheetTrigger render={<Button variant="ghost" size="icon" className="text-slate-600 dark:text-white/70 hover:text-slate-900 dark:hover:text-white" />}>
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle Menu</span>
            </SheetTrigger>
            <SheetContent side="right" className="glass-panel border-l-slate-200 dark:border-l-white/10 w-64 p-6 sm:w-80">
              <div className="flex flex-col gap-8">
                <Link href="/" className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/20 text-blue-400">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <span className="text-xl font-bold text-slate-900 dark:text-white">VocabAI</span>
                </Link>
                <div className="flex flex-col gap-4">
                  {routes.map((route) => (
                    <Link
                      key={route.href}
                      href={route.href}
                      className={cn(
                        "flex items-center gap-3 text-sm font-medium px-4 py-3 rounded-xl transition-colors",
                        pathname === route.href
                          ? "bg-slate-100 dark:bg-white/10 text-slate-900 dark:text-white"
                          : "text-slate-600 dark:text-white/60 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-white/5"
                      )}
                    >
                      <route.icon className="h-5 w-5" />
                      {route.label}
                    </Link>
                  ))}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
