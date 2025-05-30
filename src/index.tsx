import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
    <React.StrictMode>
        <h1 className="bg-green-200 text-3xl text-blue-500 p-4">Hello Tailwind!</h1>

        <App />
    </React.StrictMode>
);