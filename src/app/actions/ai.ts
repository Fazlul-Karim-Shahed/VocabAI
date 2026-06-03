"use server";

import { GoogleGenAI, Type } from "@google/genai";
import { AIResponseData } from "@/lib/ai";

export async function generateVocabularyResponse(word: string, apiKey: string, promptTemplate: string, modelId: string = "gemini-flash-lite-latest"): Promise<AIResponseData> {
  const finalApiKey = apiKey || process.env.GEMINI_API_KEY;
  
  if (!finalApiKey) {
    throw new Error("No API key provided. Please set it in the Settings page.");
  }

  const ai = new GoogleGenAI({ apiKey: finalApiKey });

  const prompt = `${promptTemplate}

The word to explain is: "${word}"
Please provide a comprehensive explanation for all fields in the JSON structure. Do not skip any fields. Ensure the output is complete and valid JSON. Keep your answers concise and do not repeat words endlessly. Do not include any HTML, CSS, or code snippets in the values.`;

  const responseSchema = {
    type: Type.OBJECT,
    properties: {
      word: { type: Type.STRING },
      banglaMeaning: { type: Type.STRING },
      simpleExplanation: { type: Type.STRING },
      origin: { type: Type.STRING },
      forms: {
        type: Type.OBJECT,
        properties: {
          noun: { type: Type.STRING, nullable: true },
          verb: { type: Type.STRING, nullable: true },
          adjective: { type: Type.STRING, nullable: true },
          adverb: { type: Type.STRING, nullable: true },
        }
      },
      examples: {
        type: Type.OBJECT,
        properties: {
          beginner: { 
            type: Type.OBJECT, 
            properties: { english: { type: Type.STRING }, bangla: { type: Type.STRING } } 
          },
          daily: { 
            type: Type.OBJECT, 
            properties: { english: { type: Type.STRING }, bangla: { type: Type.STRING } } 
          },
          professional: { 
            type: Type.OBJECT, 
            properties: { english: { type: Type.STRING }, bangla: { type: Type.STRING } } 
          },
        }
      },
      hardWords: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            word: { type: Type.STRING },
            bangla: { type: Type.STRING },
            explanation: { type: Type.STRING },
            example: { type: Type.STRING },
          }
        }
      },
      ipa: { type: Type.STRING },
      synonyms: { 
        type: Type.ARRAY, 
        items: { 
          type: Type.OBJECT,
          properties: {
            word: { type: Type.STRING },
            bangla: { type: Type.STRING }
          }
        } 
      },
      antonyms: { 
        type: Type.ARRAY, 
        items: { 
          type: Type.OBJECT,
          properties: {
            word: { type: Type.STRING },
            bangla: { type: Type.STRING }
          }
        } 
      },
      commonMistakes: { type: Type.STRING },
      mnemonics: { type: Type.STRING },
    },
    required: ["word", "banglaMeaning", "simpleExplanation", "origin", "forms", "examples", "hardWords", "ipa", "synonyms", "antonyms", "commonMistakes", "mnemonics"]
  };

  let response;
  try {
    response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.7,
        topK: 40,
        topP: 0.8,
        maxOutputTokens: 8192,
      }
    });
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    
    const errorMessage = error?.message?.toLowerCase() || "";
    
    if (errorMessage.includes("429") || errorMessage.includes("quota") || errorMessage.includes("resource_exhausted")) {
      throw new Error("You have exceeded your API quota. Please check your API key plan or try again later.");
    } else if (errorMessage.includes("404") || errorMessage.includes("not found")) {
      throw new Error("The AI model is not supported or available for your API key. Please check your settings.");
    } else if (errorMessage.includes("api key") || errorMessage.includes("403") || errorMessage.includes("permission_denied")) {
      throw new Error("Invalid API key. Please verify your API key in the settings.");
    }
    
    throw new Error("An error occurred while connecting to the AI. Please try again.");
  }

  let responseText = response.text || "";
  
  // Sometimes AI wraps JSON in markdown blocks even in JSON mode
  responseText = responseText.replace(/^```json\n?/i, "").replace(/\n?```$/i, "").trim();

  if (!responseText) {
    throw new Error("Empty response from AI");
  }

  try {
    return JSON.parse(responseText) as AIResponseData;
  } catch (error) {
    console.error("Failed to parse JSON response from AI. Raw response:", responseText);
    
    // Attempt to salvage if it was cut off (basic fix for trailing commas or missing brackets)
    try {
      // Extremely basic salvage: if it ends unexpectedly, sometimes we can't save it, but we can try removing trailing commas
      let salvaged = responseText.replace(/,\s*([\]}])/g, '$1');
      return JSON.parse(salvaged) as AIResponseData;
    } catch (e) {
      throw new Error("The AI returned a malformed response (likely got stuck in a loop). Please try generating again.");
    }
  }
}
