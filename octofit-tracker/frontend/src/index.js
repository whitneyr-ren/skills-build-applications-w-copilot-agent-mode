import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';

// Determine API base from codespace env var or fallback
const codespace = process.env.REACT_APP_CODESPACE_NAME;
const API_BASE = codespace
	? `https://${codespace}-8000.app.github.dev/api`
	: 'http://localhost:8000/api';

console.log('[Index] Using API_BASE:', API_BASE);

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);
