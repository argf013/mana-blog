/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react';
import { initializeFirebase } from '../config/firebaseConfig';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import useLoader from '../utils/useLoader';
import Card from '../components/Card';
import Dropdown from '../components/Dropdown';
import { FilterIcon } from '@primer/octicons-react';
import { formatDistanceToNow } from 'date-fns';

const Blogs = () => {
    const [allBlogs, setAllBlogs] = useState([]);
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [sortOrder, setSortOrder] = useState('newest');
    const [searchQuery, setSearchQuery] = useState('');
    const [searchTimeout, setSearchTimeout] = useState(null);
    const { showLoader, hideLoader } = useLoader();

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                showLoader();
                const { firestore } = initializeFirebase();
                const blogCollectionRef = collection(firestore, 'blogs');
                const blogSnapshot = await getDocs(blogCollectionRef);
                const blogList = blogSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setAllBlogs(blogList);
                setBlogs(blogList);
            } catch (error) {
                setError('Failed to fetch blogs. Please try again.');
                console.error('Error fetching blogs:', error);
            } finally {
                setLoading(false);
                hideLoader();
            }
        };

        fetchBlogs();
    }, [showLoader, hideLoader]);

    useEffect(() => {
        if (searchTimeout) {
            clearTimeout(searchTimeout);
        }

        const timeout = setTimeout(() => {
            const filteredBlogs = allBlogs.filter(blog =>
                blog.title.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setBlogs(filteredBlogs);
        }, 500);

        setSearchTimeout(timeout);

        return () => clearTimeout(timeout);
    }, [searchQuery, allBlogs]);

    useEffect(() => {
        const sortBlogs = async () => {
            try {
                showLoader();
                const { firestore } = initializeFirebase();
                let blogCollectionRef = collection(firestore, 'blogs');

                // Apply sort order
                switch (sortOrder) {
                    case 'a-z':
                        blogCollectionRef = query(blogCollectionRef, orderBy('title', 'asc'));
                        break;
                    case 'z-a':
                        blogCollectionRef = query(blogCollectionRef, orderBy('title', 'desc'));
                        break;
                    case 'newest':
                        blogCollectionRef = query(blogCollectionRef, orderBy('date', 'desc'));
                        break;
                    case 'oldest':
                        blogCollectionRef = query(blogCollectionRef, orderBy('date', 'asc'));
                        break;
                    default:
                        break;
                }

                const blogSnapshot = await getDocs(blogCollectionRef);
                const blogList = blogSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setAllBlogs(blogList);
            } catch (error) {
                setError('Failed to fetch blogs. Please try again.');
                console.error('Error fetching blogs:', error);
            } finally {
                hideLoader();
            }
        };

        sortBlogs();
    }, [sortOrder, showLoader, hideLoader]);

    const handleSortChange = (sortOption) => {
        setSortOrder(sortOption);
    };

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    if (loading) {
        return (
            <div className="p-6 max-w-4xl mx-auto">
                <h1 className="text-4xl font-bold mb-8 text-center">Blog Articles</h1>
                <div className="flex flex-wrap gap-6 justify-center px-8">
                    {[1, 2, 3, 4].map((_) => (
                        <div
                            key={_}
                            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
                        >
                            <Skeleton height={200} />
                            <h2 className="text-2xl font-semibold mb-2">
                                <Skeleton width={200} />
                            </h2>
                            <Skeleton count={1} />
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (error) {
        return <p className="text-red-500 text-center">{error}</p>;
    }

    const dropdownItems = [
        { label: 'Newest First', value: 'newest' },
        { label: 'Oldest First', value: 'oldest' },
        { label: 'A-Z', value: 'a-z' },
        { label: 'Z-A', value: 'z-a' },
    ];

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold mb-8 text-center">Blog Articles</h1>
            <div className="mb-4 text-center flex justify-center items-center gap-4">
                <Dropdown
                    buttonLabel={<FilterIcon size={16} className="mr-2" />}
                    items={dropdownItems.map(item => ({
                        label: item.label,
                        href: '#',
                        onClick: () => handleSortChange(item.value),
                        key: item.value,
                    }))}
                />
                <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className="p-2 border border-gray-300 rounded-md"
                />
            </div>
            {blogs.length === 0 ? (
                <p className="text-center text-gray-500">No blogs available.</p>
            ) : (
                <div className="flex flex-col md:flex-row gap-6 justify-center px-5">
                    <div className="flex flex-col gap-6 mx-auto md:mx-0">
                        {blogs.filter((_, index) => index % 2 === 0).map(blog => (
                            <div key={blog.id}>
                                <Card
                                    image={true}
                                    imageUrl={blog.thumbnail}
                                    title={true}
                                    titleText={<Link to={`/blogs/${blog.id}`} className="text-gray-800 hover:underline">{blog.title}</Link>}
                                    desc={true}
                                    descText={`${blog.author}, ${formatDistanceToNow(new Date(blog.date.seconds * 1000))} ago`}
                                    footer={false}
                                    rotation="portrait"
                                    link={`/blogs/${blog.id}`}
                                />
                            </div>
                        ))}
                    </div>
                    <div className="flex flex-col gap-6 mx-auto md:mx-0">
                        {blogs.filter((_, index) => index % 2 !== 0).map(blog => (
                            <div key={blog.id}>
                                <Card
                                    image={true}
                                    imageUrl={blog.thumbnail}
                                    title={true}
                                    titleText={<Link to={`/blogs/${blog.id}`} className="text-gray-800 hover:underline">{blog.title}</Link>}
                                    desc={true}
                                    descText={`${blog.author} ${formatDistanceToNow(new Date(blog.date.seconds * 1000))} ago`}
                                    footer={false}
                                    rotation="portrait"
                                    link={`/blogs/${blog.id}`}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Blogs;