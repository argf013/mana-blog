import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { Link, useNavigate } from 'react-router-dom';
import { PencilIcon, PlusIcon, TrashIcon } from '@primer/octicons-react';
import { setupFirebase, fetchBlogs, deleteBlog, bulkDeleteBlogs } from '../services/blog.services';
import TableData from '../components/TableData';
import ConfirmDialog from '../components/Dialog';
import useToast from '../utils/useToast';


const Dashboard = () => {
    const [user, setUser] = useState(null);
    const [firebaseInitialized, setFirebaseInitialized] = useState(false);
    const [author, setAuthor] = useState('');
    const [blogs, setBlogs] = useState([]);
    const [showDialog, setShowDialog] = useState(false);
    const [blogToDelete, setBlogToDelete] = useState(null);
    const [showBulkDeleteDialog, setShowBulkDeleteDialog] = useState(false);
    const [blogsToDelete, setBlogsToDelete] = useState([]);
    const navigate = useNavigate();
    const { addToast } = useToast();

    useEffect(() => {
        const initialize = async () => {
            try {
                const { auth, firestore } = await setupFirebase();
                const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
                    if (currentUser) {
                        setUser(currentUser);

                        const userRef = doc(firestore, 'users', currentUser.uid);
                        const docSnapshot = await getDoc(userRef);
                        if (!docSnapshot.exists()) {
                            await setDoc(userRef, {
                                email: currentUser.email,
                                displayName: currentUser.displayName || '',
                                photoURL: currentUser.photoURL || '',
                            });
                        } else {
                            const userData = docSnapshot.data();
                            setAuthor(userData.displayName || '');
                        }
                    } else {
                        setUser(null);
                    }
                });

                setFirebaseInitialized(true);

                return () => unsubscribe();
            } catch (error) {
                console.error('Error initializing Firebase:', error);
            }
        };

        initialize();
    }, [author]);

    useEffect(() => {
        const loadBlogs = async () => {
            try {
                const blogsList = await fetchBlogs(user?.uid);
                setBlogs(blogsList);
            } catch (error) {
                console.error('Error fetching blogs:', error);
            }
        };

        if (user) {
            loadBlogs();
        }
    }, [user]);

    const handleDeleteBlog = (id) => {
        setBlogToDelete(id);
        setShowDialog(true);
    };

    const confirmDeleteBlog = async () => {
        try {
            await deleteBlog(blogToDelete);
            setBlogs(blogs.filter(blog => blog.id !== blogToDelete));
            setShowDialog(false);
            addToast('Blog deleted successfully!', 'success', 3000);
        } catch (error) {
            addToast('Error deleting blog or thumbnail. Please try again.', 'error', 3000);
            console.error('Error deleting blog or thumbnail:', error);
        }
    };

    const handleBulkDelete = (selectedBlogs) => {
        console.log('Selected blogs for deletion:', selectedBlogs.map(blog => blog.Title));
        setBlogsToDelete(selectedBlogs);
        setShowBulkDeleteDialog(true);
    };

    const confirmBulkDelete = async () => {
        try {
            await bulkDeleteBlogs(blogsToDelete);
            setBlogs(blogs.filter(blog => !blogsToDelete.some(selectedBlog => selectedBlog.id === blog.id)));
            setShowBulkDeleteDialog(false);
            addToast('Selected blogs and thumbnails deleted successfully!', 'success', 3000);
        } catch (error) {
            addToast('Error deleting selected blogs or thumbnails. Please try again.', 'error', 3000);
            console.error('Error deleting selected blogs or thumbnails:', error);
        }
    };

    if (!firebaseInitialized) {
        return <p>Loading Firebase...</p>;
    }

    if (!user) {
        return <p>Please sign in to view the dashboard.</p>;
    }

    const columns = ['Title', 'Author', 'Date'];
    const data = blogs.map(blog => ({
        id: blog.id,
        Title: blog.title,
        Author: blog.author,
        Date: blog.date.toDate().toLocaleString(),
    }));
    const actions = [
        {
            id: 'edit',
            label: 'Edit',
            onClick: (row) => navigate(`/dashboard/edit/blog/${blogs.find(blog => blog.title === row.Title).id}`),
            icon: <PencilIcon size={15} />,
        },
        {
            id: 'delete',
            label: 'Delete',
            onClick: (row) => handleDeleteBlog(blogs.find(blog => blog.title === row.Title).id),
            icon: <TrashIcon size={15} />,
            danger: true,
        }
    ];

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <h2 className="text-2xl font-bold py-2">Hello, {user.displayName}</h2>
            <div className="flex justify-between items-center py-4">
                <h3 className="text-xl font-semibold">Blog Posts</h3>
                <Link to="/dashboard/create/blog" className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700 rounded-full">
                    <PlusIcon className='mr-2' size={15} />Blog
                </Link>
            </div>

            <div className="bg-white rounded-lg">
                {blogs.length === 0 ? (
                    <p>No blogs found.</p>
                ) : (
                    <TableData columns={columns} data={data} actions={actions} badgeColumn="Author" onBulkDelete={handleBulkDelete} />
                )}
            </div>

            {showDialog && (
                <ConfirmDialog
                    message="Are you sure you want to delete this blog?"
                    details={[{ id: blogToDelete, content: blogs.find(blog => blog.id === blogToDelete)?.title }]}
                    onCancel={() => setShowDialog(false)}
                    onDelete={confirmDeleteBlog}
                />
            )}

            {showBulkDeleteDialog && (
                <ConfirmDialog
                    message="Are you sure you want to delete the selected blogs?"
                    details={blogsToDelete.map(blog => ({ id: blog.id, content: blog.Title }))}
                    onCancel={() => setShowBulkDeleteDialog(false)}
                    onDelete={confirmBulkDelete}
                />
            )}
        </div>
    );
};

export default Dashboard;