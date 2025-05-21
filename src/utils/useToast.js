// useToast.js
import { useContext } from 'react';
import { ToastContext } from '../components/ToastContext';

const useToast = () => useContext(ToastContext);

export default useToast;