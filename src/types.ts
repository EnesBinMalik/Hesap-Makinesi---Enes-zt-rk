export type Operator = '+' | '-' | '*' | '/' | '%' | '^' | 'sqrt';

export interface CalculationResult {
  num1: number;
  operator: Operator | string;
  num2?: number;
  result: number;
  expression: string;
  matchedCaseCode: string;
  explanation: string;
  steps: string[];
  success: boolean;
  error?: string;
  timestamp: number;
}

export interface CalculationHistoryItem extends CalculationResult {
  id: string;
}

export type ViewMode = 'calculator' | 'visualizer' | 'code_report';
