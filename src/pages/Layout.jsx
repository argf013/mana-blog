import { useState, useEffect, useRef } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { initializeFirebase } from '../config/firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';

import Navbar from '../components/Navbar';
import Footer from "../components/Footer";
import ToastContainer from "../components/ToastContainer";

const Layout = () => {
    const [user, setUser] = useState(null);
    const [toast, setToast] = useState({ message: '', type: '', visible: false });
    const toastRef = useRef();
    const navigate = useNavigate();


    useEffect(() => {
        const setupFirebase = () => {
            try {
                const { auth } = initializeFirebase();
                const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
                    setUser(currentUser);
                });

                return () => unsubscribe();
            } catch (error) {
                console.error('Error initializing Firebase:', error);
            }
        };

        setupFirebase();
    }, []);

    const handleLogout = async () => {
        try {
            const { auth } = initializeFirebase();
            await auth.signOut();
            setUser(null);
            setToast({ message: 'Logout successful!', type: 'success', visible: true });
            setTimeout(() => {
                setToast({ ...toast, visible: false });
                navigate('/login');
            }, 3300); // 3000ms for toast duration + 300ms for fade-out
        } catch (error) {
            console.error('Error logging out:', error);
            setToast({ message: 'Error logging out. Please try again.', type: 'error', visible: true });
        }
    };

    return (
        <>
            <ToastContainer ref={toastRef} />
            <Navbar user={user} setUser={setUser} onLogout={handleLogout} toastRef={toastRef} />

            <main className="mx-auto min-h-screen  mt-28">
                <Outlet />
            </main>
            <Footer />
        </>
    );
};

export default Layout;