"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { RefreshCcw, Check, X, LibraryBig, Trophy, Shuffle } from 'lucide-react';
import Link from 'next/link';

export default function FlashcardsPage() {
  const { flashcards, updateFlashcardStatus } = useAppStore();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [direction, setDirection] = useState(0); // For swipe animation

  const activeCards = flashcards.filter(c => c.status !== 'known');
  const currentCard = activeCards[currentIndex];

  const handleNext = (status: 'learning' | 'known') => {
    if (!currentCard) return;
    
    updateFlashcardStatus(currentCard.id, status);
    setIsFlipped(false);
    setDirection(status === 'known' ? 1 : -1);
    
    const nextLength = status === 'known' ? activeCards.length - 1 : activeCards.length;
    
    if (nextLength === 0) return;

    // Default to sequential
    if (status === 'known') {
      if (currentIndex >= nextLength) {
        setCurrentIndex(0);
      }
    } else {
      if (currentIndex < nextLength - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        setCurrentIndex(0);
      }
    }
  };

  const handleSkip = () => {
    if (activeCards.length > 1) {
      let nextIndex = Math.floor(Math.random() * activeCards.length);
      while (nextIndex === currentIndex) {
        nextIndex = Math.floor(Math.random() * activeCards.length);
      }
      setIsFlipped(false);
      setDirection(1);
      setCurrentIndex(nextIndex);
    }
  };

  if (activeCards.length === 0) {
    return (
      <div className="container max-w-4xl mx-auto px-4 py-24 flex flex-col items-center justify-center text-center">
        <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-6 border border-white/10">
          <Trophy className="h-12 w-12 text-yellow-500" />
        </div>
        <h2 className="text-3xl font-bold text-white mb-4">You're all caught up!</h2>
        <p className="text-white/60 mb-8 max-w-md">
          You've reviewed all your flashcards. Search for new words to add more cards to your collection.
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
    <div className="container max-w-lg mx-auto px-4 py-12 flex flex-col items-center">
      <div className="w-full flex items-center justify-between mb-8">
        <div className="flex items-center gap-2 text-white/80">
          <LibraryBig className="h-5 w-5" />
          <span className="font-medium">Practice</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-sm font-medium text-white/50 bg-white/5 px-4 py-1.5 rounded-full border border-white/10">
            {currentIndex + 1} / {activeCards.length}
          </div>
        </div>
      </div>

      <div className="w-full relative h-[420px] perspective-1000 group">
        {/* Animated Glow behind the flashcard */}
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
              <Card className={`w-full h-full glass bg-black/40 backdrop-blur-2xl border-white/10 flex flex-col items-center justify-center p-8 text-center transition-all shadow-2xl rounded-[2rem] hover:border-white/20 ${isFlipped ? 'bg-gradient-to-br from-blue-900/30 to-purple-900/10' : ''}`}>
                <CardContent className="p-0 flex flex-col items-center justify-center w-full h-full">
                  {!isFlipped ? (
                    <>
                      <h3 className="text-5xl font-extrabold text-white mb-6 tracking-tight bg-clip-text text-transparent bg-gradient-to-br from-white to-white/60">{currentCard.word}</h3>
                      <div className="flex items-center gap-2 text-white/30 text-sm mt-4">
                        <RefreshCcw className="h-4 w-4 animate-pulse" />
                        <span>Tap to flip</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <h3 className="text-3xl font-bold text-blue-400 mb-6 drop-shadow-sm">{currentCard.meaning}</h3>
                      <div className="w-full max-w-[80%] h-px bg-gradient-to-r from-transparent via-white/20 to-transparent my-6" />
                      <p className="text-white/80 italic text-xl text-balance leading-relaxed">"{currentCard.example}"</p>
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
        className="flex flex-col gap-4 w-full mt-10 z-10"
      >
        <div className="flex items-center justify-center gap-4 w-full">
          <Button 
            onClick={(e) => { e.stopPropagation(); handleNext('learning'); }}
            className="flex-1 h-14 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-2xl text-lg font-medium shadow-lg shadow-red-500/5 transition-all"
          >
            <X className="h-5 w-5 mr-2" /> Still Learning
          </Button>
          <Button 
            onClick={(e) => { e.stopPropagation(); handleNext('known'); }}
            className="flex-1 h-14 bg-green-500/10 hover:bg-green-500/20 text-green-400 border border-green-500/20 rounded-2xl text-lg font-medium shadow-lg shadow-green-500/5 transition-all"
          >
            <Check className="h-5 w-5 mr-2" /> I Know This
          </Button>
        </div>
        
        <div className="flex justify-center mt-2">
          <Button
            variant="ghost"
            onClick={handleSkip}
            className="text-white/40 hover:text-white/80 hover:bg-white/5 rounded-xl h-10 px-6 font-medium transition-colors"
          >
            Skip this time
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
