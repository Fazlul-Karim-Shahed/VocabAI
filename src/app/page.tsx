"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Search, ArrowRight, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { fetchAIExplanation, AIResponseData } from '@/lib/ai';
import { ResponseCard } from '@/components/ResponseCard';
import { SkillSelector } from '@/components/SkillSelector';
import { useAppStore } from '@/lib/store';

export default function Home() {
  const [query, setQuery] = useState('');
  const [skill, setSkill] = useState('explain');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<AIResponseData | null>(null);
  const { settings, addFlashcard } = useAppStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    // Extract word from "?Explain Word" format if present
    const word = query.replace(/^\?(.*?)\s+/i, '').trim();
    if (!word) return;

    setLoading(true);
    try {
      const data = await fetchAIExplanation(word, settings.model, settings.apiKey, skill);
      setResponse(data);
      
      // Auto add to flashcards
      addFlashcard({
        word: data.word,
        meaning: data.banglaMeaning,
        example: data.examples.beginner,
      });
      
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleExampleClick = (example: string) => {
    setQuery(example);
    // Automatically submit or let user submit? Let's just set the query for now.
  };

  return (
    <div className="container px-4 py-12 md:py-24 max-w-5xl mx-auto flex flex-col items-center justify-center min-h-[calc(100vh-4rem)]">
      
      {/* Hero Section - Hidden when there's a response */}
      <AnimatePresence mode="wait">
        {!response && !loading && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-center space-y-6 mb-12 w-full"
          >
            <div className="inline-flex items-center justify-center p-2 bg-blue-500/10 text-blue-400 rounded-2xl mb-4 border border-blue-500/20 glass">
              <Sparkles className="h-5 w-5 mr-2" />
              <span className="text-sm font-medium">AI-Powered Learning</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-br from-white via-white/90 to-white/40">
              Master English<br />Vocabulary Smarter
            </h1>
            <p className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto leading-relaxed">
              Understand words deeply with Bangla explanations, flashcards, and AI-powered learning. Just type a word to begin.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search Section */}
      <motion.div 
        layout
        className="w-full max-w-3xl mx-auto z-10"
      >
        <form onSubmit={handleSubmit} className="relative group flex items-center gap-3 w-full">
          <div className="relative flex-1">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-3xl blur opacity-20 group-hover:opacity-40 transition-opacity duration-500" />
            <div className="relative glass bg-background/50 border-white/10 rounded-3xl flex items-center p-2 focus-within:ring-2 focus-within:ring-blue-500/50 transition-all">
              <Search className="h-6 w-6 text-white/40 ml-4 mr-2 hidden md:block" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Type ?Explain Hound"
                className="border-0 bg-transparent text-lg md:text-2xl h-14 md:h-16 px-4 placeholder:text-white/30 text-white focus-visible:ring-0 shadow-none"
              />
              <div className="mr-2">
                <SkillSelector value={skill} onChange={setSkill} />
              </div>
            </div>
          </div>
          <Button 
            type="submit" 
            disabled={loading || !query.trim()} 
            size="icon"
            className="h-16 w-16 md:h-20 md:w-20 rounded-3xl bg-blue-600 hover:bg-blue-500 text-white shadow-xl shadow-blue-500/20 transition-all flex-shrink-0"
          >
            {loading ? (
              <Loader2 className="h-6 w-6 md:h-8 md:w-8 animate-spin" />
            ) : (
              <ArrowRight className="h-6 w-6 md:h-8 md:w-8" />
            )}
          </Button>
        </form>

        <AnimatePresence>
          {!response && !loading && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mt-8 flex flex-wrap items-center justify-center gap-3"
            >
              <span className="text-sm text-white/40 mr-2">Try examples:</span>
              {['?Explain Hound', '?Explain Elegant', '?Explain Curious'].map((ex) => (
                <button
                  key={ex}
                  type="button"
                  onClick={() => handleExampleClick(ex)}
                  className="px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/5 text-sm text-white/70 transition-colors"
                >
                  {ex}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Response Section */}
      <AnimatePresence>
        {response && (
          <motion.div 
            layout
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full mt-12"
          >
            <ResponseCard data={response} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
