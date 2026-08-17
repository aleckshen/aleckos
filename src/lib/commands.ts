import { type DocId, documents } from "@/content/documents";

const aboutText = `Hi, I'm Aleck! I'm a third year computer science major studying at the University of Auckland.

Type 'open about.md' for more about me!`;

// hard coded will render from content folder later
const projectsText = `1. uoavc (university of auckland volleyball club website)
2. pylib (python cli tool)
3. aleckos (os themed website)

Type 'open projects.md' for the full write-up.`;

const helpText = `Available commands:
  help            Show this message
  about           About me
  projects        List projects
  ls              List "files"
  open <file>     Open a file in a window (e.g. open about.md)
  clear           Clear the terminal
  whoami          ¯\\_(ツ)_/¯`;

export type CommandResult =
  | { kind: "text"; output: string }
  | { kind: "clear" }
  | { kind: "open"; app: DocId }
  | { kind: "external"; url: string; file: string };

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
    case "whoami":
      return { kind: "text", output: "guest@aleck-os" };
    case "ls":
      return { kind: "text", output: documents.map((d) => d.file).join("  ") };
    case "open": {
      const file = args[0];
      if (!file) return { kind: "text", output: "open: missing file operand" };
      const doc = documents.find((d) => d.file === file);
      if (!doc) return { kind: "text", output: `open: ${file}: No such file` };
      if (doc.kind === "external") {
        return { kind: "external", url: doc.url, file: doc.file };
      }
      return { kind: "open", app: doc.id };
    }
    case "clear":
      return { kind: "clear" };
    default:
      return { kind: "text", output: `command not found: ${cmd}. Try 'help'.` };
  }
}
