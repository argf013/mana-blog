import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { initializeFirebase } from '../config/firebaseConfig';
import { signOut } from 'firebase/auth';
import PropTypes from 'prop-types';
import { SignOutIcon, XIcon } from "@primer/octicons-react";
import useToast from "../utils/useToast";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = ({ user, setUser }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [scrollProgress, setScrollProgress] = useState(0);
    const location = useLocation();
    const navigate = useNavigate();
    const { addToast } = useToast();
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [dropdownRef]);

    useEffect(() => {
        const handleScroll = () => {
            const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
            const currentScroll = window.scrollY;
            const scrollPercentage = (currentScroll / totalScroll) * 100;
            setScrollProgress(scrollPercentage);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = async () => {
        try {
            const { auth } = initializeFirebase();
            await signOut(auth);
            setUser(null);
            addToast('Logout successful!', 'success');
            navigate('/login');
        } catch (error) {
            console.error('Error logging out:', error);
            addToast('Error logging out. Please try again.', 'error');
        }
    };

    const handleClick = () => {
        setIsOpen(false);
        setIsDropdownOpen(false);
    };

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
        if (!isDropdownOpen) {
            setIsOpen(false);
        }
    };

    const toggleMenu = () => {
        setIsOpen(!isOpen);
        if (!isOpen) {
            setIsDropdownOpen(false);
        }
    };

    const checkActive = (path) => location.pathname === path;

    return (
        <nav className="fixed top-0 left-0 bg-white right-0 bg-white/90 backdrop-blur-md border border-gray-200 dark:bg-gray-900/90 shadow-lg z-50 transition-all duration-300">
            <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                <Link to="/" className="flex items-center space-x-3 rtl:space-x-reverse" onClick={handleClick}>
                    <img src="https://flowbite.com/docs/images/logo.svg" className="h-8" alt="Flowbite Logo" />
                    <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">Mana</span>
                </Link>
                <div className="flex items-center md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse relative">
                    <button data-collapse-toggle="navbar-user" type="button" className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600" aria-controls="navbar-user" aria-expanded={isOpen} onClick={toggleMenu}>
                        <span className="sr-only">Open main menu</span>
                        <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15" />
                        </svg>
                    </button>
                    {user ? (
                        <>
                            <button
                                type="button"
                                className="flex text-sm rounded-full md:me-0"
                                id="user-menu-button"
                                aria-expanded={isDropdownOpen}
                                onClick={toggleDropdown}
                            >
                                {isDropdownOpen ? (
                                    <XIcon className="text-black" size={32} />
                                ) : (
                                    <img className="w-8 h-8 rounded-full" src={user.photoURL} alt="user" />
                                )}
                            </button>
                            <AnimatePresence>
                                {isDropdownOpen && (
                                    <motion.div
                                        ref={dropdownRef}
                                        className="absolute right-2 top-8 z-50 my-4 text-base list-none bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-700 dark:divide-gray-600"
                                        id="user-dropdown"
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <div className="px-4 py-3">
                                            <span className="block text-sm text-gray-900 dark:text-white">{user.displayName}</span>
                                            <span className="block text-sm text-gray-500 truncate dark:text-gray-400">{user.email}</span>
                                        </div>
                                        <ul className="py-2" aria-labelledby="user-menu-button">
                                            <li>
                                                <Link
                                                    to="/dashboard"
                                                    className={`block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white ${checkActive('/dashboard') ? 'bg-gray-100 dark:bg-gray-600' : ''}`}
                                                    onClick={handleClick}
                                                >
                                                    Dashboard
                                                </Link>
                                            </li>
                                            <li>
                                                <Link
                                                    to="/dashboard/edit/profile"
                                                    className={`block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white ${checkActive('/dashboard/edit/profile') ? 'bg-gray-100 dark:bg-gray-600' : ''}`}
                                                    onClick={handleClick}
                                                >
                                                    Setting
                                                </Link>
                                            </li>
                                            <li>
                                                <button
                                                    className="block w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white flex items-center"
                                                    onClick={() => { handleLogout(); handleClick(); }}
                                                >
                                                    Sign out
                                                    <SignOutIcon size={14} className="ml-2" />
                                                </button>
                                            </li>
                                        </ul>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </>
                    ) : (
                        <Link to="/login" className="block px-4 py-2 text-center text-gray-100 rounded-md bg-blue-700 hover:text-gray-200 hover:bg-blue-800 transition-colors duration-200 hidden md:block" onClick={handleClick}>Login</Link>
                    )}
                </div>
                <div className={`items-center justify-between ${isOpen ? 'flex' : 'hidden'} w-full md:flex md:w-auto md:order-1`} id="navbar-user">
                    <ul className="flex flex-col font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700 w-full md:w-auto">
                        <li>
                            <Link
                                to="/blogs"
                                className={`block py-2 px-3 rounded md:p-0 ${checkActive('/blogs') ? 'text-white bg-blue-700 md:bg-transparent md:text-blue-700' : 'text-gray-900 hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent'}`}
                                onClick={handleClick}
                            >
                                Blogs
                            </Link>
                        </li>
                        {!user && (
                            <li className="md:hidden">
                                <Link
                                    to="/login"
                                    className="block py-2 px-3 rounded md:p-0 text-gray-900 hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
                                    onClick={handleClick}
                                >
                                    Login
                                </Link>
                            </li>
                        )}
                    </ul>
                </div>
            </div>
            {/* Progress Bar */}
            <div
                className="bg-blue-600 transition-all duration-300 ease-out"
                style={{ width: `${scrollProgress}%`, height: '5px' }}
            />
        </nav>
    );
};

Navbar.propTypes = {
    user: PropTypes.object,
    setUser: PropTypes.func.isRequired
};

export default Navbar;