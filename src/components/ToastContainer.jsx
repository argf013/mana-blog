import { useState, useCallback, forwardRef, useImperativeHandle } from 'react';
import Toast from './Toast';

const ToastContainer = forwardRef((props, ref) => {
    const [toasts, setToasts] = useState([]);

    const removeToast = useCallback((id) => {
        setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
    }, []);

    const addToast = useCallback((message, type = 'info', duration = 3000) => {
        const id = Date.now();
        setToasts((prevToasts) => [...prevToasts, { id, message, type, duration }]);
        setTimeout(() => removeToast(id), duration + 300);
    }, [removeToast]);

    useImperativeHandle(ref, () => ({
        addToast,
    }));

    return (
        <div className="fixed bottom-8 right-8 flex flex-col-reverse space-y-2 space-y-reverse">
            {toasts.map((toast) => (
                <Toast
                    key={toast.id}
                    message={toast.message}
                    type={toast.type}
                    duration={toast.duration}
                    onClose={() => removeToast(toast.id)}
                />
            ))}
        </div>
    );
});

ToastContainer.displayName = 'ToastContainer';

export default ToastContainer;