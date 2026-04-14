import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export interface VideoSegment {
  startTime: number;
  endTime: number;
  script: string;
  description: string;
}

export interface AnalysisResponse {
  segments: VideoSegment[];
  summary: string;
}

export async function analyzeRescueVideo(videoBase64: string, mimeType: string): Promise<AnalysisResponse> {
  const prompt = `
    You are an expert scriptwriter and voiceover artist for animal rescue videos.
    Analyze this video and divide it into precise 6-second segments (0-6s, 6-12s, 12-18s...).
    
    Requirements for each segment:
    1. Focus on the core events. Keep descriptions and scripts concise and punchy.
    2. Create a voiceover script that captures the essential emotion and action in those 6 seconds.
    3. Avoid filler words. Every word should add value and drive the narrative forward.
    4. ALL output content (script, description, summary) MUST be in English.
    
    Return the result as JSON with the following structure:
    {
      "segments": [
        {
          "startTime": 0,
          "endTime": 6,
          "script": "Concise voiceover script in English...",
          "description": "Short, focused description in English..."
        },
        ...
      ],
      "summary": "Brief summary of the video in English"
    }
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: [
      {
        parts: [
          {
            inlineData: {
              mimeType: mimeType,
              data: videoBase64,
            },
          },
          { text: prompt },
        ],
      },
    ],
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          segments: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                startTime: { type: Type.NUMBER },
                endTime: { type: Type.NUMBER },
                script: { type: Type.STRING },
                description: { type: Type.STRING },
              },
              required: ["startTime", "endTime", "script", "description"],
            },
          },
          summary: { type: Type.STRING },
        },
        required: ["segments", "summary"],
      },
    },
  });

  const text = response.text;
  if (!text) throw new Error("Không nhận được phản hồi từ AI");
  
  return JSON.parse(text) as AnalysisResponse;
}

export function generateSRT(segments: VideoSegment[]): string {
  return segments
    .map((segment, index) => {
      const start = formatSRTTime(segment.startTime);
      const end = formatSRTTime(segment.endTime);
      return `${index + 1}\n${start} --> ${end}\n${segment.script}\n`;
    })
    .join("\n");
}

function formatSRTTime(seconds: number): string {
  const date = new Date(0);
  date.setSeconds(seconds);
  const ms = Math.floor((seconds % 1) * 1000);
  const timeStr = date.toISOString().substr(11, 8);
  return `${timeStr},${ms.toString().padStart(3, "0")}`;
}
