import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import useToast from '../utils/useToast';
import MarkdownToolbar from './MarkdownToolbar';
import PreviewBlog from './PreviewBlog';
import useLoader from '../utils/useLoader';
import imageCompression from 'browser-image-compression';
import { fetchBlogById, fetchUserById, saveBlog } from '../services/blog.services';
import { ChevronLeftIcon, FileIcon, PencilIcon } from '@primer/octicons-react';

const BlogForm = ({ isEditMode, blogId }) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [thumbnailUrl, setThumbnailUrl] = useState('');
    const [author, setAuthor] = useState(null);
    const [showPreview, setShowPreview] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [uploadedFile, setUploadedFile] = useState(null);
    const navigate = useNavigate();
    const { addToast } = useToast();
    const contentRef = useRef(null);
    const fileInputRef = useRef(null);
    const { showLoader, hideLoader } = useLoader();

    useEffect(() => {
        if (isEditMode && blogId) {
            const fetchBlog = async () => {
                try {
                    showLoader();
                    const blogData = await fetchBlogById(blogId);
                    if (blogData) {
                        setTitle(blogData.title);
                        setContent(blogData.content);
                        setThumbnailUrl(blogData.thumbnail || '');

                        const userData = await fetchUserById(blogData.userId);
                        setAuthor(userData || { displayName: 'Unknown', photoURL: null });
                    } else {
                        navigate('/dashboard');
                    }
                } catch (error) {
                    console.error('Error fetching blog:', error);
                } finally {
                    hideLoader();
                }
            };

            fetchBlog();
        }
    }, [isEditMode, blogId, navigate, showLoader, hideLoader]);

    const handleThumbnailChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                addToast('File size should not exceed 5MB.', 'error', 3000);
                return;
            }
            try {
                const options = {
                    maxSizeMB: 5,
                    maxWidthOrHeight: 1080,
                    useWebWorker: true
                };
                const compressedFile = await imageCompression(file, options);
                setUploadedFile(compressedFile);
            } catch (error) {
                addToast('Error compressing image: ' + error.message, 'error', 3000);
            }
        }
    };

    const handleSaveBlog = async () => {
        if (!title || !content) {
            addToast('All fields are required.', 'error', 3000);
            return;
        }

        try {
            showLoader();
            await saveBlog(isEditMode, blogId, title, content, thumbnailUrl, uploadedFile);
            addToast(isEditMode ? 'Blog updated successfully!' : 'Blog created successfully!', 'success', 3000);
            navigate('/dashboard');
        } catch (error) {
            console.error('Error saving blog:', error);
            addToast('Error saving blog. Please try again.', 'error', 3000);
        } finally {
            hideLoader();
        }
    };

    const insertMarkdown = (syntax) => {
        const textarea = document.getElementById('content');
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const text = textarea.value;
        const before = text.substring(0, start);
        const after = text.substring(end, text.length);
        textarea.focus();
        setContent(before + syntax + after);
        textarea.setSelectionRange(start + syntax.length, start + syntax.length);
    };

    const toggleFullscreen = () => {
        setIsFullscreen(!isFullscreen);
    };

    const handleBackClick = () => {
        if (isEditMode && blogId) {
            navigate(`/blogs/${blogId}`);
        } else {
            navigate('/dashboard');
        }
    };

    return (
        <div className='max-w-5xl mx-auto'>
            <div className='px-6 mt-4'>
                {!showPreview && (
                    <button
                        className="my-4 px-4 pl-0 pr-2 bg-transparent text-black rounded flex items-center"
                        onClick={handleBackClick}
                    >
                        <ChevronLeftIcon size={16} className="mr-1" />
                        Back
                    </button>
                )}
                <button
                    className="mb-4 py-2 bg-gray-900 text-white px-4 rounded-full"
                    onClick={() => setShowPreview(!showPreview)}
                >
                    {showPreview ? (
                        <span>
                            <PencilIcon size={16} className="mr-1" />
                            Edit Blog
                        </span>
                    ) : (
                        <span>
                            <FileIcon size={16} className="mr-1" />
                            Preview Blog
                        </span>
                    )}
                </button>
            </div>
            {!showPreview ? (
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="mb-4">
                        <label htmlFor="title" className="block text-gray-700">Title</label>
                        <input
                            id="title"
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Enter blog title"
                            className="w-full p-2 border border-gray-300 rounded-md"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="thumbnail" className="block text-gray-700">Thumbnail</label>
                        <input
                            id="thumbnail"
                            type="file"
                            ref={fileInputRef}
                            onChange={handleThumbnailChange}
                            className="w-full p-2 border border-gray-300 rounded-md"
                        />
                        {uploadedFile && <p>{uploadedFile.name}</p>} {/* Display the uploaded file name */}
                    </div>
                    <form>
                        <MarkdownToolbar insertMarkdown={insertMarkdown} toggleFullscreen={toggleFullscreen} isFullscreen={isFullscreen} />
                        <div ref={contentRef} className={`p-0 bg-white rounded-b-lg dark:bg-gray-800 ${isFullscreen ? 'fullscreen' : ''}`}>
                            {isFullscreen && (
                                <button
                                    className="absolute bottom-4 right-4 px-4 py-2 bg-gray-900 text-white rounded"
                                    onClick={toggleFullscreen}
                                >
                                    Back
                                </button>
                            )}
                            <label htmlFor="content" className="sr-only">Publish post</label>
                            <textarea
                                id="content"
                                rows="8"
                                className="block p-2 w-full p-0 text-sm text-gray-800 bg-white border-0 dark:bg-gray-800 focus:ring-0 dark:text-white dark:placeholder-gray-400"
                                placeholder="Write an article..."
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                required
                            ></textarea>
                        </div>
                        <button
                            type="button"
                            onClick={handleSaveBlog}
                            className="inline-flex items-center my-3 rounded-full px-5 py-2.5 text-sm font-medium text-center text-white bg-blue-700 focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-900 hover:bg-blue-800"
                        >
                            {isEditMode ? 'Update Blog' : 'Create Blog'}
                        </button>
                    </form>
                </div>
            ) : (
                <PreviewBlog
                    title={title}
                    author={author}
                    thumbnailUrl={thumbnailUrl}
                    content={content}
                />
            )}
        </div>
    );
};

BlogForm.propTypes = {
    isEditMode: PropTypes.bool,
    blogId: PropTypes.string,
};

export default BlogForm;