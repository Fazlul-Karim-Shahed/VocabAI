"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sparkles, Library, Bookmark, History, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth-context";

export function MobileNav() {
  const pathname = usePathname();
  const { user } = useAuth();

  const routes = [
    {
      href: "/",
      label: "Learn",
      icon: Sparkles,
    },
    {
      href: "/flashcards",
      label: "Cards",
      icon: Library,
    },
    {
      href: "/history",
      label: "History",
      icon: History,
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
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 glass-panel border-t border-slate-200 dark:border-white/10 bg-white/80 dark:bg-black/60 pb-safe">
      <div className="grid grid-cols-5 px-2 py-2 w-full max-w-full">
        {routes.map((route) => (
          <Link
            key={route.href}
            href={route.href}
            className={cn(
              "flex flex-col items-center justify-center gap-1 py-1.5 rounded-xl transition-all duration-300 min-w-0 overflow-hidden",
              pathname === route.href
                ? "text-blue-600 dark:text-blue-400"
                : "text-slate-500 dark:text-white/50 hover:text-slate-900 dark:hover:text-white"
            )}
          >
            <div className={cn(
              "flex items-center justify-center w-8 h-8 rounded-full transition-all duration-300",
              pathname === route.href && "bg-blue-100 dark:bg-blue-500/20"
            )}>
              {route.href === '/settings' && user?.photoURL ? (
                <img 
                  src={user.photoURL} 
                  referrerPolicy="no-referrer"
                  alt="Profile" 
                  className={cn(
                    "h-6 w-6 rounded-full object-cover",
                    pathname === route.href && "ring-2 ring-blue-600 dark:ring-blue-400"
                  )} 
                />
              ) : (
                <route.icon className={cn(
                  "h-5 w-5",
                  pathname === route.href && "animate-pulse"
                )} />
              )}
            </div>
            <span className="text-[10px] font-semibold">{route.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
