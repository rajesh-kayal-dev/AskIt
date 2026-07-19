import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { CopyButton } from './CopyButton';

interface CodeBlockProps {
  language: string;
  value: string;
}

export const CodeBlock = ({ language, value }: CodeBlockProps) => {
  return (
    <div className="my-4 overflow-hidden rounded-xl bg-[#1e1e1e] font-sans shadow-lg ring-1 ring-white/10 border border-gray-800/50">
      <div className="flex items-center justify-between bg-[#2d2d2d] px-4 py-2 border-b border-white/5">
        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{language || 'text'}</span>
        <CopyButton text={value} />
      </div>
      <div className="overflow-x-auto text-sm leading-relaxed p-4">
        <SyntaxHighlighter
          language={language || 'text'}
          style={vscDarkPlus}
          customStyle={{
            margin: 0,
            padding: 0,
            background: 'transparent',
            fontSize: '14px',
            lineHeight: '1.6',
          }}
          wrapLines={true}
          wrapLongLines={false}
        >
          {value}
        </SyntaxHighlighter>
      </div>
    </div>
  );
};
