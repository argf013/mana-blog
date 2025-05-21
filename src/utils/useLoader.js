import { useContext } from 'react';
import { LoaderContext } from '../components/LoaderContext';

const useLoader = () => {
    const { showLoader, hideLoader } = useContext(LoaderContext);
    return { showLoader, hideLoader };
};

export default useLoader;