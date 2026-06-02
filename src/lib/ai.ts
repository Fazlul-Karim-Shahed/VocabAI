import { AIModel } from './store';

export interface AIResponseData {
  word: string;
  banglaMeaning: string;
  simpleExplanation: string;
  origin: string;
  forms: {
    noun?: string;
    verb?: string;
    adjective?: string;
    adverb?: string;
  };
  examples: {
    beginner: { english: string; bangla: string };
    daily: { english: string; bangla: string };
    professional: { english: string; bangla: string };
  };
  hardWords: { word: string; bangla: string; explanation: string; example: string }[];
  ipa: string;
  synonyms: { word: string; bangla: string }[];
  antonyms: { word: string; bangla: string }[];
  commonMistakes: string;
  mnemonics: string;
}

const mockResponse = (word: string): AIResponseData => {
  const capWord = word.charAt(0).toUpperCase() + word.slice(1);
  return {
    word: capWord,
    banglaMeaning: "(Mock Bangla meaning for: " + capWord + ")",
    simpleExplanation: `A ${word} is a type of concept or entity. As a verb, it means to engage in an action related to ${word}.`,
    origin: `From Old English or Latin root related to '${word}'.`,
    forms: {
      noun: word,
      verb: word,
    },
    examples: {
      beginner: { english: `I saw a big ${word} in the park.`, bangla: `আমি পার্কে একটি বড় ${word} দেখেছি।` },
      daily: { english: `Please don't use ${word} so casually.`, bangla: `দয়া করে এতো সহজে ${word} ব্যবহার করবেন না।` },
      professional: { english: `The scientists continued to study the phenomenon of ${word}.`, bangla: `বিজ্ঞানীরা ${word} এর ঘটনা নিয়ে গবেষণা চালিয়ে যান।` }
    },
    hardWords: [
      {
        word: "Phenomenon",
        bangla: "ঘটনা",
        explanation: "A fact or situation that is observed to exist or happen.",
        example: "It is an interesting phenomenon."
      }
    ],
    ipa: `/${word.toLowerCase()}/`,
    synonyms: [{ word: "example1", bangla: "উদাহরণ ১" }, { word: "example2", bangla: "উদাহরণ ২" }],
    antonyms: [{ word: "opposite1", bangla: "বিপরীত ১" }],
    commonMistakes: `People often confuse '${word}' with something else entirely.`,
    mnemonics: `Think of a ${word} making a sound.`
  };
};

import { generateVocabularyResponse } from '@/app/actions/ai';

export const fetchAIExplanation = async (
  word: string,
  model: AIModel,
  apiKey: string,
  promptTemplate: string
): Promise<AIResponseData> => {
  // Always try to call the real Gemini backend. 
  // If the client apiKey is empty, the server will fallback to process.env.GEMINI_API_KEY
  return await generateVocabularyResponse(word, apiKey, promptTemplate, model);
};
