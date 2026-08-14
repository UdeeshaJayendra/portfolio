/**
 * ============================================================
 *  api.js — Centralised API call functions
 * ============================================================
 *
 * axios.create() makes a pre-configured axios instance so we
 * don't repeat the base URL and headers in every component.
 *
 * The request interceptor automatically attaches the JWT token
 * to every outgoing request — components don't need to do this manually.
 *
 * The response interceptor catches 401 errors globally —
 * if the token expires, the user is logged out automatically.
 */

import axios from 'axios';

// Create an axios instance with the base URL pointing to our Express backend.
// In development, the React proxy (set in package.json) forwards /api/* to localhost:5000.
const API = axios.create({
  baseURL: `${process.env.REACT_APP_API_URL}/api`,
});
// ── Request interceptor ────────────────────────────────────────
// Runs before EVERY request this instance makes.
// Reads the JWT token from localStorage and adds it to the Authorization header.
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('portfolio_token');
  if (token) {
    // Standard Bearer token format expected by the auth middleware
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ── Response interceptor ───────────────────────────────────────
// Runs after EVERY response (or error) comes back.
// If the server returns 401 (Unauthorized), our token has expired —
// clear storage and redirect to home so the user must log in again.
API.interceptors.response.use(
  (response) => response, // Pass successful responses through unchanged
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid — clean up and force re-login
      localStorage.removeItem('portfolio_token');
      localStorage.removeItem('portfolio_user');
      // Only redirect if not already on home page to avoid redirect loop
      if (window.location.pathname !== '/') {
        window.location.href = '/';
      }
    }
    return Promise.reject(error); // Still propagate the error to the calling code
  }
);

// ── Auth API calls ─────────────────────────────────────────────
export const loginUser    = (data) => API.post('/auth/login', data);
export const getMe        = ()     => API.get('/auth/me');

// ── Profile API calls ──────────────────────────────────────────
export const getProfile    = ()     => API.get('/profile');
export const updateProfile = (data) => API.post('/profile', data); // Admin only

// ── Projects API calls ─────────────────────────────────────────
export const getProjects    = ()        => API.get('/projects');
export const createProject  = (data)    => API.post('/projects', data);        // Admin
export const updateProject  = (id,data) => API.put(`/projects/${id}`, data);   // Admin
export const deleteProject  = (id)      => API.delete(`/projects/${id}`);      // Admin

// ── Skills API calls ───────────────────────────────────────────
export const getSkills   = ()        => API.get('/skills');
export const createSkill = (data)    => API.post('/skills', data);
export const updateSkill = (id,data) => API.put(`/skills/${id}`, data);
export const deleteSkill = (id)      => API.delete(`/skills/${id}`);

// ── Experience API calls ───────────────────────────────────────
export const getExperience    = ()        => API.get('/experience');
export const createExperience = (data)    => API.post('/experience', data);
export const updateExperience = (id,data) => API.put(`/experience/${id}`, data);
export const deleteExperience = (id)      => API.delete(`/experience/${id}`);

// ── Education API calls ────────────────────────────────────────
export const getEducation    = ()        => API.get('/education');
export const createEducation = (data)    => API.post('/education', data);
export const updateEducation = (id,data) => API.put(`/education/${id}`, data);
export const deleteEducation = (id)      => API.delete(`/education/${id}`);

// ── Certifications API calls ───────────────────────────────────
export const getCertifications    = ()        => API.get('/certifications');
export const createCertification  = (data)    => API.post('/certifications', data);
export const updateCertification  = (id,data) => API.put(`/certifications/${id}`, data);
export const deleteCertification  = (id)      => API.delete(`/certifications/${id}`);

// ── Contact API call ───────────────────────────────────────────
export const sendContactMessage = (data) => API.post('/contact', data);

export default API;
