import { initializeFirebase } from '../config/firebaseConfig';
import { doc, getDoc, collection, query, where, getDocs, deleteDoc, addDoc, updateDoc, Timestamp } from 'firebase/firestore';
import { getStorage, ref, deleteObject, getMetadata, uploadBytes, getDownloadURL } from 'firebase/storage';

const setupFirebase = async () => {
    const { auth, firestore } = initializeFirebase();
    return { auth, firestore };
};

const fetchBlogs = async (userId) => {
    const { firestore } = await setupFirebase();
    const blogRef = collection(firestore, 'blogs');
    const q = query(blogRef, where("userId", "==", userId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

const fetchBlogById = async (blogId) => {
    const { firestore } = await setupFirebase();
    const blogRef = doc(firestore, 'blogs', blogId);
    const docSnapshot = await getDoc(blogRef);
    return docSnapshot.exists() ? docSnapshot.data() : null;
};

const fetchUserById = async (userId) => {
    const { firestore } = await setupFirebase();
    const userRef = doc(firestore, 'users', userId);
    const userDoc = await getDoc(userRef);
    return userDoc.exists() ? userDoc.data() : null;
};

const saveBlog = async (isEditMode, blogId, title, content, thumbnailUrl, uploadedFile) => {
    const { auth, firestore } = await setupFirebase();
    const user = auth.currentUser;

    if (!user) {
        throw new Error('You must be logged in to save a blog.');
    }

    const userRef = doc(firestore, 'users', user.uid);
    const userDoc = await getDoc(userRef);
    const userData = userDoc.data();
    const blogAuthor = userData?.displayName || 'Anonymous';

    const storage = getStorage();
    let uploadedThumbnailUrl = thumbnailUrl;

    if (isEditMode) {
        const blogRef = doc(firestore, 'blogs', blogId);

        if (uploadedFile) {
            const storageRef = ref(storage, `thumbnails/${blogId}`);
            await uploadBytes(storageRef, uploadedFile);
            uploadedThumbnailUrl = await getDownloadURL(storageRef);
        }

        await updateDoc(blogRef, { title, content, thumbnail: uploadedThumbnailUrl });
    } else {
        const blogRef = collection(firestore, 'blogs');
        const newBlogRef = await addDoc(blogRef, {
            author: blogAuthor,
            date: Timestamp.now(),
            title,
            content,
            userId: user.uid,
        });

        const newBlogId = newBlogRef.id;

        if (uploadedFile) {
            const storageRef = ref(storage, `thumbnails/${newBlogId}`);
            await uploadBytes(storageRef, uploadedFile);
            uploadedThumbnailUrl = await getDownloadURL(storageRef);
            await updateDoc(newBlogRef, { thumbnail: uploadedThumbnailUrl });
        }
    }
};

const deleteBlog = async (blogId) => {
    const { firestore } = await setupFirebase();
    const storage = getStorage();
    const blogRef = doc(firestore, 'blogs', blogId);

    const blogDoc = await getDoc(blogRef);

    if (blogDoc.exists() && blogDoc.data().thumbnail) {
        const thumbnailRef = ref(storage, `thumbnails/${blogId}`);
        try {
            await getMetadata(thumbnailRef);
            await deleteObject(thumbnailRef);
        } catch (error) {
            if (error.code !== 'storage/object-not-found') {
                throw error;
            }
        }
    }

    await deleteDoc(blogRef);
};

const bulkDeleteBlogs = async (blogsToDelete) => {
    const { firestore } = await setupFirebase();
    const storage = getStorage();
    const deletePromises = blogsToDelete.map(blog => {
        const blogRef = doc(firestore, 'blogs', blog.id);
        const thumbnailRef = ref(storage, `thumbnails/${blog.id}`);
        return Promise.all([deleteDoc(blogRef), deleteObject(thumbnailRef)]);
    });
    await Promise.all(deletePromises);
};

export { setupFirebase, fetchBlogs, deleteBlog, bulkDeleteBlogs, fetchBlogById, fetchUserById, saveBlog };