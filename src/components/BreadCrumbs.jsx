import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const Breadcrumbs = ({ items }) => {
    const truncateText = (text, maxLength) => {
        if (text.length > maxLength) {
            return text.substring(0, maxLength) + '...';
        }
        return text;
    };

    return (
        <nav className="flex" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-3">
                {items.map((item, index) => (
                    <li key={item.id || index} className="inline-flex items-center">
                        {item !== items[items.length - 1] ? (
                            <div className="flex items-center">
                                <Link to={item.route} className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white">
                                    {item === items[0] && (
                                        <svg className="w-3 h-3 mr-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z" />
                                        </svg>
                                    )}
                                    <span className="block md:hidden">
                                        {truncateText(item.label, 10)}
                                    </span>
                                    <span className="hidden md:block">
                                        {item.label}
                                    </span>
                                </Link>
                                <svg className="rtl:rotate-180 w-3 h-3 text-gray-400 mx-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4" />
                                </svg>
                            </div>
                        ) : (
                            <div className="flex items-center">
                                <span className="ms-1 text-sm font-medium text-gray-500 md:ms-2 dark:text-gray-400">
                                    <span className="block md:hidden">
                                        {truncateText(item.label, 10)}
                                    </span>
                                    <span className="hidden md:block">
                                        {item.label}
                                    </span>
                                </span>
                            </div>
                        )}
                    </li>
                ))}
            </ol>
        </nav>
    );
};

Breadcrumbs.propTypes = {
    items: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string,
            label: PropTypes.string.isRequired,
            route: PropTypes.string
        })
    ).isRequired
};

export default Breadcrumbs;