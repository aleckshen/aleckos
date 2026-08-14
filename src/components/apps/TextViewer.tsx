"use client";
import ReactMarkdown, { type Components } from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import remarkGfm from "remark-gfm";

type Props = { content: string };

// Defined at module scope so their identities stay stable across renders.
// Inline definitions would remount every rendered element on each re-render,
// which breaks in-flight clicks (the anchor's DOM node gets replaced between
// mousedown and mouseup, so the browser never follows the link).
const remarkPlugins = [remarkGfm];
const rehypePlugins = [rehypeHighlight];
const components: Components = {
  a: ({ ref, node, ...props }) => (
    <a {...props} target="_blank" rel="noopener noreferrer" />
  ),
};

export function TextViewer({ content }: Props) {
  return (
    <div className="prose prose-invert min-h-full max-w-none p-6 pb-10">
      <ReactMarkdown
        remarkPlugins={remarkPlugins}
        rehypePlugins={rehypePlugins}
        components={components}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
