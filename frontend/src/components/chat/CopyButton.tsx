import { useState } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Check, Copy } from 'lucide-react';

interface CopyButtonProps {
  text: string;
}

export const CopyButton = ({ text }: CopyButtonProps) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };

  return (
    <CopyToClipboard text={text} onCopy={handleCopy}>
      <button
        className="flex items-center gap-1.5 rounded bg-white/10 px-2 py-1 text-xs font-medium text-gray-300 hover:bg-white/20 transition-colors focus:outline-none focus:ring-2 focus:ring-white/30"
        aria-label="Copy to clipboard"
      >
        {isCopied ? (
          <>
            <Check className="h-3.5 w-3.5 text-green-400" />
            <span className="text-green-400">Copied!</span>
          </>
        ) : (
          <>
            <Copy className="h-3.5 w-3.5" />
            <span>Copy code</span>
          </>
        )}
      </button>
    </CopyToClipboard>
  );
};
