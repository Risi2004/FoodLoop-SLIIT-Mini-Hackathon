# 🚀 FoodLoop Deployment Guide

This guide provides step-by-step instructions for deploying the **FoodLoop** application:
- **Backend**: Deployed on **Render** (Node.js Web Service)
- **Frontend**: Deployed on **Vercel** (Vite + React SPA)
- **Database**: **MongoDB Atlas**
- **File Storage**: **Cloudflare R2**

---

## 📂 Project Structure

```
Project/
├── backend/
│   ├── render.yaml                    # Render Blueprint configuration
│   ├── .env.production.example        # Reference environment variables for Render
│   ├── server.js                      # Main entry point with flexible CORS
│   ├── package.json                   # "start": "node server.js"
│   └── src/
│       ├── config/                    # DB & Cloudflare R2 setup
│       ├── controllers/               # Auth controllers
│       ├── middleware/                # JWT auth, R2 upload & error handling
│       ├── models/                    # Mongoose User model
│       ├── routes/                    # API endpoints (/api/auth)
│       └── services/                  # Business logic & Cloudflare R2 service
│
└── frontend/
    ├── vercel.json                    # Vercel SPA routing rewrite rules
    ├── .env.example                   # Environment variable template
    ├── package.json                   # "build": "vite build"
    └── src/
        ├── components/                # Landing, Auth & UI components
        ├── pages/                     # LandingPage, LoginPage, SignupPage
        └── services/                  # auth.service.js API client
```

---

## Part 1: Deploying the Backend on Render 🟢

### Step 1: Create a New Web Service on Render
1. Log in to your **[Render Dashboard](https://dashboard.render.com/)**.
2. Click **New +** -> **Web Service**.
3. Connect your GitHub Repository: `Risi2004/Mini-Hackathon`.

### Step 2: Configure Service Settings
- **Name**: `foodloop-backend`
- **Root Directory**: `backend` *(Important!)*
- **Runtime**: `Node`
- **Build Command**: `npm install`
- **Start Command**: `npm start` *(or `node server.js`)*
- **Instance Type**: `Free`

### Step 3: Add Environment Variables in Render
Go to the **Environment** tab in your Render service and add:

| Key | Value |
| :--- | :--- |
| `NODE_ENV` | `production` |
| `PORT` | `5000` |
| `MONGODB_URI` | `mongodb+srv://<user>:<password>@cluster0.z6b1vli.mongodb.net/foodloop` |
| `JWT_SECRET` | `your_production_jwt_secret_key` |
| `JWT_EXPIRES_IN` | `7d` |
| `R2_ACCOUNT_ID` | `9701027772b309a817e8aa72209cc9e7` |
| `R2_ACCESS_KEY_ID` | `4ea4ba320e50ced2da481cd3cd637be0` |
| `R2_SECRET_ACCESS_KEY` | `8134d9d8e15f05423701845afb3e5be350ad472a07846f298bd8de6780f94597` |
| `R2_BUCKET_NAME` | `foodloop` |
| `R2_PUBLIC_URL` | `https://pub-20291fa6a68e43fc87910cb95178440a.r2.dev` |
| `CORS_ORIGIN` | `https://foodloop-frontend.vercel.app` *(or `*`)* |

### Step 4: Deploy & Copy Backend URL
Click **Deploy Web Service**. Once deployed, copy your backend URL (e.g. `https://foodloop-backend.onrender.com`).
Verify by visiting:
`https://foodloop-backend.onrender.com/api/health` -> returns `{"status": "healthy"}`.

---

## Part 2: Deploying the Frontend on Vercel ▲

### Step 1: Import Project to Vercel
1. Log in to your **[Vercel Dashboard](https://vercel.com/dashboard)**.
2. Click **Add New...** -> **Project**.
3. Select your GitHub repository: `Risi2004/Mini-Hackathon`.

### Step 2: Configure Project Settings
- **Framework Preset**: `Vite`
- **Root Directory**: Click **Edit** and choose `frontend` *(Important!)*
- **Build Command**: `npm run build`
- **Output Directory**: `dist`

### Step 3: Add Environment Variables in Vercel
Expand the **Environment Variables** section and add:

| Key | Value |
| :--- | :--- |
| `VITE_API_URL` | `https://your-backend-name.onrender.com` |
| `VITE_API_BASE_URL` | `https://your-backend-name.onrender.com/api` *(optional alias)* |

Set **at least one**. Prefer `VITE_API_URL` (server root, no `/api`). Redeploy the frontend after changing env vars — Vite bakes them in at build time.

### Step 4: Deploy
Click **Deploy**. Vercel will build and assign your production domain (e.g., `https://foodloop-frontend.vercel.app`).

---

## Part 3: Verify Full Integration ✅

1. Open your Vercel URL in your browser.
2. Navigate to **Donor Signup** (`/signup/donor`) or **Volunteer Signup** (`/signup/driver`).
3. Fill out the registration form, upload your profile picture / documents, and click **Create Account**.
4. The file will be streamed to **Cloudflare R2**, the user record created in **MongoDB Atlas**, and you will receive a verified JWT session!
