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
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const { settings, skills, addFlashcard } = useAppStore();

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
        <form onSubmit={handleSubmit} className="relative w-full group">
          {/* Animated Glow behind the prompt box */}
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/30 via-purple-600/30 to-blue-600/30 rounded-[2.5rem] blur-xl opacity-50 group-hover:opacity-100 transition duration-1000 group-hover:duration-500"></div>
          
          <div className="relative flex flex-col bg-black/40 backdrop-blur-3xl border border-white/10 hover:border-white/20 transition-colors rounded-[2rem] overflow-hidden shadow-2xl">
            {/* Input Area */}
            <div className="flex items-center px-6 py-5 md:py-6">
              <Sparkles className="h-6 w-6 text-blue-400 mr-2 flex-shrink-0 animate-pulse" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Enter a word to explore..."
                className="border-0 bg-transparent text-xl md:text-2xl h-12 px-4 placeholder:text-white/30 text-white focus-visible:ring-0 shadow-none font-medium"
              />
            </div>
            
            {/* Bottom Toolbar */}
            <div className="flex items-center justify-between px-4 py-3 bg-white/5 border-t border-white/10">
              <div className="flex items-center bg-black/20 rounded-xl px-1 py-0.5 border border-white/5">
                <SkillSelector value={skill} onChange={setSkill} />
              </div>
              
              <Button 
                type="submit" 
                disabled={loading || !query.trim()} 
                className="rounded-xl bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/25 px-6 h-10 transition-all font-medium"
              >
                {loading ? (
                  <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Thinking...</>
                ) : (
                  <><ArrowRight className="h-4 w-4 mr-2" /> Explore</>
                )}
              </Button>
            </div>
          </div>
        </form>

        <AnimatePresence>
          {errorMsg && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-center text-sm glass"
            >
              {errorMsg}
            </motion.div>
          )}
        </AnimatePresence>

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
