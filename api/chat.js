import { GoogleGenAI } from '@google/genai';

/**
 * Vercel Serverless Function: AI Interview / Course Chat Endpoint
 */
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed. Only POST requests are supported.' });
  }

  try {
    const apiKey = process.env.GEMINI_API_KEY || '';
    if (!apiKey) {
      return res.status(500).json({
        empathy: "AI configuration error: GEMINI_API_KEY environment variable is missing.",
        rephrased: "",
        nextQuestion: "Please configure your GEMINI_API_KEY in Vercel project settings.",
        isScenarioComplete: false,
        performanceSummary: null
      });
    }

    const ai = new GoogleGenAI({ apiKey });
    const { message, conversationState } = req.body || {};

    const systemInstruction = `
You are a helpful Warehouse Supervisor.
Scenario: Associate is 20 minutes late.
Goal: Learner must explain why, apologize, and commit to arriving on time.
Rules:
1. Be empathetic.
2. Provide a simpler version of what the learner said in "rephrased".
3. Ask ONE follow-up question.
4. Keep it simple.
5. If the goal is met, set "isScenarioComplete" to true.

Respond ONLY with a JSON object. NO other text.
{
  "empathy": "...",
  "rephrased": "...",
  "nextQuestion": "...",
  "isScenarioComplete": false,
  "performanceSummary": "..."
}
`;

    const result = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: `${systemInstruction}\n\nLearner Message: "${message || ''}"`
    });
    const responseText = result.text || "";

    const jsonStart = responseText.indexOf('{');
    const jsonEnd = responseText.lastIndexOf('}');
    if (jsonStart === -1 || jsonEnd === -1) {
      throw new Error("Invalid response format: No JSON object found");
    }

    const jsonString = responseText.substring(jsonStart, jsonEnd + 1);
    const structuredResponse = JSON.parse(jsonString);

    return res.status(200).json({
      empathy: structuredResponse.empathy || "",
      rephrased: structuredResponse.rephrased || "",
      nextQuestion: structuredResponse.nextQuestion || "What happened?",
      isScenarioComplete: !!structuredResponse.isScenarioComplete,
      performanceSummary: structuredResponse.performanceSummary || "Good practice!"
    });

  } catch (error) {
    console.error('Error in Vercel /api/chat:', error);
    return res.status(500).json({
      empathy: `AI Error: ${error.message || 'Unknown error'}`,
      rephrased: "",
      nextQuestion: "Please try again.",
      isScenarioComplete: false,
      performanceSummary: null
    });
  }
}
