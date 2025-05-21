// ToastContext.jsx
import React, { createContext, useRef } from 'react';
import ToastContainer from './ToastContainer';
import PropTypes from 'prop-types';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
    const toastRef = useRef();

    const addToast = (message, type, duration) => {
        toastRef.current.addToast(message, type, duration);
    };

    return (
        <ToastContext.Provider value={React.useMemo(() => ({ addToast }), [])}>
            {children}
            <ToastContainer ref={toastRef} />
        </ToastContext.Provider>
    );
};

ToastProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export { ToastContext };