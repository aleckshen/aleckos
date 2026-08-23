import { type DocId, documents } from "@/content/documents";

const aboutText = `Hi, I'm Aleck! I'm a third year computer science major studying at the University of Auckland.

Type 'open about.md' for more about me!`;

// hard coded will render from content folder later
const projectsText = `1. uoavc (university of auckland volleyball club website)
2. pylib (python cli tool)
3. aleckos (os themed website)

Type 'open projects.md' for the full write-up.`;

export type CommandSpec = {
  name: string;
  /** Operand shown in `help`; its absence is what makes a command no-arg. */
  arg?: string;
  description: string;
};

/** Drives both the `help` listing and argument checking. */
export const COMMANDS: CommandSpec[] = [
  { name: "help", description: "Show this message" },
  { name: "about", description: "About me" },
  { name: "projects", description: "List projects" },
  { name: "ls", description: 'List "files"' },
  { name: "pwd", description: "Print working directory" },
  { name: "open", arg: "<file>", description: "Open a file" },
  { name: "clear", description: "Clear the terminal" },
  { name: "whoami", description: "¯\\_(ツ)_/¯" },
];

export type CommandResult =
  | { kind: "text"; output: string }
  | { kind: "help" }
  | { kind: "clear" }
  | { kind: "open"; app: DocId }
  | { kind: "external"; url: string; file: string };

const NO_ARG_COMMANDS = new Set(
  COMMANDS.filter((c) => !c.arg).map((c) => c.name),
);

export function runCommand(input: string): CommandResult {
  const [cmd, ...args] = input.trim().split(/\s+/);

  // Checked before the switch so unknown commands still fall through to
  // "command not found" rather than complaining about their arguments.
  if (NO_ARG_COMMANDS.has(cmd) && args.length > 0) {
    return { kind: "text", output: `${cmd}: too many arguments` };
  }

  switch (cmd) {
    case "":
      return { kind: "text", output: "" };
    case "help":
      return { kind: "help" };
    case "about":
      return { kind: "text", output: aboutText };
    case "projects":
      return { kind: "text", output: projectsText };
    case "whoami":
      return { kind: "text", output: "guest@aleck-os" };
    case "ls":
      return { kind: "text", output: documents.map((d) => d.file).join("  ") };
    case "pwd":
      return { kind: "text", output: "/home/guest" };
    case "open": {
      const file = args[0];
      if (!file) return { kind: "text", output: "open: missing file operand" };
      if (args.length > 1) {
        return { kind: "text", output: "open: too many arguments" };
      }
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
