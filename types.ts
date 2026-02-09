
export type DiabetesType = 'Type1' | 'Type2';
export type ThemeMode = 'light' | 'dark';

export type MealContext = 
  | 'Antes do café da manhã' 
  | 'Depois do café da manhã' 
  | 'Antes do almoço' 
  | 'Depois do almoço' 
  | 'Antes do jantar' 
  | 'Depois do jantar' 
  | 'Antes de dormir' 
  | 'Outro';

export interface UserProfile {
  name: string;
  age: number;
  weight: number;
  height: number;
  diabetesType: DiabetesType;
  medications: string;
  targetRangeMin: number;
  targetRangeMax: number;
  theme?: ThemeMode;
}

export interface GlucoseEntry {
  id: string;
  value: number;
  timestamp: string;
  mealContext: MealContext;
  notes?: string;
}

export interface FoodInfo {
  name: string;
  calories: number;
  carbs: number;
  protein: number;
  fat: number;
  fiber: number;
  glycemicIndex: number;
  servingSize: string;
  diabeticSuitability: string;
  isGood: boolean;
}

export interface MealAnalysisResult {
  totalCalories: number;
  totalCarbs: number;
  totalProtein: number;
  totalFat: number;
  items: Array<{
    name: string;
    calories: number;
    carbs: number;
    amount: string;
  }>;
  advice: string;
}

export interface MealPlan {
  id: string;
  date: string;
  glucoseLevel: number;
  glucoseStatus: 'Alta' | 'Baixa' | 'Normal';
  breakfast: string;
  snack1: string;
  lunch: string;
  snack2: string;
  dinner: string;
  eveningSnack: string;
  dailyAdvice: string;
  explanation: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}
