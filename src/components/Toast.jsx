import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import './Toast.css';
import { CheckCircleFillIcon, AlertFillIcon, AlertIcon, InfoIcon } from '@primer/octicons-react';

const Toast = ({ message, type = 'info', duration = 3000, onClose }) => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        setVisible(true);
        const timer = setTimeout(() => {
            setVisible(false);
            setTimeout(onClose, 300);
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onClose]);

    const getTypeStyles = (type) => {
        switch (type) {
            case 'success':
                return 'bg-green-500 text-white';
            case 'error':
                return 'bg-red-500 text-white';
            case 'warning':
                return 'bg-yellow-500 text-black';
            default:
                return 'bg-blue-500 text-white';
        }
    };

    const getIcon = (type) => {
        switch (type) {
            case 'success':
                return <CheckCircleFillIcon className="mr-2" />;
            case 'error':
                return <AlertFillIcon className="mr-2" />;
            case 'warning':
                return <AlertIcon className="mr-2" />;
            default:
                return <InfoIcon className="mr-2" />;
        }
    };

    return (
        <div className={`p-2 px-4 rounded-full shadow-lg ${getTypeStyles(type)} flex items-center transition-opacity duration-300 ${visible ? 'opacity-100 pop-up' : 'opacity-0'}`}>
            {getIcon(type)}
            <span className="flex-1">{message}</span>
            <button 
                onClick={() => {
                    setVisible(false);
                    setTimeout(onClose, 300); 
                }} 
                className="ml-4 text-white hover:text-gray-200 focus:outline-none"
            >
                &times;
            </button>
        </div>
    );
};

Toast.propTypes = {
    message: PropTypes.string,
    type: PropTypes.oneOf(['info', 'success', 'error', 'warning']),
    duration: PropTypes.number,
    onClose: PropTypes.func,
};

export default Toast;