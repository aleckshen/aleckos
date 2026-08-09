"use client";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type Props = { content: string };

export function TextViewer({ content }: Props) {
  return (
    <div className="prose prose-invert h-full max-w-none p-6">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
    </div>
  );
}
