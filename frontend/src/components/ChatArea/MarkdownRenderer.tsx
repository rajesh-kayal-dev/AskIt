import React, { useState, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import remarkMath from 'remark-math';
import rehypeRaw from 'rehype-raw';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import { CodeBlock } from './CodeBlock';
import { cn } from '../../lib/utils';
import { Check, Copy } from 'lucide-react';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

const TableContext = React.createContext(false);

const TableWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [copied, setCopied] = useState(false);
  const tableRef = useRef<HTMLTableElement>(null);

  const handleCopy = async () => {
    if (!tableRef.current) return;
    const rows = Array.from(tableRef.current.querySelectorAll('tr'));
    const tsv = rows.map(row => {
      const cells = Array.from(row.querySelectorAll('th, td'));
      return cells.map(cell => cell.textContent?.trim() || '').join('\t');
    }).join('\n');

    try {
      await navigator.clipboard.writeText(tsv);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy table', err);
    }
  };

  return (
    <div className="group relative my-6">
      <button
        onClick={handleCopy}
        className={cn(
          "absolute top-3 right-3 z-10 p-1.5 rounded-lg border-none bg-transparent cursor-pointer transition-all",
          "opacity-0 group-hover:opacity-100 focus:opacity-100 hover:bg-white/5",
          copied ? "text-emerald-400 opacity-100" : "text-gray-400 hover:text-white"
        )}
        title="Copy table"
      >
        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
      </button>
      <div className="overflow-x-auto pr-10">
        <table ref={tableRef} className="w-full text-[14px] text-left border-collapse">
          {children}
        </table>
      </div>
    </div>
  );
};

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content, className }) => {
  return (
    <div className={cn('markdown-body', className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkBreaks, remarkMath]}
      rehypePlugins={[
        rehypeRaw,
        rehypeSlug,
        rehypeKatex
      ]}
      components={{
        code({ node, inline, className, children, ...props }: any) {
          const isInsideTable = React.useContext(TableContext);
          const match = /language-(\w+)/.exec(className || '');
          const language = match ? match[1] : '';
          
          if (!inline && !isInsideTable) {
            return (
              <CodeBlock 
                language={language} 
                value={String(children).replace(/\n$/, '')} 
              />
            );
          }
          
          return (
            <code 
              className={cn('bg-black/10 dark:bg-white/10 rounded px-1.5 py-0.5 text-[0.9em] font-mono', className)} 
              {...props}
            >
              {children}
            </code>
          );
        },
        table({ children, ...props }) {
          return (
            <TableContext.Provider value={true}>
              <TableWrapper {...props}>
                {children}
              </TableWrapper>
            </TableContext.Provider>
          );
        },
        th({ children, ...props }) {
          return (
            <th className="px-4 py-3 font-semibold text-xs tracking-wider text-[var(--text-secondary)] uppercase border-b border-[var(--border-light)]" {...props}>
              {children}
            </th>
          );
        },
        td({ children, ...props }) {
          return (
            <td className="px-4 py-3.5 border-b border-[var(--border-subtle)] text-[var(--text-primary)] align-top" {...props}>
              {children}
            </td>
          );
        },
        a({ children, href, ...props }) {
          return (
            <a 
              href={href} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-[var(--text-primary)] hover:underline hover:text-[var(--text-secondary)] font-medium"
              {...props}
            >
              {children}
            </a>
          );
        },
        blockquote({ children, ...props }) {
          return (
            <blockquote className="border-l-4 border-blue-500 pl-4 py-1 my-4 bg-blue-500/5 text-[var(--text-secondary)] italic rounded-r-md" {...props}>
              {children}
            </blockquote>
          );
        },
        h1({ children, ...props }) {
          return <h1 className="text-2xl font-bold mt-6 mb-4" {...props}>{children}</h1>;
        },
        h2({ children, ...props }) {
          return <h2 className="text-xl font-bold mt-5 mb-3" {...props}>{children}</h2>;
        },
        h3({ children, ...props }) {
          return <h3 className="text-lg font-bold mt-4 mb-2" {...props}>{children}</h3>;
        },
        p({ children, ...props }) {
          return <div className="mb-4 last:mb-0 leading-relaxed" {...props}>{children}</div>;
        },
        ul({ children, ...props }) {
          return <ul className="list-disc pl-5 mb-4 space-y-1" {...props}>{children}</ul>;
        },
        ol({ children, ...props }) {
          return <ol className="list-decimal pl-5 mb-4 space-y-1" {...props}>{children}</ol>;
        }
      }}
    >
      {content}
    </ReactMarkdown>
    </div>
  );
};
