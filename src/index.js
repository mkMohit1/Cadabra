import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { Provider } from 'react-redux'; // Import Provider from react-redux
import store from './redux/store'; // Import your Redux store
import { ToastContainer } from 'react-toastify';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>  {/* Wrap your App component with Provider here */}
      <App />
      <ToastContainer />
    </Provider>
  </React.StrictMode>
);
