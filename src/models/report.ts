export type Complexity = "Low" | "Medium" | "High";

export const reportUsers = [
  "Lucas Levandoski",
  "Jose Bustos",
  "Victor Castro",
] as const;

export const reportModels = [
  "GPT-4o",
  "GPT-4.1",
  "Claude 3.7 Sonnet",
  "Claude 4 Sonnet",
  "Gemini 2.5 Pro",
  "Llama 3.1 405B",
  "DeepSeek V3",
] as const;

export type ReportUser = (typeof reportUsers)[number];
export type ReportModel = (typeof reportModels)[number];

export function isReportUser(value: string): value is ReportUser {
  return reportUsers.includes(value as ReportUser);
}

export function isReportModel(value: string): value is ReportModel {
  return reportModels.includes(value as ReportModel);
}

export type RunReport = {
  user: ReportUser;
  taskId: string;
  taskName: string;
  personalDescription: string;
  complexity: Complexity;
  estimatedTime: number;
  realTime: number;
  tokenUsage: number;
  models: ReportModel[];
  iterations: number;
  codeQuality: number;
  codeQualityDescription: string;
};

export type RunFormState = {
  user: ReportUser | "";
  taskId: string;
  taskName: string;
  personalDescription: string;
  complexity: Complexity;
  estimatedTime: string;
  realTime: string;
  tokenUsage: string;
  models: ReportModel[];
  iterations: string;
  codeQuality: string;
  codeQualityDescription: string;
};

export type ReportSummary = {
  reportCount: number;
  totalEstimated: number;
  totalReal: number;
  totalTokens: number;
};
