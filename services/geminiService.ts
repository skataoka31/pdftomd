
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

export class GeminiService {
  // Fix: Removed constructor and class property to instantiate GoogleGenAI inside the method,
  // following the guideline to create a new instance right before making an API call for up-to-date configuration.

  async analyzePDF(fileBase64: string, onUpdate?: (text: string) => void): Promise<string> {
    // Fix: Use the required initialization pattern with process.env.API_KEY
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const model = 'gemini-3-flash-preview';
    
    const prompt = `
      提供されたPDFファイルを解析し、その内容を構造化された美しいマークダウン(Markdown)形式に変換してください。
      以下の指示に従ってください：
      1. 文書のタイトル、見出し、箇条書き、表などを適切にマークダウン要素で表現してください。
      2. 内容は正確に抽出してください。
      3. すべて日本語で出力してください。
      4. 出力はマークダウンのテキストのみにしてください。
    `;

    try {
      // Fix: Use the correct multi-part content structure for text and binary data
      const responseStream = await ai.models.generateContentStream({
        model,
        contents: {
          parts: [
            { text: prompt },
            {
              inlineData: {
                mimeType: 'application/pdf',
                data: fileBase64,
              },
            },
          ],
        },
        config: {
          temperature: 0.1,
          topP: 0.95,
        },
      });

      let fullText = "";
      for await (const chunk of responseStream) {
        // Fix: Use the .text property (getter) as per latest SDK guidelines
        const chunkText = (chunk as GenerateContentResponse).text || "";
        fullText += chunkText;
        if (onUpdate) {
          onUpdate(fullText);
        }
      }

      return fullText;
    } catch (error) {
      console.error("Gemini API解析エラー:", error);
      throw new Error("PDFの解析中にエラーが発生しました。");
    }
  }
}

export const geminiService = new GeminiService();
