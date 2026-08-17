import aboutMd from "./markdown/about.md";
import experienceMd from "./markdown/experience.md";
import projectsMd from "./markdown/projects.md";

/**
 * The single source of truth for the documents this OS knows about.
 *
 * Adding one here is all that's needed for it to show up in `ls`, be openable
 * with `open <file>`, appear in the file manager, render in a window, and be
 * accepted as a valid `AppId`.
 */
export const documents = [
  { id: "about", file: "about.md", title: "about", content: aboutMd },
  {
    id: "projects",
    file: "projects.md",
    title: "projects",
    content: projectsMd,
  },
  {
    id: "experience",
    file: "experience.md",
    title: "experience",
    content: experienceMd,
  },
] as const;

/** "about" | "projects" | "experience" — derived, so it can never drift. */
export type DocId = (typeof documents)[number]["id"];
