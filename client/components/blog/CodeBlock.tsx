'use client';
import React, { useState } from 'react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

const CodeBlock = ({ code }: { code: string }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(code);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        } catch (err) {
            setCopied(false);
        }
    };

    return (
        <div className="relative group">
            <button
                onClick={handleCopy}
                className="absolute top-2 right-10 bg-neutral-800 text-[#ffffff] px-2 py-1 rounded text-xs opacity-80 hover:opacity-100 z-10"
                type="button"
            >
                {copied ? 'Copied!' : 'Copy'}
            </button>
            <div className="overflow-auto max-h-[600px] max-w-full rounded-lg">
                <SyntaxHighlighter
                    language="javascript"
                    style={vscDarkPlus}
                    customStyle={{ borderRadius: 8, fontSize: 16, margin: 0 }}
                >
                    {code}
                </SyntaxHighlighter>
            </div>
        </div>
    );
};
export default CodeBlock;