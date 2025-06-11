import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import session from 'express-session';
import MongoDBStoreImport from 'connect-mongodb-session';
import { connect } from './services/db.js';
import { isAuthenticated } from './middleware/auth.js';

import adminAuthRoutes from './routes/adminAuth.js';
import publicAuth from './routes/publicAuth.js';
import adminBannerRoutes from './routes/adminBanner.js';
import adminBlocksRoutes from './routes/adminBlocks.js';
import adminAboutRoutes from './routes/adminAbout.js';
import publicBannerRoutes from './routes/publicBanner.js';
import publicBlocksRoutes from './routes/publicBlocks.js';
import publicAboutRoutes from './routes/publicAbout.js';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const getCookieDomain = () => {
  if (process.env.NODE_ENV !== 'production') return undefined;
  try {
    const url = new URL(process.env.FRONTEND_URL);
    if (!url.hostname.includes('.')) return undefined;
    return url.hostname.startsWith('www.') 
      ? `.${url.hostname.substring(4)}`
      : `.${url.hostname}`;
  } catch {
    return undefined;
  }
};

const MongoDBStore = MongoDBStoreImport(session);
app.use(cors({
    origin: process.env.NODE_ENV === 'production'
        ? process.env.FRONTEND_URL
        : 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

const uri = process.env.MONGO_URI;
const store = new MongoDBStore({
    uri,
    collection: 'sessions',
});
store.on('error', function(error) {
    console.error('Session store error:', error);
});

app.use(session({
    secret: process.env.SESSION_SECRET || 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    store: store,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        domain: getCookieDomain()
    }
}));
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Credentials', true);
  next();
});

// Admin authentication/check routes
app.get('/api/admin/auth/check', (req, res) => {
    if (req.session?.adminUser || req.user?.isAdmin) {
        return res.status(200).json({ isAuthenticated: true });
    } else {
        return res.status(401).json({ isAuthenticated: false });
    }
});
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "../swagger.js";

// ...existing code...

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ...existing code...
// Admin routes (protected)
app.use('/api/admin', adminAuthRoutes);
app.use('/api/admin/dashboard', isAuthenticated, adminAuthRoutes);
app.use('/api/admin/logout', isAuthenticated, adminAuthRoutes);
app.use('/api/admin/banner', isAuthenticated, adminBannerRoutes);
app.use('/api/admin/blocks', isAuthenticated, adminBlocksRoutes);
app.use('/api/admin/about', isAuthenticated, adminAboutRoutes);

// Public authentication (register, login, logout, check)
app.use('/api/public/auth', publicAuth);

// Public routes (no authentication required)
app.use('/api/public/banner', publicBannerRoutes);
app.use('/api/public/blocks', publicBlocksRoutes);
app.use('/api/public/about', publicAboutRoutes);

export default app;