import React, { useEffect, useState } from 'react';
import { createHighlighter } from 'shiki';
import { Check, Copy, Code } from 'lucide-react';
import { cn } from '../../lib/utils';

// Global cache for highlighter to avoid reloading it
let highlighterPromise: Promise<any> | null = null;

const getShiki = () => {
  if (!highlighterPromise) {
    highlighterPromise = createHighlighter({
      themes: ['vitesse-dark'],
      langs: ['javascript', 'typescript', 'python', 'json', 'bash', 'html', 'css', 'markdown', 'go', 'rust', 'c', 'cpp', 'php', 'java', 'yaml', 'sql']
    });
  }
  return highlighterPromise;
};

interface CodeBlockProps {
  language: string;
  value: string;
}

const formatLanguage = (lang: string) => {
  if (!lang) return 'Code';
  const map: Record<string, string> = {
    js: 'JavaScript',
    javascript: 'JavaScript',
    ts: 'TypeScript',
    typescript: 'TypeScript',
    py: 'Python',
    python: 'Python',
    html: 'HTML',
    css: 'CSS',
    bash: 'Bash',
    shell: 'Shell',
    sh: 'Shell',
    json: 'JSON',
    rust: 'Rust',
    cpp: 'C++',
    'c++': 'C++',
    c: 'C',
    sql: 'SQL',
    yaml: 'YAML',
    yml: 'YAML',
  };
  const clean = lang.toLowerCase();
  return map[clean] || lang.charAt(0).toUpperCase() + lang.slice(1);
};

export const CodeBlock: React.FC<CodeBlockProps> = ({ language, value }) => {
  const [html, setHtml] = useState<string>('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const highlight = async () => {
      try {
        const highlighter = await getShiki();
        
        // Check if language is supported/loaded
        const loadedLangs = highlighter.getLoadedLanguages();
        let langToUse = 'text';
        
        if (language) {
          const normalizedLang = language.toLowerCase();
          const aliases: Record<string, string> = {
            'c++': 'cpp',
            'postgresql': 'sql',
            'mongodb': 'json',
            'postgres': 'sql',
          };
          const targetLang = aliases[normalizedLang] || normalizedLang;

          if (loadedLangs.includes(targetLang)) {
            langToUse = targetLang;
          } else {
            // Try to load dynamically if not pre-loaded
            try {
              await highlighter.loadLanguage(targetLang);
              langToUse = targetLang;
            } catch (e) {
              console.warn(`Language ${language} not found in shiki.`);
            }
          }
        }

        const highlighted = highlighter.codeToHtml(value, {
          lang: langToUse,
          theme: 'vitesse-dark'
        });

        if (isMounted) setHtml(highlighted);
      } catch (err) {
        console.error('Shiki highlighting failed', err);
        if (isMounted) setHtml(`<pre><code>${value}</code></pre>`);
      }
    };

    highlight();

    return () => { isMounted = false; };
  }, [language, value]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  return (
    <div className="code-block-wrapper my-4 rounded-2xl overflow-hidden shadow-sm" style={{ background: '#1e1e1e' }}>
      <div className="flex items-center justify-between px-5 py-3 bg-transparent">
        <span className="flex items-center gap-2 text-sm font-semibold text-gray-300">
          <Code className="w-4 h-4 text-gray-400" />
          {formatLanguage(language)}
        </span>
        <button
          onClick={handleCopy}
          className={cn(
            "flex items-center justify-center p-1.5 rounded-lg transition-all border-none bg-transparent cursor-pointer",
            copied ? "text-emerald-400" : "text-gray-400 hover:text-white hover:bg-white/5"
          )}
          aria-label="Copy code"
        >
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
        </button>
      </div>
      <div className="overflow-x-auto px-5 pb-5 pt-1 text-[13.5px] leading-relaxed custom-scrollbar">
        {html ? (
          <div dangerouslySetInnerHTML={{ __html: html }} className="shiki-container [&>pre]:!bg-transparent [&>pre]:!m-0 [&>pre]:!p-0" />
        ) : (
          <pre className="m-0 p-0 bg-transparent"><code className="text-gray-300 font-mono">{value}</code></pre>
        )}
      </div>
    </div>
  );
};
