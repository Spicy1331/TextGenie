
import { GoogleGenerativeAI } from '@google/generative-ai';

async function listModels() {
  try {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_GEMINI_API_KEY;
    if (!apiKey) {
      console.error("No API key found in .env.local");
      return;
    }
    
    console.log("Using API Key starting with:", apiKey.substring(0, 10));
    
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
    if (!response.ok) {
        console.error("Failed to fetch models list! HTTP status:", response.status);
        const text = await response.text();
        console.error("Error body:", text);
        return;
    }
    
    const data = await response.json();
    console.log("Available models for this API key:");
    data.models.filter(m => m.name.includes("gemini")).slice(0, 20).forEach(m => {
        console.log(`- ${m.name}`);
    });
    
  } catch (error) {
    console.error("FAILED with error:", error);
  }
}

listModels();
