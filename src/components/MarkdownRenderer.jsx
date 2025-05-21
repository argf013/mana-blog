/* eslint-disable react/prop-types */
import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import PropTypes from 'prop-types';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { gruvboxLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import ImageWithLoader from './ImageWithLoader'; // Import ImageWithLoader

const CopyButton = ({ code }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(code).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    return (
        <button
            onClick={handleCopy}
            className="absolute top-2 right-2 text-sm text-gray-500 hover:text-gray-700 bg-white bg-opacity-75 p-1 rounded"
        >
            {copied ? 'Copied!' : 'Copy'}
        </button>
    );
};

const MarkdownRenderer = ({ content }) => {
    return (
        <ReactMarkdown
            rehypePlugins={[rehypeRaw]}
            remarkPlugins={[remarkGfm]}
            components={{
                img: ({ src, alt, ...props }) => (
                    <ImageWithLoader src={src} alt={alt} className="max-w-full mx-auto h-auto rounded-lg" {...props} />
                ),
                p: ({ node, ...props }) => {
                    // Check if the paragraph contains an image
                    const hasImage = node.children.some(child => child.tagName === 'img');
                    if (hasImage) {
                        return <div {...props} className="text-base py-5 text-gray-700 dark:text-gray-300" />;
                    }
                    return <p {...props} className="text-base py-5 text-gray-700 dark:text-gray-300" />;
                },
                h1: ({ ...props }) => (
                    <h1 {...props} className="text-2xl md:text-4xl lg:text-4xl font-normal py-5 text-gray-900 dark:text-gray-300" />
                ),
                h2: ({ ...props }) => (
                    <h2 {...props} className="text-xl md:text-3xl lg:text-3xl font-normal py-4 text-gray-900 dark:text-gray-300" />
                ),
                h3: ({ ...props }) => (
                    <h3 {...props} className="text-lg md:text-2xl lg:text-2xl font-normal py-3 text-gray-900 dark:text-gray-300" />
                ),
                h4: ({ ...props }) => (
                    <h4 {...props} className="text-lg md:text-xl lg:text-xl font-normal py-2 text-gray-900 dark:text-gray-300" />
                ),
                h5: ({ ...props }) => (
                    <h5 {...props} className="text-base md:text-lg lg:text-lg font-normal py-2 text-gray-900 dark:text-gray-300" />
                ),
                h6: ({ ...props }) => (
                    <h6 {...props} className="text-base md:text-base lg:text-base font-normal py-1 text-gray-900 dark:text-gray-300" />
                ),
                ul: ({ ...props }) => (
                    <ul {...props} className="list-disc list-inside py-2 text-gray-700 dark:text-gray-300" />
                ),
                ol: ({ ...props }) => (
                    <ol {...props} className="list-decimal list-inside py-2 text-gray-700 dark:text-gray-300" />
                ),
                li: ({ ...props }) => (
                    <li {...props} className="text-base py-1 text-gray-700 dark:text-gray-300" />
                ),
                blockquote: ({ ...props }) => (
                    <blockquote {...props} className="border-l-4 border-gray-300 dark:border-gray-600 pl-4 italic text-gray-600 dark:text-gray-400" />
                ),
                code: ({ inline, className, children, ...props }) => {
                    const match = /language-(\w+)/.exec(className || '');
                    return !inline && match ? (
                        <div className="relative">
                            <SyntaxHighlighter
                                style={gruvboxLight}
                                language={match[1]}
                                PreTag="div"
                                {...props}
                            >
                                {String(children).replace(/\n$/, '')}
                            </SyntaxHighlighter>
                            <CopyButton code={String(children).replace(/\n$/, '')} />
                        </div>
                    ) : (
                        <code className={className} {...props}>
                            {children}
                        </code>
                    );
                },
                a: ({ ...props }) => (
                    <a {...props} className="text-blue-500 hover:underline" target='_blank' />
                ),
            }}
            className="prose max-w-4xl mx-auto py-5"
        >
            {content}
        </ReactMarkdown>
    );
};

MarkdownRenderer.propTypes = {
    content: PropTypes.string,
};

export default MarkdownRenderer;