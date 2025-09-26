import mongoose from 'mongoose';

export const connectDB = async () => {
    try {
        // Add serverless-friendly connection options
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
            socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
            maxPoolSize: 10, // Maintain up to 10 socket connections
            minPoolSize: 1, // Maintain at least 1 socket connection
            maxIdleTimeMS: 30000, // Close connections after 30 seconds of inactivity
            bufferCommands: false, // Disable mongoose buffering
            bufferMaxEntries: 0 // Disable mongoose buffering
        });
        console.log(`MongoDB connected: ${conn.connection.host}`);
        return conn;
    } catch (error) {
        console.error('MongoDB connection error:', error);
        console.error('Connection string prefix:', process.env.MONGO_URI ? process.env.MONGO_URI.substring(0, 20) : 'undefined');
        // Don't exit process in serverless environment - just throw the error
        throw error;
    }
}