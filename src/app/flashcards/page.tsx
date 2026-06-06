"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/lib/store';
import { useAuth } from '@/lib/auth-context';
import { database } from '@/lib/firebase';
import { ref, get, child } from 'firebase/database';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { RefreshCcw, LibraryBig, Trophy, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface FlashcardItem {
  id: string;
  word: string;
  meaning: string;
  example: string;
}

export default function FlashcardsPage() {
  const { savedResponses } = useAppStore();
  const { user, loading: authLoading } = useAuth();
  const [cards, setCards] = useState<FlashcardItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [direction, setDirection] = useState(0); 
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
    if (authLoading) return;
    
    const fetchAndMergeCards = async () => {
      let merged: FlashcardItem[] = [];
      
      // Add local saved words
      const localCards = savedResponses.map(r => {
        let meaning = "No meaning provided";
        let example = "No example provided";
        try {
          const parsed = JSON.parse(r.content);
          meaning = parsed.banglaMeaning || meaning;
          example = parsed.examples?.beginner?.english || example;
        } catch(e) {}
        return {
          id: `local-${r.id}`,
          word: r.word,
          meaning,
          example
        };
      });
      merged = [...localCards];

      // Fetch Firebase history
      if (user) {
        try {
          const dbRef = ref(database);
          const snapshot = await get(child(dbRef, `users/${user.uid}/history`));
          if (snapshot.exists()) {
            const data = snapshot.val();
            const historyCards = Object.keys(data).map(key => ({
              id: `firebase-${key}`,
              word: data[key].word,
              meaning: data[key].banglaMeaning,
              example: data[key].examples?.beginner || data[key].examples?.daily || "No example",
            }));
            merged = [...merged, ...historyCards];
          }
        } catch(e) {
          console.error("Failed to fetch history for flashcards", e);
        }
      }

      // Remove duplicates by word (case-insensitive)
      const uniqueCards: FlashcardItem[] = [];
      const seen = new Set();
      for (const card of merged) {
        const lowerWord = card.word.toLowerCase();
        if (!seen.has(lowerWord)) {
          seen.add(lowerWord);
          uniqueCards.push(card);
        }
      }

      // Shuffle the unique cards
      for (let i = uniqueCards.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [uniqueCards[i], uniqueCards[j]] = [uniqueCards[j], uniqueCards[i]];
      }

      setCards(uniqueCards);
      setLoading(false);
    };

    fetchAndMergeCards();
  }, [user, authLoading, savedResponses]);

  const currentCard = cards[currentIndex];

  if (!mounted || authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 rounded-full border-2 border-blue-500 border-t-transparent animate-spin"></div>
      </div>
    );
  }

  const handleNext = () => {
    if (!currentCard) return;
    setIsFlipped(false);
    setDirection(-1);
    
    if (cards.length > 1) {
      if (currentIndex < cards.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        setCurrentIndex(0); // loop back
      }
    }
  };

  if (cards.length === 0) {
    return (
      <div className="container max-w-4xl mx-auto px-4 py-12 sm:py-24 flex flex-col items-center justify-center text-center">
        <div className="w-24 h-24 bg-slate-100 dark:bg-white/5 rounded-full flex items-center justify-center mb-6 border border-slate-200 dark:border-white/10">
          <Trophy className="h-12 w-12 text-yellow-500" />
        </div>
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">No cards found!</h2>
        <p className="text-slate-600 dark:text-white/60 mb-8 max-w-md">
          Search for new words on the Learn page to build your flashcard collection.
        </p>
        <Link 
          href="/" 
          className="inline-flex items-center justify-center h-10 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-xl transition-colors"
        >
          Search New Words
        </Link>
      </div>
    );
  }

  return (
    <div className="container max-w-lg mx-auto px-4 py-6 sm:py-12 flex flex-col items-center">
      <div className="w-full flex items-center justify-between mb-4 sm:mb-8">
        <div className="flex items-center gap-2 text-slate-700 dark:text-white/80">
          <LibraryBig className="h-5 w-5" />
          <span className="font-medium">Practice ({cards.length} Cards)</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-sm font-medium text-slate-500 dark:text-white/50 bg-slate-200/50 dark:bg-white/5 px-4 py-1.5 rounded-full border border-slate-300 dark:border-white/10">
            {currentIndex + 1} / {cards.length}
          </div>
        </div>
      </div>

      <div className="w-full relative h-[280px] sm:h-[420px] perspective-1000 group">
        <div className="absolute -inset-2 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-blue-600/20 rounded-[2.5rem] blur-xl opacity-40 group-hover:opacity-70 transition duration-1000"></div>

        <AnimatePresence mode="wait" custom={direction}>
          {currentCard && (
            <motion.div
              key={currentCard.id + (isFlipped ? '-flipped' : '-front')}
              custom={direction}
              initial={{ opacity: 0, x: direction > 0 ? 100 : -100, rotateY: isFlipped ? -180 : 0 }}
              animate={{ opacity: 1, x: 0, rotateY: 0 }}
              exit={{ opacity: 0, x: direction > 0 ? -100 : 100, rotateY: isFlipped ? 180 : 0 }}
              transition={{ duration: 0.4, type: "spring", bounce: 0.2 }}
              className="absolute inset-0 cursor-pointer"
              onClick={() => setIsFlipped(!isFlipped)}
            >
              <Card className={`w-full h-full relative glass bg-white/80 dark:bg-black/40 backdrop-blur-2xl border-slate-200 dark:border-white/10 flex flex-col items-center justify-center p-8 text-center transition-all shadow-2xl rounded-[2rem] hover:border-slate-300 dark:hover:border-white/20 ${isFlipped ? 'bg-gradient-to-br from-blue-100 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/10' : ''}`}>
                
                {!isFlipped && (
                  <div className="absolute inset-0 overflow-hidden rounded-[2rem] pointer-events-none opacity-20 dark:opacity-30">
                    <motion.div
                      animate={{
                        x: ['0%', '50%', '-30%', '20%', '0%'],
                        y: ['0%', '-40%', '30%', '-20%', '0%'],
                        scale: [1, 1.2, 0.9, 1.1, 1],
                      }}
                      transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
                      className="absolute top-1/4 left-1/4 w-32 h-32 sm:w-48 sm:h-48 bg-blue-500/60 dark:bg-blue-400/60 rounded-full blur-[40px] sm:blur-[60px]"
                    />
                    <motion.div
                      animate={{
                        x: ['0%', '-40%', '40%', '-10%', '0%'],
                        y: ['0%', '30%', '-50%', '40%', '0%'],
                        scale: [1, 0.9, 1.3, 1, 1],
                      }}
                      transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
                      className="absolute bottom-1/4 right-1/4 w-32 h-32 sm:w-48 sm:h-48 bg-purple-500/60 dark:bg-purple-400/60 rounded-full blur-[40px] sm:blur-[60px]"
                    />
                    <motion.div
                      animate={{
                        x: ['0%', '30%', '-20%', '50%', '0%'],
                        y: ['0%', '50%', '-30%', '10%', '0%'],
                        scale: [1, 1.1, 0.8, 1.2, 1],
                      }}
                      transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
                      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 sm:w-48 sm:h-48 bg-indigo-500/50 dark:bg-indigo-400/50 rounded-full blur-[40px] sm:blur-[60px]"
                    />
                  </div>
                )}

                <CardContent className="relative z-10 p-0 flex flex-col items-center justify-center w-full h-full">
                  {!isFlipped ? (
                    <>
                      <h3 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white mb-4 sm:mb-6 tracking-tight bg-clip-text text-transparent bg-gradient-to-br from-slate-900 to-slate-500 dark:from-white dark:to-white/60 break-words max-w-[90%]">{currentCard.word}</h3>
                      <div className="flex items-center gap-2 text-slate-400 dark:text-white/30 text-sm mt-4">
                        <RefreshCcw className="h-4 w-4 animate-pulse" />
                        <span>Tap to flip</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <h3 className="text-xl sm:text-3xl font-bold text-blue-600 dark:text-blue-400 mb-3 sm:mb-6 drop-shadow-sm px-2">{currentCard.meaning}</h3>
                      <div className="w-full max-w-[80%] h-px bg-gradient-to-r from-transparent via-slate-300 dark:via-white/20 to-transparent my-3 sm:my-6" />
                      <p className="text-slate-700 dark:text-white/80 italic text-base sm:text-xl text-balance leading-relaxed px-2">"{currentCard.example}"</p>
                    </>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-3 sm:gap-4 w-full mt-4 sm:mt-10 z-10"
      >
        <div className="flex justify-center mt-2">
          <Button
            onClick={handleNext}
            className="w-full h-12 sm:h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-base sm:text-lg font-medium shadow-lg shadow-blue-600/20 transition-all"
          >
            Next Flashcard <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
