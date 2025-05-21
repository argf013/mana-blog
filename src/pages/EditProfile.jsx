import { useState, useEffect } from 'react';
import { getAuth, updatePassword, updateProfile, reauthenticateWithCredential, EmailAuthProvider, onAuthStateChanged } from 'firebase/auth';
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { doc, updateDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { ChevronLeftIcon, UploadIcon, TrashIcon, PencilIcon, EyeClosedIcon, EyeIcon } from '@primer/octicons-react';
import { useNavigate } from 'react-router-dom';
import { initializeFirebase } from '../config/firebaseConfig';
import useToast from '../utils/useToast';
import useLoader from '../utils/useLoader';
import imageCompression from 'browser-image-compression'; // Import imageCompression

const EditProfile = () => {
    const { firestore } = initializeFirebase();

    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [retypePassword, setRetypePassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [newUsername, setNewUsername] = useState('');
    const [usernameError, setUsernameError] = useState('');
    const [profilePhotoURL, setProfilePhotoURL] = useState('');
    const [newProfilePhoto, setNewProfilePhoto] = useState(null);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showRetypePassword, setShowRetypePassword] = useState(false);
    const navigate = useNavigate();
    const auth = getAuth();
    const { addToast } = useToast();
    const { showLoader, hideLoader } = useLoader();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
            setLoading(false);
            if (user) {
                if (user.photoURL) {
                    setProfilePhotoURL(user.photoURL);
                }
                if (user.displayName) {
                    setNewUsername(user.displayName);
                }
            }
        });

        return () => unsubscribe();
    }, [auth]);

    const reauthenticate = async (currentPassword) => {
        const credential = EmailAuthProvider.credential(user.email, currentPassword);
        try {
            await reauthenticateWithCredential(user, credential);
        } catch (error) {
            throw new Error('Reauthentication failed: ' + error.message);
        }
    };

    const handlePasswordChange = async () => {
        if (newPassword !== retypePassword) {
            setPasswordError('Passwords do not match.');
            addToast('Passwords do not match.', 'error');
            return;
        }

        showLoader();
        try {
            await reauthenticate(currentPassword);
            await updatePassword(user, newPassword);
            setPasswordError('');
            addToast('Password updated successfully!', 'success');
        } catch (error) {
            setPasswordError('Error updating password: ' + error.message);
            addToast('Error updating password: ' + error.message, 'error');
        } finally {
            hideLoader();
        }
    };

    const handleUsernameChange = async () => {
        if (!newUsername) {
            setUsernameError('Username cannot be empty.');
            addToast('Username cannot be empty.', 'error');
            return;
        }

        showLoader();
        try {
            await updateProfile(user, { displayName: newUsername });

            const userRef = doc(firestore, 'users', user.uid);
            await updateDoc(userRef, { displayName: newUsername });

            const blogsRef = collection(firestore, 'blogs');
            const q = query(blogsRef, where('userId', '==', user.uid));
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach(async (doc) => {
                await updateDoc(doc.ref, { author: newUsername });
            });

            setUsernameError('');
            addToast('Username updated successfully!', 'success');
        } catch (error) {
            setUsernameError('Error updating username: ' + error.message);
            addToast('Error updating username: ' + error.message, 'error');
        } finally {
            hideLoader();
        }
    };

    const handleProfilePhotoChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            try {
                const options = {
                    maxSizeMB: 0.3,
                    maxWidthOrHeight: 128,
                    useWebWorker: true
                };
                const compressedFile = await imageCompression(file, options);
                setNewProfilePhoto(compressedFile);
            } catch (error) {
                addToast('Error compressing image: ' + error.message, 'error');
            }
        }
    };

    const handleProfilePhotoUpdate = async () => {
        if (newProfilePhoto) {
            showLoader();
            try {
                const storage = getStorage();
                const storageRef = ref(storage, `profile_photos/${user.uid}`);
                await uploadBytes(storageRef, newProfilePhoto);
                const url = await getDownloadURL(storageRef);
                await updateProfile(user, { photoURL: url });
                setProfilePhotoURL(url);
                setNewProfilePhoto(null);
                addToast('Profile photo updated successfully!', 'success');
            } catch (error) {
                addToast('Error updating profile photo: ' + error.message, 'error');
            } finally {
                hideLoader();
            }
        }
    };

    const handleProfilePhotoRemove = async () => {
        showLoader();
        try {
            const storage = getStorage();
            const storageRef = ref(storage, `profile_photos/${user.uid}`);
            await deleteObject(storageRef);
            await updateProfile(user, { photoURL: null });
            setProfilePhotoURL('');
            addToast('Profile photo removed successfully!', 'success');
        } catch (error) {
            addToast('Error removing profile photo: ' + error.message, 'error');
        } finally {
            hideLoader();
        }
    };

    const handleTogglePasswordVisibility = (setter) => {
        setter(prevState => !prevState);
    };

    const handleKeyDown = (event, setter) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            handleTogglePasswordVisibility(setter);
        }
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    if (!user) {
        return <p>Please sign in to view the dashboard.</p>;
    }

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <button
                className="mb-4 px-4 py-2 bg-transparent text-black rounded flex items-center"
                onClick={() => navigate('/dashboard')}
            >
                <ChevronLeftIcon size={16} className="mr-1" />
                Back
            </button>
            <div className="mb-6">
                <div className="mb-4">
                    <label htmlFor="profilePhoto" className="block mb-1">Profile Photo:</label>
                    <div className="flex items-center">
                        {profilePhotoURL && (
                            <img
                                src={profilePhotoURL}
                                alt="Current Profile"
                                className="w-24 rounded-full mr-4"
                            />
                        )}
                        <input
                            type="file"
                            id="profilePhoto"
                            onChange={handleProfilePhotoChange}
                            className="w-full p-2 border border-gray-300 rounded-md"
                        />
                    </div>
                    {newProfilePhoto && (
                        <button
                            onClick={handleProfilePhotoUpdate}
                            className="mt-2 mr-2 p-2 bg-blue-500 text-white rounded-md"
                        >
                            <UploadIcon /> Update Profile Photo
                        </button>
                    )}
                    {profilePhotoURL && (
                        <button
                            onClick={handleProfilePhotoRemove}
                            className="mt-2 p-2 bg-red-500 text-white rounded-md"
                        >
                            <TrashIcon /> Remove Profile Photo
                        </button>
                    )}
                </div>
                <div className="mb-4">
                    <label htmlFor="newUsername" className="block mb-1">New Username:</label>
                    <input
                        type="text"
                        id="newUsername"
                        value={newUsername}
                        onChange={(e) => setNewUsername(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md"
                    />
                </div>
                {usernameError && <p className="text-red-500">{usernameError}</p>}
                <button
                    className="mb-4 px-4 py-2 bg-green-500 text-white rounded"
                    onClick={handleUsernameChange}
                >
                    <PencilIcon /> Change Username
                </button>
                <div className="mb-4 relative">
                    <label htmlFor="currentPassword" className="block mb-1">Current Password:</label>
                    <div className="relative">
                        <input
                            id="currentPassword"
                            type={showCurrentPassword ? 'text' : 'password'}
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            placeholder="Enter current password"
                            className="w-full p-2 border border-gray-300 rounded-md pr-10"
                        />
                        <button
                            type="button"
                            onClick={() => handleTogglePasswordVisibility(setShowCurrentPassword)}
                            onKeyDown={(e) => handleKeyDown(e, setShowCurrentPassword)}
                            className="absolute inset-y-0 right-0 flex items-center z-20 px-3 cursor-pointer rounded-e-md focus:outline-none"
                        >
                            {showCurrentPassword ? <EyeIcon size={14} /> : <EyeClosedIcon size={14} />}
                        </button>
                    </div>
                </div>
                <div className="mb-4 relative">
                    <label htmlFor="newPassword" className="block mb-1">New Password:</label>
                    <div className="relative">
                        <input
                            id="newPassword"
                            type={showNewPassword ? 'text' : 'password'}
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="Enter new password"
                            className="w-full p-2 border border-gray-300 rounded-md pr-10"
                        />
                        <button
                            type="button"
                            onClick={() => handleTogglePasswordVisibility(setShowNewPassword)}
                            onKeyDown={(e) => handleKeyDown(e, setShowNewPassword)}
                            className="absolute inset-y-0 right-0 flex items-center z-20 px-3 cursor-pointer rounded-e-md focus:outline-none"
                        >
                            {showNewPassword ? <EyeIcon size={14} /> : <EyeClosedIcon size={14} />}
                        </button>
                    </div>
                </div>
                <div className="mb-4 relative">
                    <label htmlFor="retypePassword" className="block mb-1">Retype New Password:</label>
                    <div className="relative">
                        <input
                            id="retypePassword"
                            type={showRetypePassword ? 'text' : 'password'}
                            value={retypePassword}
                            onChange={(e) => setRetypePassword(e.target.value)}
                            placeholder="Retype new password"
                            className="w-full p-2 border border-gray-300 rounded-md pr-10"
                        />
                        <button
                            type="button"
                            onClick={() => handleTogglePasswordVisibility(setShowRetypePassword)}
                            onKeyDown={(e) => handleKeyDown(e, setShowRetypePassword)}
                            className="absolute inset-y-0 right-0 flex items-center z-20 px-3 cursor-pointer rounded-e-md focus:outline-none"
                        >
                            {showRetypePassword ? <EyeIcon size={14} /> : <EyeClosedIcon size={14} />}
                        </button>
                    </div>
                </div>
                {passwordError && <p className="text-red-500">{passwordError}</p>}
                <button
                    className="px-4 py-2 bg-yellow-500 text-white rounded mt-4"
                    onClick={handlePasswordChange}
                >
                    <PencilIcon /> Change Password
                </button>
            </div>
        </div>
    );
};

export default EditProfile;