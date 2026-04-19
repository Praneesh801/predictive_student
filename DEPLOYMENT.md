# 🚀 Deployment Guide

This project is prepared for deployment using **Vercel** (Frontend) and **Render** (Backend).

## 1. Backend (Render)
- **Service Type**: Web Service
- **Environment**: Node.js
- **Root Directory**: `backend`
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Environment Variables**:
  - `MONGODB_URI`: Your MongoDB connection string.
  - `JWT_SECRET`: A secure random string for JWT.
  - `FRONTEND_URL`: The URL where your frontend is deployed (e.g., `https://pspa-frontend.vercel.app`).
  - `NODE_ENV`: `production`

## 2. Frontend (Vercel)
- **Framework**: Vite/React
- **Root Directory**: `frontend`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Environment Variables**:
  - `VITE_API_URL`: The URL of your Render backend followed by `/api` (e.g., `https://pspa-backend.onrender.com/api`).

## ⚠️ Important Notes
- **CORS**: The backend is configured to trust the `FRONTEND_URL`. Ensure this matches exactly with your Vercel deployment URL.
- **Database**: Ensure your MongoDB (Atlas) allows connections from "0.0.0.0/0" (anywhere) or add Render's IP addresses to the whitelist.
- **Vite Env**: All environment variables in the frontend must start with `VITE_` to be accessible in the code.
