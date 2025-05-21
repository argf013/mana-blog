import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom'; // Import useNavigate
import { initializeFirebase } from '../config/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth'; // Import Firebase auth
import Breadcrumbs from '../components/BreadCrumbs';
import { AlertFillIcon, ShareAndroidIcon } from '@primer/octicons-react';
import useLoader from '../utils/useLoader';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import MarkdownRenderer from '../components/MarkdownRenderer';
import CommentSection from '../components/CommentSection';

const BlogDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate(); // Initialize useNavigate
    const { app } = initializeFirebase(); // Initialize Firebase
    const auth = getAuth(app); // Initialize Firebase auth
    const currentUser = auth.currentUser; // Get the current user
    const [blog, setBlog] = useState(null);
    const [author, setAuthor] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { showLoader, hideLoader } = useLoader();

    useEffect(() => {
        const fetchBlog = async () => {
            try {
                showLoader();
                const { firestore } = initializeFirebase();
                const blogRef = doc(firestore, 'blogs', id);
                const blogDoc = await getDoc(blogRef);
                if (blogDoc.exists()) {
                    const blogData = blogDoc.data();
                    setBlog(blogData);

                    // Fetch author data
                    const userRef = doc(firestore, 'users', blogData.userId);
                    const userDoc = await getDoc(userRef);
                    if (userDoc.exists()) {
                        setAuthor(userDoc.data());
                    } else {
                        setError('Author not found.');
                    }
                } else {
                    setError('Blog not found.');
                }
            } catch (error) {
                setError('Failed to fetch blog. Please try again.');
                console.error('Error fetching blog:', error);
            } finally {
                hideLoader();
                setLoading(false);
            }
        };

        fetchBlog();
    }, [id, showLoader, hideLoader]);

    if (loading) {
        return (
            <div className="p-10 max-w-6xl mx-auto">
                <Skeleton className='max-w-full' height={25} width="80%" />
                <Skeleton className='max-w-full mt-10' height={50} width="90%" />
                <Skeleton className='max-w-full' height={50} width="70%" />
                <div className="flex items-center mt-10">
                    <Skeleton className='max-w-full' circle width={48} height={48} />
                    <div className="ml-4">
                        <Skeleton className='max-w-full' height={20} width="40%" />
                        <Skeleton className='max-w-full' height={20} width="30%" />
                    </div>
                </div>
                <Skeleton className='max-w-full my-5' height={600} />
            </div>
        );
    }

    if (error) {
        return <div className="text-center flex flex-col items-center justify-center h-screen">
            <h1 className="text-4xl font-bold text-red-500 mb-2">
                <AlertFillIcon verticalAlign='middle' size={64} className="text-red-500 mr-2" /> Blog Not Found
            </h1>
            <p className="text-lg text-gray-700 mb-6">
                The blog you are looking for does not exist. Please try again later.
            </p>
            <Link to="/blogs" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300">
                Go to Blogs
            </Link>
        </div>;
    }

    const breadcrumbItems = [
        { label: 'Home', route: '/' },
        { label: 'Blogs', route: '/blogs' },
        { label: blog?.title || 'Blog Detail', route: `/blogs/${id}` }
    ];

    return (
        <div className="p-10 max-w-6xl mt-15 mx-auto">
            <Breadcrumbs items={breadcrumbItems} />
            {blog ? (
                <div className="bg-white py-10">
                    <h1 className="text-4xl md:text-4xl lg:text-6xl font-normal mb-4 md:mb-6 lg:mb-10">{blog.title}</h1>
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
                                    {new Date(blog.date.seconds * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center">
                            <button
                                className="text-dark px-4 py-2 rounded hover:text-blue-600"
                                onClick={() => {
                                    const shareData = {
                                        title: blog.title,
                                        text: blog.content,
                                        url: window.location.href
                                    };
                                    navigator.share(shareData).catch(console.error);
                                }}
                            >
                                <ShareAndroidIcon className='mr-3' size={18} />Share
                            </button>
                            {currentUser?.uid === blog.userId && (
                                <button
                                    className="ml-4 bg-gray-700 text-white px-4 py-2 rounded-full hover:bg-gray-800 transition duration-300"
                                    onClick={() => navigate(`/dashboard/edit/blog/${id}`)} // Use navigate instead of history.push
                                >
                                    Edit Post
                                </button>
                            )}
                        </div>
                    </div>
                    {blog.thumbnail && (
                        <img
                            src={blog.thumbnail}
                            alt="Blog Thumbnail"
                            className="w-auto mx-auto h-auto rounded-lg mb-6"
                        />
                    )}
                    <MarkdownRenderer content={blog.content} />
                    <CommentSection blogId={id} />
                </div>
            ) : (
                <div>
                    <h1>
                        Blog not found. Please try again later.
                    </h1>
                </div>
            )}
        </div>
    );
};

export default BlogDetail;