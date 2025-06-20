import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';  // Tailwind styles
import './styles/global.scss';  // Global SCSS styles
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './app/store';
import { PersistGate } from 'redux-persist/integration/react';
import { persistor } from './app/store';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
    <React.StrictMode>
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <BrowserRouter>
                    <App />
                </BrowserRouter>
            </PersistGate>
        </Provider>
    </React.StrictMode>
);