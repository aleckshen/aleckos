import aboutMd from "./markdown/about.md";
import contactMd from "./markdown/contact.md";
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
  {
    kind: "markdown",
    id: "about",
    file: "about.md",
    title: "about",
    content: aboutMd,
  },
  {
    kind: "markdown",
    id: "projects",
    file: "projects.md",
    title: "projects",
    content: projectsMd,
  },
  {
    kind: "markdown",
    id: "experience",
    file: "experience.md",
    title: "experience",
    content: experienceMd,
  },
  {
    kind: "markdown",
    id: "contact",
    file: "contact.md",
    title: "contact",
    content: contactMd,
  },
  {
    kind: "external",
    id: "resume",
    file: "resume.pdf",
    title: "resume",
    url: "/resume.pdf",
  },
] as const;

/**
 * Only markdown documents open in a window, so only their ids are valid
 * AppIds — "resume" opens a browser tab instead and never becomes a window.
 */
type WindowDoc = Extract<(typeof documents)[number], { kind: "markdown" }>;
export type DocId = WindowDoc["id"];
