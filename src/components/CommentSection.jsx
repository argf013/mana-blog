import { useState, useEffect } from 'react';
import { initializeFirebase } from '../config/firebaseConfig';
import { collection, addDoc, getDocs, query, where, Timestamp, deleteDoc, doc } from 'firebase/firestore';
import PropTypes from 'prop-types';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import useToast from '../utils/useToast';

const CommentSection = ({ blogId }) => {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [user, setUser] = useState(null);
    const { firestore } = initializeFirebase();
    const auth = getAuth();
    const { addToast } = useToast();

    useEffect(() => {
        const fetchComments = async () => {
            const q = query(collection(firestore, 'comments'), where('blogId', '==', blogId));
            const querySnapshot = await getDocs(q);
            const commentsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setComments(commentsData);
        };

        fetchComments();
    }, [blogId, firestore]);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser(user);
            } else {
                setUser(null);
            }
        });

        return () => unsubscribe();
    }, [auth]);

    const handleAddComment = async () => {
        if (newComment.trim() === '') {
            addToast('Please enter a comment', 'error');
            return;
        }

        if (!user) {
            addToast('Please log in to add a comment', 'error');
            return;
        }

        try {
            const commentData = {
                blogId,
                content: newComment,
                date: Timestamp.now(),
                userId: user.uid,
                userName: user.displayName || 'Anonymous'
            };

            await addDoc(collection(firestore, 'comments'), commentData);
            setComments([...comments, commentData]);
            setNewComment('');
            addToast('Comment added successfully', 'success');
        } catch (error) {
            console.error('Error adding comment:', error);
            addToast('Failed to add comment', 'error');
        }
    };

    const handleDeleteComment = async (commentId) => {
        try {
            await deleteDoc(doc(firestore, 'comments', commentId));
            setComments(comments.filter(comment => comment.id !== commentId));
            addToast('Comment deleted successfully', 'success');
        } catch (error) {
            console.error('Error deleting comment:', error);
            addToast('Failed to delete comment', 'error');
        }
    };

    return (
        <div className="mt-6">
            <h3 className="text-xl font-bold mb-4">Comments</h3>
            <div className="mb-4">
                <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add a comment..."
                    className="w-full p-2 border border-gray-300 rounded-md"
                ></textarea>
                <button
                    onClick={handleAddComment}
                    className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-md"
                >
                    Add Comment
                </button>
            </div>
            <div>
                {comments.map((comment) => (
                    <div key={comment.id} className="mb-4 p-4 border border-gray-300 rounded-md">
                        <p>{comment.content}</p>
                        <p className="text-sm text-gray-500">{new Date(comment.date.seconds * 1000).toLocaleDateString()}</p>
                        {user && comment.userId === user.uid && (
                            <button
                                onClick={() => handleDeleteComment(comment.id)}
                                className="mt-2 px-4 py-2 bg-red-600 text-white rounded-md"
                            >
                                Delete
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

CommentSection.propTypes = {
    blogId: PropTypes.string.isRequired,
};

export default CommentSection;