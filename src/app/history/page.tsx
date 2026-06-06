"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { database } from "@/lib/firebase";
import { ref, get, child } from "firebase/database";
import { History as HistoryIcon, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { useAppStore } from "@/lib/store";
import { useRouter } from "next/navigation";

interface HistoryItem {
  id: string;
  word: string;
  banglaMeaning: string;
  examples: {
    beginner: string;
    daily: string;
    professional: string;
  };
  timestamp: number;
}

export default function HistoryPage() {
  const { user, loading: authLoading } = useAuth();
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedWord, setSelectedWord] = useState<HistoryItem | null>(null);
  const { setPendingSearch } = useAppStore();
  const router = useRouter();

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchHistory = async () => {
      try {
        const dbRef = ref(database);
        const snapshot = await get(child(dbRef, `users/${user.uid}/history`));
        if (snapshot.exists()) {
          const data = snapshot.val();
          const parsed = Object.keys(data).map(key => ({
            id: key,
            ...data[key]
          })).sort((a, b) => b.timestamp - a.timestamp);
          setHistory(parsed);
        } else {
          setHistory([]);
        }
      } catch (err) {
        console.error("Failed to fetch history:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [user, authLoading]);

  const handleSeeDetails = () => {
    if (!selectedWord) return;
    setPendingSearch(selectedWord.word);
    router.push("/");
  };

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 rounded-full border-2 border-blue-500 border-t-transparent animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container px-4 py-24 text-center max-w-lg mx-auto">
        <HistoryIcon className="h-16 w-16 mx-auto mb-6 text-slate-400 dark:text-slate-600" />
        <h2 className="text-2xl font-bold mb-4">History Unavailable</h2>
        <p className="text-slate-500 mb-8">Please sign in to view your vocabulary search history.</p>
        <Button onClick={() => router.push("/settings")} className="bg-blue-600 hover:bg-blue-700 text-white">
          Go to Account
        </Button>
      </div>
    );
  }

  return (
    <div className="container px-4 md:px-8 pt-12 pb-24 max-w-5xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
          <HistoryIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
        </div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Search History</h1>
      </div>

      {history.length === 0 ? (
        <div className="text-center py-24 bg-white/50 dark:bg-white/5 rounded-3xl border border-slate-200 dark:border-white/10 border-dashed">
          <p className="text-slate-500">No search history found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {history.map((item) => (
            <Card 
              key={item.id} 
              className="glass-card border-slate-200/50 dark:border-white/10 hover:border-blue-300 dark:hover:border-blue-500/50 transition-all cursor-pointer shadow-sm hover:shadow-md"
              onClick={() => setSelectedWord(item)}
            >
              <CardContent className="p-5 flex flex-col items-center text-center">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{item.word}</h3>
                <p className="text-sm font-medium text-blue-600 dark:text-blue-400 line-clamp-1">{item.banglaMeaning}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Popup Modal */}
      <AnimatePresence>
        {selectedWord && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setSelectedWord(null)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden border border-slate-200 dark:border-white/10"
                onClick={e => e.stopPropagation()}
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />
                <div className="p-6 md:p-8 space-y-6">
                  <div className="text-center">
                    <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">{selectedWord.word}</h2>
                    <p className="text-xl font-medium text-blue-600 dark:text-blue-400">{selectedWord.banglaMeaning}</p>
                  </div>
                  
                  <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-white/5">
                    <div className="bg-slate-50 dark:bg-white/5 p-4 rounded-2xl">
                      <span className="text-[10px] uppercase font-bold text-green-600 dark:text-green-400 tracking-wider mb-1 block">Beginner</span>
                      <p className="text-slate-700 dark:text-white/80">{selectedWord.examples.beginner}</p>
                    </div>
                    <div className="bg-slate-50 dark:bg-white/5 p-4 rounded-2xl">
                      <span className="text-[10px] uppercase font-bold text-blue-600 dark:text-blue-400 tracking-wider mb-1 block">Daily</span>
                      <p className="text-slate-700 dark:text-white/80">{selectedWord.examples.daily}</p>
                    </div>
                    <div className="bg-slate-50 dark:bg-white/5 p-4 rounded-2xl">
                      <span className="text-[10px] uppercase font-bold text-purple-600 dark:text-purple-400 tracking-wider mb-1 block">Professional</span>
                      <p className="text-slate-700 dark:text-white/80">{selectedWord.examples.professional}</p>
                    </div>
                  </div>

                  <div className="pt-4 flex gap-3">
                    <Button 
                      variant="outline" 
                      className="flex-1 rounded-xl"
                      onClick={() => setSelectedWord(null)}
                    >
                      Close
                    </Button>
                    <Button 
                      className="flex-1 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                      onClick={handleSeeDetails}
                    >
                      <Search className="w-4 h-4 mr-2" />
                      See Details
                    </Button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
