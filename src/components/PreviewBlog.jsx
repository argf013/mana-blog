import PropTypes from 'prop-types';
import MarkdownRenderer from './MarkdownRenderer';

const PreviewBlog = ({ title, author, thumbnailUrl, content }) => {
    return (
        <div className="mt-6 p-10 max-w-6xl mx-auto">
            <h3 className="text-xl font-bold mb-2">Preview</h3>
            <div className="bg-white py-10">
                <h1 className="text-6xl font-normal mb-10">{title}</h1>
                <div className="flex justify-between items-center mt-15 mb-4">
                    <div className="flex items-center">
                        {author?.photoURL ? (
                            <img
                                src={author.photoURL}
                                alt="Author's Profile"
                                className="w-12 h-12 rounded-full mr-4"
                            />
                        ) : (
                            <div className="w-12 h-12 rounded-full bg-gray-300 mr-4"></div>
                        )}
                        <div>
                            <p className="text-gray-500 text-sm font-semibold">{author?.displayName || 'Unknown'}</p>
                            <p className='text-gray-500'>
                                {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </p>
                        </div>
                    </div>
                </div>
                {thumbnailUrl && (
                    <img
                        src={thumbnailUrl}
                        alt="Blog Thumbnail"
                        className="w-full h-auto rounded-lg mb-6"
                    />
                )}
                <MarkdownRenderer content={content} />
            </div>
        </div>
    );
};

PreviewBlog.propTypes = {
    title: PropTypes.string.isRequired,
    author: PropTypes.object,
    thumbnailUrl: PropTypes.string,
    content: PropTypes.string.isRequired,
};

export default PreviewBlog;