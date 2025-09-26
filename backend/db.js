import mongoose from 'mongoose';

export const connectDB = async () => {
    try {
        console.log('Attempting to connect to MongoDB...');
        console.log('MONGO_URI exists:', !!process.env.MONGO_URI);
        
        // Serverless-friendly connection options
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
            maxPoolSize: 10,
            minPoolSize: 1,
            maxIdleTimeMS: 30000,
            bufferCommands: false
            // Removed bufferMaxEntries as it's not supported
        });
        console.log(`MongoDB connected: ${conn.connection.host}`);
        return conn;
    } catch (error) {
        console.error('MongoDB connection error:', error);
        console.error('Connection string prefix:', process.env.MONGO_URI ? process.env.MONGO_URI.substring(0, 30) + '...' : 'undefined');
        // Don't exit process in serverless environment - just throw the error
        throw error;
    }
}