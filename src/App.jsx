import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Layout from "./pages/Layout";
import Blogs from "./pages/Blogs";
import Contact from "./pages/Contact";
import NoPage from "./pages/NoPage";
import Dashboard from "./pages/Dashboard";
import EditProfile from "./pages/EditProfile";
import Login from "./pages/Login";
import EditBlog from "./pages/EditBlog";
import BlogDetail from "./pages/BlogDetail";
import CreateBlog from "./pages/CreateBlog";
import useLoader from './utils/useLoader';

const App = () => {
    const { showLoader, hideLoader } = useLoader();
    const location = useLocation();

    useEffect(() => {
        const handleStart = () => showLoader();
        const handleComplete = () => hideLoader();

        handleStart();
        handleComplete();

        return () => {
            handleComplete();
        };
    }, [location, showLoader, hideLoader]);

    return (
        <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
                <Route path="/" element={<Layout />}>
                    <Route index element={<PageWrapper><Blogs /></PageWrapper>} />
                    <Route path="blogs" element={<PageWrapper><Blogs /></PageWrapper>} />
                    <Route path="blogs/:id" element={<PageWrapper><BlogDetail /></PageWrapper>} />
                    <Route path="contact" element={<PageWrapper><Contact /></PageWrapper>} />
                    <Route path="dashboard" element={<PageWrapper><Dashboard /></PageWrapper>} />
                    <Route path="dashboard/edit/profile" element={<PageWrapper><EditProfile /></PageWrapper>} />
                    <Route path="dashboard/create/blog" element={<PageWrapper><CreateBlog /></PageWrapper>} />
                    <Route path="dashboard/edit/blog/:id" element={<PageWrapper><EditBlog /></PageWrapper>} />
                    <Route path="login" element={<PageWrapper><Login /></PageWrapper>} />
                    <Route path="*" element={<PageWrapper><NoPage /></PageWrapper>} />
                </Route>
            </Routes>
        </AnimatePresence>
    );
};

// eslint-disable-next-line react/prop-types
const PageWrapper = ({ children }) => (
    <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
    >
        {children}
    </motion.div>
);

export default App;