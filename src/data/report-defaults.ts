import { reportModels, reportUsers } from "@/models/report";
import type { RunFormState, RunReport } from "@/models/report";

export const exampleReports: RunReport[] = [
  {
    user: reportUsers[0],
    taskId: "123123",
    taskName: "Data Processing",
    personalDescription:
      "This task involves processing large datasets to extract meaningful insights.",
    complexity: "High",
    estimatedTime: 5,
    realTime: 2,
    tokenUsage: 15,
    models: [reportModels[0], reportModels[2]],
    iterations: 3,
    codeQuality: 5,
    codeQualityDescription:
      "The code is well-structured, follows best practices, and is easy to maintain.",
  },
];

export const initialFormState: RunFormState = {
  user: "",
  taskId: "",
  taskName: "",
  personalDescription: "",
  complexity: "Medium",
  estimatedTime: "",
  realTime: "",
  tokenUsage: "",
  models: [],
  iterations: "",
  codeQuality: "",
  codeQualityDescription: "",
};
