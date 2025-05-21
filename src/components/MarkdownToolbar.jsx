import { BoldIcon, HeadingIcon, ItalicIcon, ListOrderedIcon, ListUnorderedIcon, ImageIcon, LinkIcon } from '@primer/octicons-react';
import PropTypes from 'prop-types';

const MarkdownToolbar = ({ insertMarkdown, toggleFullscreen }) => {
    return (
        <div className="w-full mb-4 border border-gray-200 rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600">
            <div className="flex items-center justify-between px-3 py-2 border-b dark:border-gray-600">
                <div className="flex flex-wrap items-center divide-gray-200 sm:divide-x sm:rtl:divide-x-reverse dark:divide-gray-600">
                    <div className="flex items-center space-x-1 rtl:space-x-reverse sm:pe-4">
                        <button onClick={(event) => { event.preventDefault(); insertMarkdown('# '); }} className="p-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600">
                            <HeadingIcon size={15} />
                        </button>
                        <button onClick={(event) => { event.preventDefault(); insertMarkdown('**bold**'); }} className="p-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600">
                            <BoldIcon size={15} />
                        </button>
                        <button onClick={(event) => { event.preventDefault(); insertMarkdown('*italic*'); }} className="p-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600">
                            <ItalicIcon size={15} />
                        </button>
                        <button onClick={(event) => { event.preventDefault(); insertMarkdown('- '); }} className="p-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600">
                            <ListOrderedIcon size={15} />
                        </button>
                        <button onClick={(event) => { event.preventDefault(); insertMarkdown('1. '); }} className="p-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600">
                            <ListUnorderedIcon size={15} />
                        </button>
                        <button onClick={(event) => { event.preventDefault(); insertMarkdown('![alt text](https://InsertImageLinkHere)'); }} className="p-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600">
                            <ImageIcon size={15} />
                        </button>
                        <button onClick={(event) => { event.preventDefault(); insertMarkdown('[link text](https://www.example.com)'); }} className="p-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600">
                            <LinkIcon size={15} />
                        </button>
                    </div>
                </div>
                <button type="button" onClick={toggleFullscreen} className="p-2 text-gray-500 rounded cursor-pointer sm:ms-auto hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600">
                    <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 19 19">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 1h5m0 0v5m0-5-5 5M1.979 6V1H7m0 16.042H1.979V12M18 12v5.042h-5M13 12l5 5M2 1l5 5m0 6-5 5" />
                    </svg>
                    <span className="sr-only">Full screen</span>
                </button>
            </div>
        </div>
    );
};

MarkdownToolbar.propTypes = {
    insertMarkdown: PropTypes.func.isRequired,
    toggleFullscreen: PropTypes.func.isRequired,
};

export default MarkdownToolbar;