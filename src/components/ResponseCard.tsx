import { useState } from 'react';
import { AIResponseData } from '@/lib/ai';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bookmark, Copy, Volume2, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { motion, AnimatePresence } from 'framer-motion';

export function ResponseCard({ data }: { data: AIResponseData }) {
  const [copied, setCopied] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>('meaning');
  const { saveResponse, savedResponses, removeSavedResponse } = useAppStore();

  const isSaved = savedResponses.some((r) => r.word === data.word);

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = () => {
    if (isSaved) {
      const saved = savedResponses.find(r => r.word === data.word);
      if (saved) removeSavedResponse(saved.id);
    } else {
      saveResponse({
        word: data.word,
        content: JSON.stringify(data),
      });
    }
  };

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      window.speechSynthesis.speak(utterance);
    }
  };

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const SectionHeader = ({ id, title }: { id: string, title: string }) => (
    <button
      onClick={() => toggleSection(id)}
      className="flex w-full items-center justify-between py-3 text-left font-semibold text-white/90 hover:text-white transition-colors"
    >
      <span>{title}</span>
      {expandedSection === id ? (
        <ChevronUp className="h-5 w-5 text-white/50" />
      ) : (
        <ChevronDown className="h-5 w-5 text-white/50" />
      )}
    </button>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-3xl mx-auto"
    >
      <Card className="glass-card border-white/10 shadow-2xl overflow-hidden rounded-2xl relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />
        <CardContent className="p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-8">
            <div>
              <div className="flex items-end gap-3 mb-2">
                <h2 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">
                  {data.word}
                </h2>
                <span className="text-lg text-white/40 mb-1 font-mono">{data.ipa}</span>
                <Button variant="ghost" size="icon" onClick={() => speak(data.word)} className="h-8 w-8 text-white/60 hover:text-white hover:bg-white/10 rounded-full mb-1">
                  <Volume2 className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xl md:text-2xl font-medium text-blue-400">
                {data.banglaMeaning}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopy}
                className="bg-white/5 border-white/10 text-white/80 hover:bg-white/10 hover:text-white"
              >
                {copied ? <CheckCircle2 className="h-4 w-4 mr-2 text-green-400" /> : <Copy className="h-4 w-4 mr-2" />}
                {copied ? 'Copied' : 'Copy'}
              </Button>
              <Button
                variant={isSaved ? "default" : "outline"}
                size="sm"
                onClick={handleSave}
                className={isSaved 
                  ? "bg-blue-600 hover:bg-blue-700 text-white"
                  : "bg-white/5 border-white/10 text-white/80 hover:bg-white/10 hover:text-white"}
              >
                <Bookmark className={`h-4 w-4 mr-2 ${isSaved ? "fill-white" : ""}`} />
                {isSaved ? 'Saved' : 'Save'}
              </Button>
            </div>
          </div>

          <div className="space-y-2 divide-y divide-white/5">
            {/* Meaning Section */}
            <div className="py-2">
              <SectionHeader id="meaning" title="Meaning & Origin" />
              <AnimatePresence>
                {expandedSection === 'meaning' && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden text-white/70 space-y-4"
                  >
                    <div>
                      <h4 className="text-sm font-medium text-white/50 mb-1 uppercase tracking-wider">Simple Explanation</h4>
                      <p className="text-base leading-relaxed">{data.simpleExplanation}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-white/50 mb-1 uppercase tracking-wider">Origin</h4>
                      <p className="text-base leading-relaxed">{data.origin}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-white/50 mb-2 uppercase tracking-wider">Forms</h4>
                      <div className="flex flex-wrap gap-2">
                        {Object.entries(data.forms).map(([key, value]) => value && (
                          <Badge key={key} variant="secondary" className="bg-white/5 hover:bg-white/10 text-white/80 border border-white/10">
                            <span className="text-white/40 mr-1">{key}</span> {value}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Examples Section */}
            <div className="py-2">
              <SectionHeader id="examples" title="Examples" />
              <AnimatePresence>
                {expandedSection === 'examples' && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden space-y-4"
                  >
                    {[
                      { level: 'Beginner', text: data.examples.beginner, color: 'text-green-400', bg: 'bg-green-500/10' },
                      { level: 'Daily', text: data.examples.daily, color: 'text-blue-400', bg: 'bg-blue-500/10' },
                      { level: 'Professional', text: data.examples.professional, color: 'text-purple-400', bg: 'bg-purple-500/10' },
                    ].map((ex) => (
                      <div key={ex.level} className="flex flex-col gap-1 p-3 rounded-xl bg-white/5 border border-white/5">
                        <span className={`text-xs font-semibold uppercase tracking-wider ${ex.color}`}>{ex.level}</span>
                        <p className="text-white/90 text-lg">{ex.text}</p>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Vocabulary Breakdown Section */}
            <div className="py-2">
              <SectionHeader id="breakdown" title="Hard Words Explained" />
              <AnimatePresence>
                {expandedSection === 'breakdown' && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden space-y-3"
                  >
                    {data.hardWords.map((hw, i) => (
                      <div key={i} className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-2">
                        <div className="flex items-baseline gap-2">
                          <span className="font-semibold text-white">{hw.word}</span>
                          <span className="text-sm text-blue-400">{hw.bangla}</span>
                        </div>
                        <p className="text-sm text-white/70">{hw.explanation}</p>
                        <p className="text-sm text-white/50 italic">"{hw.example}"</p>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Extras Section */}
            <div className="py-2">
              <SectionHeader id="extras" title="Extras" />
              <AnimatePresence>
                {expandedSection === 'extras' && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden space-y-4"
                  >
                    <div className="flex flex-col gap-4 md:flex-row">
                      <div className="flex-1 p-4 rounded-xl bg-white/5 border border-white/5">
                        <h4 className="text-sm font-medium text-white/50 mb-2 uppercase tracking-wider">Synonyms</h4>
                        <div className="flex flex-wrap gap-2">
                          {data.synonyms.map((syn, i) => (
                            <Badge key={i} variant="outline" className="border-white/10 text-white/70">
                              {syn}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="flex-1 p-4 rounded-xl bg-white/5 border border-white/5">
                        <h4 className="text-sm font-medium text-white/50 mb-2 uppercase tracking-wider">Antonyms</h4>
                        <div className="flex flex-wrap gap-2">
                          {data.antonyms.map((ant, i) => (
                            <Badge key={i} variant="outline" className="border-white/10 text-white/70">
                              {ant}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20">
                      <h4 className="text-sm font-medium text-yellow-500/80 mb-1 uppercase tracking-wider">Common Mistakes</h4>
                      <p className="text-sm text-white/80">{data.commonMistakes}</p>
                    </div>

                    <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/20">
                      <h4 className="text-sm font-medium text-purple-400/80 mb-1 uppercase tracking-wider">Memory Trick</h4>
                      <p className="text-sm text-white/80">{data.mnemonics}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
