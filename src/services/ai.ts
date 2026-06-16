import { GoogleGenAI } from "@google/genai";

// Initialize the Gemini API client
// We use a singleton pattern to avoid re-initializing on every render
let aiClient: GoogleGenAI | null = null;

export const getAiClient = () => {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY || (import.meta as any).env?.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      console.error("GEMINI_API_KEY or VITE_GEMINI_API_KEY is missing");
      throw new Error("مفتاح API غير موجود. لحل المشكلة جذرياً: تأكد من إضافة GEMINI_API_KEY أو VITE_GEMINI_API_KEY في إعدادات البيئة (Environment Variables) في حسابك على Vercel وإعادة البناء (Redeploy).");
    }
    aiClient = new GoogleGenAI({ apiKey });
  }
  return aiClient;
};

export const fileToGenerativePart = async (file: File): Promise<{ inlineData: { data: string; mimeType: string } }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      // Remove the data URL prefix (e.g., "data:image/jpeg;base64,")
      const base64Data = base64String.split(',')[1];
      resolve({
        inlineData: {
          data: base64Data,
          mimeType: file.type,
        },
      });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};
