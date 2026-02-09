
import { GoogleGenAI, Type } from "@google/genai";
import { FoodInfo, MealPlan, UserProfile, ChatMessage, MealAnalysisResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getFoodNutrition = async (foodName: string, profile: UserProfile): Promise<FoodInfo> => {
  const prompt = `Analise o alimento: ${foodName}. Considere que o usuário tem Diabetes ${profile.diabetesType === 'Type1' ? 'Tipo 1' : 'Tipo 2'}. 
  Forneça dados nutricionais precisos e um conselho de se é bom ou não para o consumo dele.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          calories: { type: Type.NUMBER },
          carbs: { type: Type.NUMBER },
          protein: { type: Type.NUMBER },
          fat: { type: Type.NUMBER },
          fiber: { type: Type.NUMBER },
          glycemicIndex: { type: Type.NUMBER },
          servingSize: { type: Type.STRING },
          diabeticSuitability: { type: Type.STRING },
          isGood: { type: Type.BOOLEAN },
        },
        required: ["name", "calories", "carbs", "isGood", "diabeticSuitability"]
      },
    },
  });

  return JSON.parse(response.text);
};

export const analyzeMealDescription = async (description: string, profile: UserProfile): Promise<MealAnalysisResult> => {
  const prompt = `Analise a seguinte descrição de refeição: "${description}". 
  Identifique cada item, estime as porções padrão se não especificadas, e calcule o total de calorias, carboidratos, proteínas e gorduras. 
  Forneça um conselho específico para um diabético do ${profile.diabetesType === 'Type1' ? 'Tipo 1' : 'Tipo 2'}.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          totalCalories: { type: Type.NUMBER },
          totalCarbs: { type: Type.NUMBER },
          totalProtein: { type: Type.NUMBER },
          totalFat: { type: Type.NUMBER },
          items: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                calories: { type: Type.NUMBER },
                carbs: { type: Type.NUMBER },
                amount: { type: Type.STRING }
              }
            }
          },
          advice: { type: Type.STRING }
        },
        required: ["totalCalories", "totalCarbs", "items", "advice"]
      }
    }
  });

  return JSON.parse(response.text);
};

export const generateMealPlan = async (profile: UserProfile, currentGlucose: number): Promise<MealPlan> => {
  let status = currentGlucose > profile.targetRangeMax ? 'ALTA' : (currentGlucose < profile.targetRangeMin ? 'BAIXA' : 'NORMAL');
  
  const prompt = `Crie um plano alimentar diário focado em CORRIGIR ou MANTER a glicemia.
  Glicemia Atual: ${currentGlucose} mg/dL (Status: ${status}).
  Perfil do Usuário: Diabético ${profile.diabetesType === 'Type1' ? 'Tipo 1' : 'Tipo 2'}, ${profile.age} anos.
  O plano deve ser específico para o estado atual da glicemia. 
  Se ALTA, foque em baixo índice glicêmico e fibras. Se BAIXA, foque em estabilização.
  Explique detalhadamente como esse plano ajuda na glicemia atual.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          breakfast: { type: Type.STRING },
          snack1: { type: Type.STRING },
          lunch: { type: Type.STRING },
          snack2: { type: Type.STRING },
          dinner: { type: Type.STRING },
          eveningSnack: { type: Type.STRING },
          dailyAdvice: { type: Type.STRING },
          explanation: { type: Type.STRING, description: "Explicação técnica de como este plano ajuda a baixar ou subir a glicemia atual." },
        },
        required: ["breakfast", "lunch", "dinner", "explanation"]
      }
    }
  });

  const data = JSON.parse(response.text);
  return {
    ...data,
    id: Math.random().toString(36).substr(2, 9),
    date: new Date().toISOString(),
    glucoseLevel: currentGlucose,
    glucoseStatus: status as any
  };
};

export const chatWithAssistant = async (history: ChatMessage[], message: string, profile: UserProfile) => {
  const chat = ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: {
      systemInstruction: `Você é um educador em diabetes e nutricionista especializado. 
      O usuário tem Diabetes ${profile.diabetesType === 'Type1' ? 'Tipo 1' : 'Tipo 2'}. 
      Responda de forma empática, técnica porém acessível. SEMPRE inclua um aviso de que você é uma IA e ele deve consultar um médico real.`,
    }
  });

  const response = await chat.sendMessage({ message });
  return response.text;
};
