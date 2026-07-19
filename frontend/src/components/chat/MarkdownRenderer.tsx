import React from 'react';
import ReactMarkdown, { Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import remarkMath from 'remark-math';
import rehypeRaw from 'rehype-raw';
import rehypeKatex from 'rehype-katex';
import { CodeBlock } from './CodeBlock';
import { TableRenderer, TableHeadRenderer, TableRowRenderer, TableHeaderCellRenderer, TableCellRenderer } from './TableRenderer';
import { ExternalLink } from 'lucide-react';
import 'katex/dist/katex.min.css';

interface MarkdownRendererProps {
  content: string;
}

export const MarkdownRenderer = ({ content }: MarkdownRendererProps) => {
  const components: Components = {
    code({ node, inline, className, children, ...props }: any) {
      const match = /language-(\w+)/.exec(className || '');
      const language = match ? match[1] : '';
      
      if (!inline && match) {
        return (
          <CodeBlock 
            language={language}
            value={String(children).replace(/\n$/, '')} 
          />
        );
      }
      
      return (
        <code className="bg-gray-800/60 rounded px-1.5 py-0.5 text-sm font-mono text-pink-300" {...props}>
          {children}
        </code>
      );
    },
    table: TableRenderer,
    thead: TableHeadRenderer,
    tr: TableRowRenderer,
    th: TableHeaderCellRenderer,
    td: TableCellRenderer,
    a: ({ node, children, href, ...props }) => (
      <a 
        href={href} 
        target="_blank" 
        rel="noopener noreferrer" 
        className="text-blue-400 hover:text-blue-300 hover:underline inline-flex items-center gap-1 transition-colors"
        {...props}
      >
        {children}
        <ExternalLink className="h-3 w-3" />
      </a>
    ),
    h1: ({ children }) => <h1 className="text-3xl font-bold mt-8 mb-4 pb-2 border-b border-gray-700 text-gray-100">{children}</h1>,
    h2: ({ children }) => <h2 className="text-2xl font-bold mt-6 mb-3 text-gray-200">{children}</h2>,
    h3: ({ children }) => <h3 className="text-xl font-semibold mt-5 mb-2 text-gray-200">{children}</h3>,
    p: ({ children }) => <p className="mb-4 leading-relaxed text-gray-300 text-[15px]">{children}</p>,
    ul: ({ children }) => <ul className="list-disc pl-6 mb-4 space-y-1.5 text-gray-300">{children}</ul>,
    ol: ({ children }) => <ol className="list-decimal pl-6 mb-4 space-y-1.5 text-gray-300">{children}</ol>,
    li: ({ children }) => <li className="leading-relaxed">{children}</li>,
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-blue-500 bg-blue-500/10 py-2 pl-4 pr-2 my-4 rounded-r-lg italic text-gray-300">
        {children}
      </blockquote>
    ),
    img: ({ src, alt }) => (
      <div className="my-6 flex justify-center">
        <img 
          src={src} 
          alt={alt} 
          className="rounded-lg border border-gray-700/50 shadow-md max-w-full h-auto object-contain bg-gray-900/50" 
          loading="lazy"
        />
      </div>
    ),
    hr: () => <hr className="my-8 border-gray-700/50" />
  };

  return (
    <div className="markdown-body prose prose-invert max-w-none break-words">
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkBreaks, remarkMath]}
        rehypePlugins={[rehypeRaw, rehypeKatex]}
        components={components}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};
