/**
 * KnoSlides Development Preview
 * 
 * Entry point for the development server.
 * Initializes the block registry before rendering.
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Initialize the block registry with all core blocks
import { initializeBlocks } from './blocks';
initializeBlocks();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
