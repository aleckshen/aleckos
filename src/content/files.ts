import aboutMd from "./about.md";
import experienceMd from "./experience.md";
import projectsMd from "./projects.md";

export const files = {
  "about.md": aboutMd,
  "projects.md": projectsMd,
  "experience.md": experienceMd,
} as const;

export type FileName = keyof typeof files;
