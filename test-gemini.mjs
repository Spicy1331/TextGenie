

import { GoogleGenerativeAI } from '@google/generative-ai';

async function testGemini() {
  try {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_GEMINI_API_KEY;
    if (!apiKey) {
      console.error("No API key found in .env.local");
      return;
    }
    
    console.log("Using API Key starting with:", apiKey.substring(0, 10));
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    
    console.log("Starting chat session...");
    const chatSession = model.startChat({
      generationConfig: {
        temperature: 1,
        topP: 0.95,
        topK: 64,
        maxOutputTokens: 8192,
      },
      history: [],
    });
    
    console.log("Sending test message...");
    const result = await chatSession.sendMessage("Hello, are you working?");
    console.log("Response text:", result.response.text());
    console.log("SUCCESS");
  } catch (error) {
    console.error("FAILED with error:", error);
  }
}

testGemini();
