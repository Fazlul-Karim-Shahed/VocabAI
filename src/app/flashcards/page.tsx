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
        <Button asChild className="bg-blue-600 hover:bg-blue-500 text-white rounded-xl">
          <Link href="/">Search New Words</Link>
        </Button>
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
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSkip}
            className="h-8 px-3 rounded-full bg-white/5 text-white/70 hover:bg-white/10 hover:text-white border border-white/10 text-xs font-medium"
          >
            Skip this time
          </Button>
          <div className="text-sm font-medium text-white/50 bg-white/5 px-3 py-1 rounded-full border border-white/10">
            {currentIndex + 1} / {activeCards.length}
          </div>
        </div>
      </div>

      <div className="w-full relative h-[400px] perspective-1000">
        <AnimatePresence mode="wait" custom={direction}>
          {currentCard && (
            <motion.div
              key={currentCard.id + (isFlipped ? '-flipped' : '-front')}
              custom={direction}
              initial={{ opacity: 0, x: direction > 0 ? 100 : -100, rotateY: isFlipped ? -180 : 0 }}
              animate={{ opacity: 1, x: 0, rotateY: 0 }}
              exit={{ opacity: 0, x: direction > 0 ? -100 : 100, rotateY: isFlipped ? 180 : 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 cursor-pointer"
              onClick={() => setIsFlipped(!isFlipped)}
            >
              <Card className={`w-full h-full glass-card border-white/10 flex flex-col items-center justify-center p-8 text-center transition-colors hover:bg-white/5 ${isFlipped ? 'bg-blue-900/20' : ''}`}>
                <CardContent className="p-0 flex flex-col items-center justify-center w-full h-full">
                  {!isFlipped ? (
                    <>
                      <h3 className="text-4xl font-bold text-white mb-4">{currentCard.word}</h3>
                      <p className="text-white/40 text-sm">Tap to flip</p>
                    </>
                  ) : (
                    <>
                      <h3 className="text-2xl font-bold text-blue-400 mb-4">{currentCard.meaning}</h3>
                      <div className="w-full h-px bg-white/10 my-4" />
                      <p className="text-white/80 italic text-lg text-balance">"{currentCard.example}"</p>
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
        className="flex items-center justify-center gap-4 w-full mt-8"
      >
        <Button 
          onClick={(e) => { e.stopPropagation(); handleNext('learning'); }}
          className="flex-1 h-14 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 rounded-2xl"
        >
          <X className="h-5 w-5 mr-2" /> Still Learning
        </Button>
        <Button 
          onClick={(e) => { e.stopPropagation(); handleNext('known'); }}
          className="flex-1 h-14 bg-green-500/10 hover:bg-green-500/20 text-green-500 border border-green-500/20 rounded-2xl"
        >
          <Check className="h-5 w-5 mr-2" /> I Know This
        </Button>
      </motion.div>

      {!isFlipped && (
        <div className="mt-8 text-white/40 flex items-center justify-center gap-2">
          <RefreshCcw className="h-4 w-4" /> Flip card to answer
        </div>
      )}
    </div>
  );
}
