import { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Copy, CheckCircle } from 'lucide-react';
import { Theme } from '../types';

interface CodeBlockProps {
  code: string;
  language?: string;
  theme: Theme;
  showLineNumbers?: boolean;
  fileName?: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({
  code,
  language = 'javascript',
  theme,
  showLineNumbers = false,
  fileName
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getLanguageLabel = (lang: string): string => {
    switch (lang) {
      case 'js':
      case 'javascript':
        return 'JavaScript';
      case 'ts':
      case 'typescript':
        return 'TypeScript';
      case 'py':
      case 'python':
        return 'Python';
      case 'rb':
      case 'ruby':
        return 'Ruby';
      case 'go':
        return 'Go';
      case 'java':
        return 'Java';
      case 'csharp':
      case 'cs':
        return 'C#';
      case 'php':
        return 'PHP';
      case 'bash':
      case 'sh':
        return 'Shell';
      case 'json':
        return 'JSON';
      case 'xml':
        return 'XML';
      case 'yaml':
      case 'yml':
        return 'YAML';
      default:
        return language.charAt(0).toUpperCase() + language.slice(1);
    }
  };

  return (
    <div className="relative rounded-lg overflow-hidden">
      {fileName && (
        <div className="flex items-center justify-between px-4 py-2 bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{fileName}</span>
          <span className="text-xs px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded text-gray-700 dark:text-gray-300">
            {getLanguageLabel(language)}
          </span>
        </div>
      )}
      
      <div className="relative">
        <SyntaxHighlighter
          language={language}
          style={theme.mode === 'dark' ? vscDarkPlus : oneLight}
          showLineNumbers={showLineNumbers}
          wrapLongLines={true}
          customStyle={{ margin: 0 }}
        >
          {code}
        </SyntaxHighlighter>

        <button
          onClick={handleCopy}
          className="absolute top-3 right-3 p-2 rounded-md bg-white/90 dark:bg-gray-800/90 hover:bg-white dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 shadow-sm transition-colors"
          title="Copy code"
        >
          {copied ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
        </button>
      </div>
    </div>
  );
};

export default CodeBlock; 