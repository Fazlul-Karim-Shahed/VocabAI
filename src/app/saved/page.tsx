"use client";

import { useAppStore } from '@/lib/store';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bookmark, Clock, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ResponseCard } from '@/components/ResponseCard';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SavedPage() {
  const { savedResponses, removeSavedResponse } = useAppStore();
  const [selectedWord, setSelectedWord] = useState<string | null>(null);

  const selectedResponse = savedResponses.find(r => r.id === selectedWord);

  if (savedResponses.length === 0) {
    return (
      <div className="container max-w-4xl mx-auto px-4 py-24 flex flex-col items-center justify-center text-center">
        <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-6 border border-white/10">
          <Bookmark className="h-12 w-12 text-blue-500/50" />
        </div>
        <h2 className="text-3xl font-bold text-white mb-4">No saved words yet</h2>
        <p className="text-white/60 mb-8 max-w-md">
          Save your favorite explanations to view them offline anytime.
        </p>
      </div>
    );
  }

  return (
    <div className="container max-w-6xl mx-auto px-4 py-12">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-white/5 rounded-xl border border-white/10">
          <Bookmark className="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-white">Saved Responses</h1>
          <p className="text-white/60 text-sm mt-1">Available offline ({savedResponses.length})</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* List */}
        <div className="lg:col-span-4 space-y-3">
          {savedResponses.map((res) => {
            const data = JSON.parse(res.content);
            const isSelected = selectedWord === res.id;
            return (
              <Card 
                key={res.id} 
                className={`cursor-pointer transition-all border-white/10 overflow-hidden ${isSelected ? 'bg-blue-900/20 ring-1 ring-blue-500/50' : 'bg-white/5 hover:bg-white/10'}`}
                onClick={() => setSelectedWord(res.id)}
              >
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-lg text-white mb-1">{res.word}</h3>
                    <p className="text-sm text-blue-400 line-clamp-1">{data.banglaMeaning}</p>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={(e) => {
                      e.stopPropagation();
                      removeSavedResponse(res.id);
                      if (isSelected) setSelectedWord(null);
                    }}
                    className="text-white/40 hover:text-red-400 hover:bg-red-400/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Detail View */}
        <div className="lg:col-span-8">
          <AnimatePresence mode="wait">
            {selectedResponse ? (
              <motion.div
                key={selectedResponse.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <ResponseCard data={JSON.parse(selectedResponse.content)} />
              </motion.div>
            ) : (
              <div className="h-full min-h-[400px] flex items-center justify-center text-white/40 border border-white/5 rounded-2xl border-dashed bg-white/[0.02]">
                Select a word from the list to view its details.
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
