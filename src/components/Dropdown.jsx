import { useState } from 'react';
import PropTypes from 'prop-types';

const Dropdown = ({ buttonLabel, items }) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className="relative inline-block text-left">
            <button
                id="dropdownDefaultButton"
                onClick={toggleDropdown}
                className="text-white bg-gray-700 hover:bg-gray-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                type="button"
            >
                {buttonLabel}
                <svg className="w-2.5 h-2.5 ml-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4" />
                </svg>
            </button>

            {isOpen && (
                <div id="dropdown" className="z-10 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 absolute mt-2">
                    <ul className="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownDefaultButton">
                        {items.map((item) => (
                            <li key={item.value}>
                                <a
                                    href={item.href}
                                    className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        item.onClick();
                                        setIsOpen(false);
                                    }}
                                >
                                    {item.label}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

Dropdown.propTypes = {
    buttonLabel: PropTypes.any,
    items: PropTypes.arrayOf(
        PropTypes.shape({
            label: PropTypes.string,
            href: PropTypes.string,
            onClick: PropTypes.func,
            value: PropTypes.string,
        })
    ),
};

export default Dropdown;