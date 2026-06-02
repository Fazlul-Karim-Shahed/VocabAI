import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type AIModel = 'gemini-2.5-flash' | 'gemini-2.5-pro' | 'gemini-3.5-flash' | 'gemini-flash-lite-latest' | 'gemini-flash-latest' | 'groq' | 'openrouter';

export interface AppSettings {
  apiKey: string;
  model: AIModel;
  theme: 'dark' | 'light';
}

export interface Flashcard {
  id: string;
  word: string;
  meaning: string;
  example: string;
  status: 'new' | 'learning' | 'known';
  addedAt: number;
}

export interface SavedResponse {
  id: string;
  word: string;
  content: string;
  savedAt: number;
}

export interface Skill {
  id: string;
  name: string;
  description: string;
  promptTemplate: string;
}

interface AppState {
  settings: AppSettings;
  updateSettings: (settings: Partial<AppSettings>) => void;
  
  flashcards: Flashcard[];
  addFlashcard: (card: Omit<Flashcard, 'id' | 'addedAt' | 'status'>) => void;
  updateFlashcardStatus: (id: string, status: Flashcard['status']) => void;
  removeFlashcard: (id: string) => void;
  
  savedResponses: SavedResponse[];
  saveResponse: (response: Omit<SavedResponse, 'id' | 'savedAt'>) => void;
  removeSavedResponse: (id: string) => void;
  
  skills: Skill[];
  addSkill: (skill: Omit<Skill, 'id'>) => void;
  updateSkill: (id: string, skill: Partial<Skill>) => void;
  removeSkill: (id: string) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      settings: {
        apiKey: '',
        model: 'gemini-3.5-flash',
        theme: 'dark',
      },
      updateSettings: (newSettings) =>
        set((state) => ({ settings: { ...state.settings, ...newSettings } })),
        
      flashcards: [],
      addFlashcard: (card) =>
        set((state) => {
          if (state.flashcards.some((c) => c.word.toLowerCase() === card.word.toLowerCase())) {
            return state; // Already exists
          }
          return {
            flashcards: [
              { ...card, id: crypto.randomUUID(), addedAt: Date.now(), status: 'new' },
              ...state.flashcards,
            ],
          };
        }),
      updateFlashcardStatus: (id, status) =>
        set((state) => ({
          flashcards: state.flashcards.map((c) =>
            c.id === id ? { ...c, status } : c
          ),
        })),
      removeFlashcard: (id) =>
        set((state) => ({
          flashcards: state.flashcards.filter((c) => c.id !== id),
        })),
        
      savedResponses: [],
      saveResponse: (response) =>
        set((state) => {
          if (state.savedResponses.some((r) => r.word.toLowerCase() === response.word.toLowerCase())) {
            return state;
          }
          return {
            savedResponses: [
              { ...response, id: crypto.randomUUID(), savedAt: Date.now() },
              ...state.savedResponses,
            ],
          };
        }),
      removeSavedResponse: (id) =>
        set((state) => ({
          savedResponses: state.savedResponses.filter((r) => r.id !== id),
        })),
        
      skills: [
        { 
          id: 'explain', 
          name: 'Explain Word', 
          description: 'Deep explanation with examples', 
          promptTemplate: `You are VocabAI, an AI-powered English vocabulary teacher for Bangla speakers.
Your task is to explain ONE English word in the simplest, most educational, and visually structured way possible.
Rules:
1. First show: English word, IPA pronunciation, Part of speech, Bangla meaning
2. Then explain the word in VERY easy English.
3. Every difficult English word MUST contain Bangla meaning inside brackets. Example: "strong emotion (শক্তিশালী অনুভূতি)"
4. Explain the origin/etymology simply. Keep it short.
5. Give: noun form, verb form, adjective form, adverb form (if available)
6. Give 3 sentences: Beginner sentence, Daily conversation sentence, Professional/advanced sentence
7. Detect difficult words used in your own explanation. For EACH difficult word: Bangla meaning, Very simple explanation, One easy sentence
8. Add: Synonyms, Antonyms, Common mistakes, Memory tricks
9. Keep response: Short, Beautiful, Easy to scan, Mobile friendly
10. Use markdown sections.
11. Never make the response too long.
12. Use encouraging educational tone.
13. Do NOT act like a chatbot.
14. Do NOT ask follow-up questions.
15. Output should feel like a premium vocabulary learning app.` 
        },
        { id: 'ielts', name: 'IELTS Preparation', description: 'Advanced vocabulary for IELTS', promptTemplate: 'You are an IELTS tutor...' },
        { id: 'spoken', name: 'Spoken English', description: 'Everyday conversational use', promptTemplate: 'You are a spoken English trainer...' },
        { id: 'kids', name: 'Kids Learning', description: 'Very simple, fun explanation', promptTemplate: 'Explain this word to a 5-year-old...' },
        { id: 'advanced', name: 'Advanced Vocabulary', description: 'For academic and professional writing', promptTemplate: 'Provide an advanced academic breakdown...' },
        { id: 'daily', name: 'Daily Conversation', description: 'Casual and informal usage', promptTemplate: 'Explain this for daily casual chat...' },
        { id: 'grammar', name: 'Grammar Help', description: 'Detailed grammatical breakdown', promptTemplate: 'Analyze the grammar of this word...' },
      ],
      addSkill: (skill) =>
        set((state) => ({
          skills: [...state.skills, { ...skill, id: crypto.randomUUID() }],
        })),
      updateSkill: (id, updatedSkill) =>
        set((state) => ({
          skills: state.skills.map((s) => (s.id === id ? { ...s, ...updatedSkill } : s)),
        })),
      removeSkill: (id) =>
        set((state) => ({
          skills: state.skills.filter((s) => s.id !== id),
        })),
    }),
    {
      name: 'vocabai-storage',
    }
  )
);
