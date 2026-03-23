import { GoogleGenAI } from "@google/genai";

export class ImageProcessor {
  static async cropImage(base64Image: string): Promise<string | null> {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Image,
              mimeType: 'image/png',
            },
          },
          {
            text: 'Crop this image to only include the product. Remove all UI elements like headers, backgrounds, and navigation arrows. Return ONLY the cropped image of the product.',
          },
        ],
      },
    });
    
    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return part.inlineData.data;
      }
    }
    return null;
  }
}
