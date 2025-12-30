
import { GoogleGenAI } from "@google/genai";
import { Project, ProjectStatus } from "../types";

const getAIClient = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getProjectInsights = async (projects: Project[]): Promise<string> => {
  if (projects.length === 0) return "Add some projects to get AI insights!";

  const ai = getAIClient();
  const projectSummary = projects.map(p => `- ${p.name} (Owner: ${p.owner}, Status: ${p.status})`).join('\n');
  
  const prompt = `
    As an expert project manager, analyze the following project list and provide a 2-3 sentence summary of current progress, identifying any potential bottlenecks or successes.
    
    Current Projects:
    ${projectSummary}
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        temperature: 0.7,
      },
    });

    return response.text || "Unable to generate insights at this time.";
  } catch (error) {
    console.error("Gemini Insight Error:", error);
    return "Error connecting to AI assistant.";
  }
};

export const getProjectPreview = async (name: string, owner: string, status: ProjectStatus): Promise<string> => {
  const ai = getAIClient();
  
  const prompt = `
    I am about to add a new project to my tracker.
    Project Name: ${name}
    Owner: ${owner}
    Initial Status: ${status}

    Provide 3 brief, high-impact bullet points of suggestions or potential milestones for this specific project. 
    Focus on the ${status} status. Keep it professional and under 60 words total.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        temperature: 0.8,
      },
    });

    return response.text || "Start by defining clear objectives and success metrics.";
  } catch (error) {
    console.error("Gemini Preview Error:", error);
    return "Define your key performance indicators and first major milestone.";
  }
};
