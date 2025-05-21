import { useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import PropTypes from 'prop-types';

const ImageWithLoader = ({ src, alt, className }) => {
    const [loading, setLoading] = useState(true);

    return (
        <div className="relative">
            {loading && <Skeleton className="absolute inset-0" />}
            <img
                src={src}
                alt={alt}
                className={`${className} ${loading ? 'hidden' : 'block'}`}
                onLoad={() => setLoading(false)}
            />
        </div>
    );
};

ImageWithLoader.propTypes = {
    src: PropTypes.string,
    alt: PropTypes.string,
    className: PropTypes.string
};

export default ImageWithLoader;