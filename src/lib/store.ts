import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type AIModel = 'openrouter' | 'gemini' | 'groq' | 'huggingface' | 'ollama';

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
        model: 'gemini',
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
        { id: 'explain', name: 'Explain Word', description: 'Deep explanation with examples', promptTemplate: 'You are an English vocabulary teacher...' },
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
