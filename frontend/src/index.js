/**
 * Author: Brandon Trundle
 * File Name: index.js
 * Date-Created: 4/26/2025
 * 
 * File Overview:
 * Entry point for bootstrapping the ArcanaTable frontend React application.
 * 
 * Behavior:
 * - Renders the main App component into the root DOM element.
 * - Wraps App with BrowserRouter for client-side routing.
 * - Wraps App with UserProvider to initialize authentication context.
 * 
 * Props:
 * - None (application entry file).
 */

import React from 'react'; // React library core
import ReactDOM from 'react-dom/client'; // React DOM rendering for React 18+
import './index.css'; // Global CSS styling
import App from './App'; // Main App component
import { BrowserRouter } from 'react-router-dom'; // Router provider for managing URL-based routing
import { UserProvider } from './context/UserContext'; // Authentication context provider for user state


console.log("📡 Initializing App...");

/**
 * Initializes the React app by rendering App inside the root DOM element.
 * 
 * Behavior:
 * - BrowserRouter enables client-side routing.
 * - UserProvider manages global user authentication state.
 */
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <UserProvider>
      <App />
    </UserProvider>
  </BrowserRouter>
);

console.log("✅ App rendered successfully.");
