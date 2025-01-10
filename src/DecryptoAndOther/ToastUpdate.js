import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Ensure styles are also imported


// Default options for toast
const defaultOptions = {
  autoClose: 2000,
//   position: toast.POSITION.TOP_CENTER,
  className: 'toast-container', // Apply the custom margin
};

// Custom toast functions
export const infoToast = (message, options = {}) => {
  toast.info(message, { ...defaultOptions, ...options });
};

export const successToast = (message, options = {}) => {
  toast.success(message, { ...defaultOptions, ...options });
};

export const errorToast = (message, options = {}) => {
  toast.error(message, { ...defaultOptions, ...options });
};

export const warningToast = (message, options = {}) => {
  toast.warn(message, { ...defaultOptions, ...options });
};
