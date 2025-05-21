import React, { createContext, useState } from 'react';
import Loader from './Loader';
import PropTypes from 'prop-types';

export const LoaderContext = createContext();

export const LoaderProvider = ({ children }) => {
    const [loading, setLoading] = useState(false);

    const showLoader = React.useCallback(() => setLoading(true), []);
    const hideLoader = React.useCallback(() => setLoading(false), []);

    return (
        <LoaderContext.Provider value={React.useMemo(() => ({ loading, showLoader, hideLoader }), [loading, showLoader, hideLoader])}>
            {children}
            {loading && <Loader />}
        </LoaderContext.Provider>
    );
};

LoaderProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export default LoaderProvider;