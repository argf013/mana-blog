import { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { KebabHorizontalIcon } from '@primer/octicons-react';
import { AnimatePresence, motion } from 'framer-motion';

const ActionMenu = ({ actions, row }) => {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef(null);

    const handleToggle = () => {
        setIsOpen(!isOpen);
    };

    const handleClickOutside = (event) => {
        if (menuRef.current && !menuRef.current.contains(event.target)) {
            setIsOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="relative" ref={menuRef}>
            <button onClick={handleToggle} className="text-gray-500 hover:text-gray-700">
                <KebabHorizontalIcon size={14} />
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        className="z-10 absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded shadow-lg"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                    >
                        {actions.map((action) => (
                            <button
                                key={action.id}
                                onClick={() => {
                                    action.onClick(row);
                                    setIsOpen(false);
                                }}
                                className={`flex items-center w-full text-left px-4 py-2 hover:bg-gray-100 ${action.danger ? 'text-red-500' : 'text-gray-700'}`}
                            >
                                {action.icon && <span className="mr-2">{action.icon}</span>}
                                {action.label}
                            </button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

ActionMenu.propTypes = {
    actions: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string.isRequired,
            label: PropTypes.string,
            onClick: PropTypes.func,
            icon: PropTypes.element,
            danger: PropTypes.bool
        })
    ).isRequired,
    row: PropTypes.object.isRequired
};

export default ActionMenu;