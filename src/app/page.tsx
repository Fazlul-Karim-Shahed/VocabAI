"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { fetchAIExplanation, AIResponseData } from '@/lib/ai';
import { ResponseCard } from '@/components/ResponseCard';
import { SkillSelector } from '@/components/SkillSelector';
import { useAppStore } from '@/lib/store';

const PHRASES = [
  "new words.",
  "fluency.",
  "confidence.",
  "better English."
];

export default function Home() {
  const [query, setQuery] = useState('');
  const [skill, setSkill] = useState('explain');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<AIResponseData | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const { settings, skills, addFlashcard } = useAppStore();
  const [phraseIndex, setPhraseIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPhraseIndex((prev) => (prev + 1) % PHRASES.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    // Extract word from "?Explain Word" format if present
    const word = query.replace(/^\?(.*?)\s+/i, '').trim();
    if (!word) return;

    setLoading(true);
    setErrorMsg(null);
    setResponse(null);
    try {
      const selectedSkill = skills.find((s) => s.id === skill);
      const promptTemplate = selectedSkill?.promptTemplate || "Explain this word.";
      const data = await fetchAIExplanation(word, settings.model, settings.apiKey, promptTemplate);
      setResponse(data);
      
      // Auto add to flashcards
      addFlashcard({
        word: data.word,
        meaning: data.banglaMeaning,
        example: data.examples.beginner.english,
      });
      
    } catch (error: any) {
      console.error(error);
      setErrorMsg(error.message || "An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleExampleClick = (example: string) => {
    setQuery(example);
  };

  return (
    <div className="container px-4 md:px-8 pt-12 pb-12 md:py-8 max-w-4xl mx-auto flex flex-col justify-start md:justify-center flex-1 w-full">
      
      {/* Hero Section - Minimalist Typography with Cycling Text */}
      <AnimatePresence mode="wait">
        {!response && !loading && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="w-full mb-8 md:mb-16 mt-6 md:mt-0"
          >
            <h1 className="text-4xl sm:text-6xl md:text-[5.5rem] font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-br from-slate-900 via-slate-700 to-slate-400 dark:from-white dark:via-white/90 dark:to-white/30 drop-shadow-sm leading-[1.1] md:leading-[1.1] min-h-[120px] md:min-h-[220px]">
              Discover <br />
              <AnimatePresence mode="wait">
                <motion.span
                  key={phraseIndex}
                  initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, y: -20, filter: 'blur(10px)' }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="inline-block text-blue-600 dark:text-blue-400 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400"
                >
                  {PHRASES[phraseIndex]}
                </motion.span>
              </AnimatePresence>
            </h1>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search Section - Upgraded Premium Pill Prompt Box */}
      <motion.div 
        layout
        className="w-full z-10"
      >
        <form onSubmit={handleSubmit} className="relative w-full group flex flex-col gap-6">
          <div className="relative flex items-center bg-white/70 dark:bg-black/40 backdrop-blur-2xl border border-slate-200/80 dark:border-white/10 rounded-[2.5rem] p-2 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgba(255,255,255,0.02)] transition-all duration-500 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:hover:shadow-[0_8px_30px_rgba(255,255,255,0.05)] focus-within:ring-4 focus-within:ring-blue-500/20 dark:focus-within:ring-blue-400/20 focus-within:border-blue-400/50 dark:focus-within:border-blue-400/50">
            <div className="pl-4 pr-2 text-slate-400 dark:text-white/40 group-focus-within:text-blue-500 dark:group-focus-within:text-blue-400 transition-colors">
              <Sparkles className="h-5 w-5 md:h-6 md:w-6" />
            </div>
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Type any word..."
              className="flex-1 border-0 bg-transparent text-xl sm:text-2xl md:text-3xl h-14 md:h-16 px-2 placeholder:text-slate-400 dark:placeholder:text-white/30 text-slate-900 dark:text-white focus-visible:ring-0 shadow-none font-semibold tracking-tight"
            />
            <Button 
              type="submit" 
              disabled={loading || !query.trim()} 
              className="h-12 w-12 md:h-14 md:w-14 rounded-full bg-blue-600 hover:bg-blue-500 dark:bg-blue-500 dark:hover:bg-blue-400 text-white shadow-md transition-all flex-shrink-0 ml-2"
            >
              {loading ? (
                <Loader2 className="h-5 w-5 md:h-6 md:w-6 animate-spin" />
              ) : (
                <ArrowRight className="h-5 w-5 md:h-6 md:w-6" />
              )}
            </Button>
          </div>
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 opacity-70 group-focus-within:opacity-100 transition-opacity duration-500 px-2">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-slate-500 dark:text-white/40">Action:</span>
              <SkillSelector value={skill} onChange={setSkill} />
            </div>
            
            <AnimatePresence>
              {!response && !loading && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-wrap items-center gap-3"
                >
                  {['?Explain Serendipity', '?Explain Ephemeral', '?Explain Eloquent'].map((ex) => (
                    <button
                      key={ex}
                      type="button"
                      onClick={() => handleExampleClick(ex)}
                      className="px-3 py-1.5 rounded-full bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-xs font-medium text-slate-600 dark:text-white/60 transition-colors"
                    >
                      {ex.replace('?Explain ', '')}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </form>

        <AnimatePresence>
          {errorMsg && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-8 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-sm glass-panel"
            >
              {errorMsg}
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
