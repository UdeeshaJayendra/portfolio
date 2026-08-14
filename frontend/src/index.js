/**
 * ============================================================
 *  index.js — React Application Entry Point
 * ============================================================
 *
 * This is the very first file React executes.
 *
 * ReactDOM.createRoot() attaches React to the <div id="root">
 * in public/index.html. Everything rendered inside root.render()
 * appears inside that div.
 *
 * Wrapper components applied here affect the ENTIRE app:
 *
 *  <BrowserRouter> — enables React Router (URL-based navigation)
 *  <AuthProvider>  — provides global auth state via useAuth() hook
 *
 *  The order matters: BrowserRouter wraps AuthProvider because
 *  auth redirects need access to the Router's history.
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'; // Enables URL routing
import { AuthProvider } from './context/AuthContext'; // Global auth state
import App from './App';
import './styles/global.css'; // Global CSS variables and base styles

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  // StrictMode renders components twice in development to detect side-effects.
  // It has NO effect in production builds.
  <React.StrictMode>
    <BrowserRouter>
      {/* AuthProvider makes useAuth() available in every component below it */}
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
