import PropTypes from 'prop-types';
import { useState } from 'react';
import { Link } from 'react-router-dom';

const Card = ({
    image = false,
    imageUrl = '',
    title = false,
    titleText = '',
    desc = false,
    descText = '',
    footer = false,
    footerText = '',
    rotation = 'portrait',
    link = '#'
}) => {
    const [imgSrc, setImgSrc] = useState(imageUrl);

    const handleError = () => {
        setImgSrc('https://via.placeholder.com/150?text=Image+Not+Available'); // Online placeholder image URL with custom text
    };

    return (
        <div className={`border rounded shadow-lg p-4 ${rotation === 'portrait' ? 'w-64' : 'w-full'}`}>
            {image && (
                <Link to={link}>
                    <img src={imgSrc} alt="thumbnail" className="w-full h-48 object-cover mb-4 rounded-md" onError={handleError} />
                </Link>
            )}
            {title && <h2 className="text-xl font-bold mb-2 break-words">{titleText}</h2>}
            {desc && <p className="text-gray-700 break-words">{descText}</p>}
            {footer && <div className="text-gray-500 text-sm break-words">{footerText}</div>}
        </div>
    );
};

Card.propTypes = {
    image: PropTypes.bool,
    imageUrl: PropTypes.string,
    title: PropTypes.bool,
    titleText: PropTypes.any,
    desc: PropTypes.bool,
    descText: PropTypes.string,
    footer: PropTypes.bool,
    footerText: PropTypes.string,
    rotation: PropTypes.oneOf(['portrait', 'landscape']),
    link: PropTypes.string
};

export default Card;