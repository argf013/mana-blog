import { useState, useEffect } from 'react';
import { initializeFirebase } from '../config/firebaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import useToast from '../utils/useToast';
import useLoader from '../utils/useLoader';
import { EyeClosedIcon, EyeIcon } from '@primer/octicons-react';

const LoginForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);
    const [firebaseInitialized, setFirebaseInitialized] = useState(false);
    const [isPasswordEmpty, setIsPasswordEmpty] = useState(true);
    const navigate = useNavigate();
    const { addToast } = useToast();
    const { showLoader, hideLoader } = useLoader();

    useEffect(() => {
        const setupFirebase = async () => {
            try {
                initializeFirebase();
                setFirebaseInitialized(true);
            } catch (error) {
                console.error('Error initializing Firebase:', error);
            }
        };

        setupFirebase();
    }, []);

    const handleSignIn = async () => {
        showLoader(); // Show loader
        try {
            const { auth } = initializeFirebase();
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            setUser(userCredential.user);
            setError(null);
            addToast('Login successful!', 'success', 2000);
            addToast(`Welcome, ${userCredential.user.email}`, 'success', 2000);
            navigate('/dashboard');
        } catch (err) {
            setError(err.message);
            addToast(`Error: ${err.message}`, 'error', 3000);
        } finally {
            hideLoader(); // Hide loader
        }
    };

    const handleTogglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            handleTogglePasswordVisibility();
        }
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
        setIsPasswordEmpty(e.target.value === '');
    };

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            handleSignIn();
        }
    };

    if (!firebaseInitialized) {
        return <p className="text-center">Loading Firebase...</p>;
    }

    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center">Sign in</h2>
                <div className="mb-4">
                    <label htmlFor="email" className="block text-gray-700">Email</label>
                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email"
                        className="w-full p-2 border border-gray-300 rounded-md"
                    />
                </div>
                <div className="mb-4 relative">
                    <label htmlFor="hs-toggle-password" className="block text-sm dark:text-white">Password</label>
                    <div className="relative">
                        <input
                            id="hs-toggle-password"
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={handlePasswordChange}
                            onKeyPress={handleKeyPress}
                            placeholder="Enter password"
                            className="w-full p-2 border border-gray-300 rounded-md pr-10" // Add padding to the right
                        />
                        <button
                            type="button"
                            onClick={handleTogglePasswordVisibility}
                            onKeyDown={handleKeyDown}
                            className={`absolute inset-y-0 right-0 flex items-center z-20 px-3 cursor-pointer rounded-e-md focus:outline-none ${isPasswordEmpty ? 'text-gray-400' : 'text-gray-800 dark:text-neutral-600 dark:focus:text-blue-500'}`}
                            disabled={isPasswordEmpty}
                        >
                            {showPassword ? <EyeIcon size={14} /> : <EyeClosedIcon size={14} />}
                        </button>
                    </div>
                </div>
                <button
                    onClick={handleSignIn}
                    className="w-full py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition"
                >
                    Sign In
                </button>
                {user && <p className="mt-4 text-green-500 text-center">Welcome, {user.email}</p>}
                {error && <p className="mt-4 text-red-500 text-center">Error: {error}</p>}
            </div>
        </div>
    );
};

export default LoginForm;