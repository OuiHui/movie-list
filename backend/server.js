import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './db.js';
import movieRoutes from './route/movie.route.js';
import listRoutes from './route/list.route.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware - CORS configuration for production
app.use(cors({
    origin: [
        'https://ouihui.github.io',
        'http://localhost:3000',
        'http://localhost:5173',
        'http://localhost:5174',
        process.env.FRONTEND_URL
    ].filter(Boolean), // Remove any undefined values
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS', 'HEAD'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With'],
    credentials: true,
    optionsSuccessStatus: 200
}));
app.use(express.json());

// Initialize MongoDB connection
let dbConnection = null;
const initDB = async () => {
    if (!dbConnection) {
        try {
            dbConnection = await connectDB();
            console.log('Database initialized for serverless');
        } catch (error) {
            console.error('Failed to initialize database:', error);
            dbConnection = null;
        }
    }
    return dbConnection;
};

// Middleware to ensure DB connection for API routes
const ensureDBConnection = async (req, res, next) => {
    try {
        await initDB();
        if (!dbConnection) {
            return res.status(503).json({
                success: false,
                message: 'Database connection unavailable'
            });
        }
        next();
    } catch (error) {
        console.error('Database connection error:', error);
        res.status(503).json({
            success: false,
            message: 'Database connection failed',
            error: error.message
        });
    }
};

// Routes
app.get('/', (req, res) => {
    res.json({ message: 'Movie List API is running!' });
});

// Movie routes (with DB connection check)
app.use('/api/movies', ensureDBConnection, movieRoutes);

// List routes (with DB connection check)
app.use('/api/lists', ensureDBConnection, listRoutes);

// Health check endpoint for Docker
app.get('/api/health', (req, res) => {
    res.status(200).json({ 
        status: 'healthy', 
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});