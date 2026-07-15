export type Complexity = "Low" | "Medium" | "High";

export const reportUsers = [
  "Lucas Levandoski",
  "Jose Bustos",
  "Victor Castro",
] as const;

export const reportModels = [
   "Claude Sonnet 5",                                                                                                                        
   "Claude Sonnet 4.6",                                                                                                                                
   "Claude Sonnet 4.5",                                                                                                                                                     
   "Claude Haiku 4.5",                                                                                                                                                     
   "Claude Opus 4.8",                                                                                                                                
   "Claude Opus 4.8",                                                                                                                              
   "Claude Opus 4.6",                                                                                                                               
   "GPT-5.5",                                                                                                                                
   "GPT-5.4",                                                                                                                               
   "GPT-5.3-Codex",                                                                                                                                
   "GPT-5.4 mini",                                                                                                                                
   "Gemini 3.1 Pro",                                                                                                                            
   "Gemini 3.5 Flash",                                                                                                                                
   "MAI-Code-1-Flash",
] as const;

export type ReportUser = (typeof reportUsers)[number];
export type ReportModel = (typeof reportModels)[number];

export function isReportUser(value: string): value is ReportUser {
  return reportUsers.includes(value as ReportUser);
}

export function isReportModel(value: string): value is ReportModel {
  return reportModels.includes(value as ReportModel);
}

export type Project = {
  id: number;
  name: string;
  createdAt: string;
};

export type RunReport = {
  id?: number;
  projectName: string;
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
  projectName: string;
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
