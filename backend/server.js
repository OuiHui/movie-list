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

// MongoDB connection management for serverless
import mongoose from 'mongoose';

const initDB = async () => {
    // Check if already connected
    if (mongoose.connection.readyState === 1) {
        console.log('Using existing database connection');
        return mongoose.connection;
    }
    
    // Check if connecting
    if (mongoose.connection.readyState === 2) {
        console.log('Database connection in progress...');
        // Wait for connection to complete
        await new Promise((resolve) => {
            mongoose.connection.once('connected', resolve);
        });
        return mongoose.connection;
    }
    
    try {
        console.log('Initializing new database connection...');
        const conn = await connectDB();
        console.log('Database initialized for serverless');
        return conn;
    } catch (error) {
        console.error('Failed to initialize database:', error);
        throw error;
    }
};

// Middleware to ensure DB connection for API routes
const ensureDBConnection = async (req, res, next) => {
    try {
        await initDB();
        if (mongoose.connection.readyState !== 1) {
            return res.status(503).json({
                success: false,
                message: 'Database connection unavailable',
                connectionState: mongoose.connection.readyState
            });
        }
        next();
    } catch (error) {
        console.error('Database connection error:', error);
        res.status(503).json({
            success: false,
            message: 'Database connection failed',
            error: error.message,
            connectionState: mongoose.connection.readyState
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

// Health check endpoint with database status
app.get('/api/health', (req, res) => {
    const dbState = mongoose.connection.readyState;
    const stateNames = {
        0: 'disconnected',
        1: 'connected', 
        2: 'connecting',
        3: 'disconnecting'
    };
    
    res.status(200).json({ 
        status: dbState === 1 ? 'healthy' : 'degraded',
        database: {
            state: stateNames[dbState] || 'unknown',
            stateCode: dbState,
            host: mongoose.connection.host || 'not connected',
            name: mongoose.connection.name || 'not connected'
        },
        environment: {
            hasMongoUri: !!process.env.MONGO_URI,
            mongoUriPrefix: process.env.MONGO_URI ? process.env.MONGO_URI.substring(0, 25) + '...' : 'not set',
            nodeEnv: process.env.NODE_ENV || 'development'
        },
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// Test endpoint to diagnose database connection issues
app.get('/api/test-db', async (req, res) => {
    try {
        console.log('Testing database connection...');
        await initDB();
        
        res.status(200).json({
            success: true,
            message: 'Database connection successful',
            connectionState: mongoose.connection.readyState,
            host: mongoose.connection.host,
            dbName: mongoose.connection.name
        });
    } catch (error) {
        console.error('Database test failed:', error);
        res.status(503).json({
            success: false,
            message: 'Database connection failed',
            error: error.message,
            stack: error.stack,
            connectionState: mongoose.connection.readyState
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});