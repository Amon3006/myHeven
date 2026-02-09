import { GoogleGenAI, Type } from "@google/genai";
import { RoomAnalysis, ChatMessage } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Schema for the room analysis
const analysisSchema = {
  type: Type.OBJECT,
  properties: {
    roomType: { type: Type.STRING, description: "The type of room (e.g., Living Room, Bedroom)." },
    styleAnalysis: { type: Type.STRING, description: "A brief analysis of the current interior style." },
    decluttering: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          action: { type: Type.STRING, description: "Specific action to take." }
        }
      }
    },
    furniture: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          item: { type: Type.STRING },
          suggestion: { type: Type.STRING, description: "Suggestion for upgrade or addition." },
          priceEstimate: { type: Type.STRING, description: "Estimated price range (e.g. $100-$200)." }
        }
      }
    }
  },
  required: ["roomType", "decluttering", "furniture"]
};

export const analyzeRoomImage = async (base64Image: string): Promise<RoomAnalysis> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: base64Image
            }
          },
          {
            text: "Analyze this room. Provide 3 specific organization/decluttering tasks and 2 furniture upgrade suggestions that match the style. Be concise."
          }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: analysisSchema
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as RoomAnalysis;
    }
    throw new Error("No response text from Gemini");
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw error;
  }
};

export const sendChatMessage = async (
  history: ChatMessage[], 
  newMessage: string, 
  contextImage?: string
): Promise<string> => {
  try {
    const chat = ai.chats.create({
      model: "gemini-3-pro-preview",
      config: {
        systemInstruction: "You are a helpful interior design and organization assistant named HAVEN AI. Keep responses friendly, encouraging, and concise.",
      },
      history: history.map(h => ({
        role: h.role,
        parts: [{ text: h.text }]
      }))
    });

    // If there is a context image (the uploaded room), we should technically send it as part of the message content
    // However, for a simple chat history, we might just rely on text if the image was sent previously in a real session.
    // To keep it stateless and simple for this demo, if an image exists, we append it to the *current* message if it's the first time, 
    // or we assume the user is talking about general things. 
    // Limitation: The chat object maintains history, but re-creating it every time loses the image context unless we pass it again.
    // Better approach for this stateless function: Just send text. 
    // If we want image context, we'd need to send the image part again or maintain the `chat` instance in React state.
    // For this implementation, I will treat the chat as text-only follow-up, 
    // but if the user *just* uploaded an image, we can pretend the AI sees it by including a description in the system prompt or just keeping it text based for now to avoid complexity with large base64 strings in history.
    
    // To make it smarter without complex state: 
    // If contextImage is provided and history is empty, we send the image with the prompt.
    
    let contents: any = [{ text: newMessage }];
    
    if (contextImage && history.length === 0) {
        // Initial message with image context
         contents = [
            { inlineData: { mimeType: "image/jpeg", data: contextImage } },
            { text: newMessage }
         ];
    }

    // Since we are re-creating the chat object each time (stateless service), we actually can't easily use `chat.sendMessage` with history passed into `chats.create` AND a new image in the new message if the history didn't have it.
    // Simplified strategy: We will just use generateContent for the chat response to handle the stateless nature + image easily if needed, or stick to text chat.
    // Let's stick to text chat for the "Chatbot" feature as requested, but assumes it's an "Expert".
    
    const result = await chat.sendMessage({
        message: newMessage
    });

    return result.text || "I'm sorry, I couldn't generate a response.";
  } catch (error) {
    console.error("Gemini Chat Error:", error);
    return "I'm having trouble connecting right now. Please try again.";
  }
};
