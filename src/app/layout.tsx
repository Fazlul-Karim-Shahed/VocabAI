import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Sidebar } from "@/components/Sidebar";
import { MobileNav } from "@/components/MobileNav";
import { MobileHeader } from "@/components/MobileHeader";
import { TooltipProvider } from "@/components/ui/tooltip";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "VocabAI - Master English Vocabulary Smarter",
  description: "Understand words deeply with Bangla explanations, flashcards, and AI-powered learning.",
  manifest: "/manifest.json",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} overflow-x-hidden`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <TooltipProvider>
            <div className="flex min-h-screen flex-col md:flex-row bg-slate-50 dark:bg-black/95">
              <Sidebar />
              <div className="flex-1 flex flex-col min-w-0 pb-16 md:pb-0">
                <MobileHeader />
                <main className="flex-1 relative flex flex-col">
                  {/* High-contrast ambient glowing orbs */}
                  <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/20 dark:bg-blue-600/10 rounded-full blur-[100px] pointer-events-none -translate-y-1/2"></div>
                  <div className="absolute top-1/3 right-0 w-[30rem] h-[30rem] bg-purple-500/10 dark:bg-purple-600/10 rounded-full blur-[120px] pointer-events-none translate-x-1/4"></div>
                  <div className="relative z-10 w-full flex-1 flex flex-col">
                    {children}
                  </div>
                </main>
                <MobileNav />
              </div>
            </div>
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
