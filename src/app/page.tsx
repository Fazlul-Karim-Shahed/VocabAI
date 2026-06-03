"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight, Loader2, Settings2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { fetchAIExplanation, AIResponseData } from '@/lib/ai';
import { ResponseCard } from '@/components/ResponseCard';
import { SkillSelector } from '@/components/SkillSelector';
import { useAppStore } from '@/lib/store';

const PHRASES = [
  "the perfect word.",
  "deeper meanings.",
  "better articulation.",
  "effortless fluency.",
  "smarter vocabulary."
];

export default function Home() {
  const [query, setQuery] = useState('');
  const [skill, setSkill] = useState('explain');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<AIResponseData | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const { settings, skills, addFlashcard } = useAppStore();
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    const currentPhrase = PHRASES[phraseIndex];
    
    if (!isDeleting) {
      if (displayText.length < currentPhrase.length) {
        timeout = setTimeout(() => {
          setDisplayText(currentPhrase.slice(0, displayText.length + 1));
        }, 50); // typing speed
      } else {
        timeout = setTimeout(() => {
          setIsDeleting(true);
        }, 2500); // pause before deleting
      }
    } else {
      if (displayText.length > 0) {
        timeout = setTimeout(() => {
          setDisplayText(currentPhrase.slice(0, displayText.length - 1));
        }, 30); // deleting speed
      } else {
        setIsDeleting(false);
        setPhraseIndex((prev) => (prev + 1) % PHRASES.length);
      }
    }
    
    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, phraseIndex]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    // Extract word from "/Explain Word" format if present
    const word = query.replace(/^\/(.*?)\s+/i, '').trim();
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
              <div className="inline-flex items-center mt-2 sm:mt-1 md:mt-0 h-[1.2em]">
                <span className="text-blue-600 dark:text-blue-400 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 pb-2 md:pb-4 pr-[2px]">
                  {displayText}
                </span>
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [1, 0] }}
                  transition={{ duration: 0.8, repeat: Infinity, ease: "steps(2)" }}
                  className="inline-block w-[3px] md:w-[4px] h-[0.85em] bg-blue-500 dark:bg-blue-400 rounded-full -translate-y-[0.1em]"
                />
              </div>
            </h1>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search Section - Upgraded Premium Pill Prompt Box */}
      <motion.div 
        layout
        className="w-full z-10 relative"
      >
        <form onSubmit={handleSubmit} className="relative w-full group flex flex-col gap-6">
          {/* Ambient Glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[90%] h-full bg-gradient-to-r from-blue-400/20 via-purple-400/20 to-blue-400/20 dark:from-blue-500/20 dark:via-purple-500/20 dark:to-blue-500/20 blur-3xl rounded-[3rem] pointer-events-none opacity-0 group-focus-within:opacity-100 transition-opacity duration-1000 mix-blend-multiply dark:mix-blend-screen" />
          
          <div className="group/input relative flex items-center bg-white/80 dark:bg-black/50 backdrop-blur-3xl border border-slate-200/80 dark:border-white/10 rounded-[3rem] p-2 sm:p-2.5 shadow-xl shadow-blue-900/5 dark:shadow-blue-900/20 transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/10 dark:hover:shadow-blue-500/20 hover:border-blue-300 dark:hover:border-blue-500/50 focus-within:ring-4 focus-within:ring-blue-500/20 dark:focus-within:ring-blue-400/20 focus-within:border-blue-500/50 dark:focus-within:border-blue-400/50 overflow-hidden">
            {/* Shimmer effect on hover */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 dark:via-white/5 to-transparent -translate-x-[150%] group-hover/input:translate-x-[150%] transition-transform duration-1000 ease-in-out pointer-events-none" />
            
            <div className="relative pl-5 pr-2 text-slate-400 dark:text-white/40 group-focus-within/input:text-blue-600 dark:group-focus-within/input:text-blue-400 transition-colors">
              <Sparkles className="h-6 w-6 md:h-7 md:w-7 transition-transform duration-500 group-focus-within/input:rotate-12 group-focus-within/input:scale-110" />
            </div>
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="What to learn today?"
              className="relative flex-1 border-0 bg-transparent dark:bg-transparent text-base sm:text-2xl md:text-3xl h-14 sm:h-16 md:h-20 px-2 placeholder:text-slate-400/70 dark:placeholder:text-white/30 text-slate-900 dark:text-white focus-visible:ring-0 shadow-none font-semibold tracking-tight overflow-hidden text-ellipsis"
            />
            <Button 
              type="submit" 
              disabled={loading || !query.trim()} 
              className="relative h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 dark:from-blue-500 dark:to-indigo-500 text-white shadow-lg shadow-blue-500/30 dark:shadow-blue-500/20 transition-all duration-300 hover:scale-105 active:scale-95 flex-shrink-0 ml-1 sm:ml-2 disabled:opacity-50 disabled:hover:scale-100"
            >
              {loading ? (
                <Loader2 className="h-6 w-6 md:h-7 md:w-7 animate-spin" />
              ) : (
                <ArrowRight className="h-6 w-6 md:h-7 md:w-7 transition-transform duration-300 group-focus-within/input:translate-x-1" />
              )}
            </Button>
          </div>
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 opacity-70 group-focus-within:opacity-100 transition-opacity duration-500 px-2 sm:px-4 mt-2">
            
            {/* Left side: Action pill */}
            <div className="flex items-center gap-2 px-3 py-2 sm:py-1.5 bg-white/60 dark:bg-black/30 backdrop-blur-xl rounded-full border border-slate-200/60 dark:border-white/10 shadow-sm shadow-slate-200/50 dark:shadow-none w-fit">
              <div className="flex items-center gap-1.5 opacity-60">
                <Settings2 className="h-3.5 w-3.5 text-slate-600 dark:text-white/70" />
                <span className="text-[11px] font-bold text-slate-600 dark:text-white/70 uppercase tracking-widest">Skill</span>
              </div>
              <div className="w-px h-3.5 bg-slate-300 dark:bg-white/20 mx-0.5"></div>
              <SkillSelector value={skill} onChange={setSkill} />
            </div>
            
            {/* Right side: Example Chips */}
            <AnimatePresence>
              {!response && !loading && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-wrap items-center gap-2"
                >
                  <span className="text-[11px] font-semibold text-slate-400 dark:text-white/40 uppercase tracking-wider mr-1 hidden sm:block">Try</span>
                  {['/Explain Serendipity', '/Explain Ephemeral', '/Explain Eloquent'].map((ex) => (
                    <button
                      key={ex}
                      type="button"
                      onClick={() => handleExampleClick(ex)}
                      className="group/btn relative px-3 py-1.5 sm:py-1 rounded-full bg-slate-100 dark:bg-white/5 hover:bg-white dark:hover:bg-white/10 border border-slate-200/50 dark:border-white/5 hover:border-blue-200 dark:hover:border-blue-500/30 hover:shadow-md hover:shadow-blue-500/10 dark:hover:shadow-blue-500/20 text-xs font-medium text-slate-600 dark:text-white/70 hover:text-blue-600 dark:hover:text-blue-300 transition-all duration-300 flex items-center justify-center overflow-hidden"
                    >
                      <Sparkles className="h-3 w-3 opacity-0 group-hover/btn:opacity-100 text-blue-500 transition-all duration-300 absolute left-2 -translate-x-2 group-hover/btn:translate-x-0" />
                      <span className="group-hover/btn:translate-x-2 transition-transform duration-300">
                        {ex.replace('/Explain ', '')}
                      </span>
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
