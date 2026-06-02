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
    beginner: string;
    daily: string;
    professional: string;
  };
  hardWords: { word: string; bangla: string; explanation: string; example: string }[];
  ipa: string;
  synonyms: string[];
  antonyms: string[];
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
      beginner: `I saw a big ${word} in the park.`,
      daily: `Please don't use ${word} so casually.`,
      professional: `The scientists continued to study the phenomenon of ${word}.`
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
    synonyms: ["example1", "example2"],
    antonyms: ["opposite1"],
    commonMistakes: `People often confuse '${word}' with something else entirely.`,
    mnemonics: `Think of a ${word} making a sound.`
  };
};

export const fetchAIExplanation = async (
  word: string,
  model: AIModel,
  apiKey: string,
  skill: string
): Promise<AIResponseData> => {
  // In a real app, you would make an API call here.
  // For now, we simulate an API call with a delay.
  
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockResponse(word));
    }, 1500);
  });
};
