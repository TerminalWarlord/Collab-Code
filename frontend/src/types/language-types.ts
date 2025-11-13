export const Languages = {
  Javascript: "javascript",
  Typescript: "typescript",
  Java: "java",
  Cpp: "cpp",
  C: "c",
  Python: "python",
} as const;

export type Languages = typeof Languages[keyof typeof Languages];