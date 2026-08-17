import { profile } from "@/content/profile";

const aboutText = `Hi, I'm ${profile.name}. ${profile.role}.`;

// hard coded will render from content folder later
const projectsText = `1. AleckOS — this site (Next.js + Zustand + react-rnd)
2. [Project 2] — short description
3. [Project 3] — short description

Type 'open projects.md' for the full write-up.`;

const contactText = `email:    ${profile.email}
github:   ${profile.github}
linkedin: ${profile.linkedin}`;

const helpText = `Available commands:
  help            Show this message
  about           About me
  projects        List projects
  contact         Contact info
  ls              List "files"
  open <file>     Open a file in a window (e.g. open about.md)
  clear           Clear the terminal
  whoami          ¯\\_(ツ)_/¯`;

/** Files that `open` can launch into a window, keyed by filename. */
const openable = {
  "about.md": "about",
  "projects.md": "projects",
  "experience.md": "experience",
} as const;

export type CommandResult =
  | { kind: "text"; output: string }
  | { kind: "clear" }
  | { kind: "open"; app: "about" | "projects" | "experience" };

export function runCommand(input: string): CommandResult {
  const [cmd, ...args] = input.trim().split(/\s+/);
  switch (cmd) {
    case "":
      return { kind: "text", output: "" };
    case "help":
      return { kind: "text", output: helpText };
    case "about":
      return { kind: "text", output: aboutText };
    case "projects":
      return { kind: "text", output: projectsText };
    case "contact":
      return { kind: "text", output: contactText };
    case "whoami":
      return { kind: "text", output: "guest@aleck-os" };
    case "ls":
      return { kind: "text", output: Object.keys(openable).join("  ") };
    case "open": {
      const file = args[0];
      if (!file) return { kind: "text", output: "open: missing file operand" };
      const app = openable[file as keyof typeof openable];
      if (app) return { kind: "open", app };
      return { kind: "text", output: `open: ${file}: No such file` };
    }
    case "clear":
      return { kind: "clear" };
    default:
      return { kind: "text", output: `command not found: ${cmd}. Try 'help'.` };
  }
}
