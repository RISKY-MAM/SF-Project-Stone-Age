import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        // Use environment variable for MongoDB connection
        const mongoUri = process.env.MONGODB_URI;
        
        if (!mongoUri) {
            throw new Error('MONGODB_URI environment variable is not set');
        }
        console.log(`🔄 Attempting to connect to MongoDB...`);
        console.log(`📡 URI: ${mongoUri.replace(/\/\/.*:.*@/, '//***:***@')}`);
        
        const connection = await mongoose.connect(mongoUri, {
            serverSelectionTimeoutMS: 15000, // 15 seconds timeout
            socketTimeoutMS: 45000, // 45 seconds socket timeout
        });
        console.log(`✅ MongoDB Connected Successfully!`);
        console.log(`📊 Database: ${connection.connection.name || 'Unknown'}`);
        console.log(`🌐 Host: ${connection.connection.host || 'Unknown'}`);
        console.log(`📡 Connection State: ${connection.connection.readyState === 1 ? 'Connected' : 'Disconnected'}`);
        console.log(`🆔 Connection ID: ${connection.connection.id || 'N/A'}`);
        
        // Listen for connection events
        mongoose.connection.on('connected', () => {
            console.log('🔗 Mongoose connected to MongoDB');
        });
        
        mongoose.connection.on('error', (err) => {
            console.error('❌ MongoDB connection error:', err.message);
        });
        
        mongoose.connection.on('disconnected', () => {
            console.log('🔌 Mongoose disconnected from MongoDB');
        });
        
        return connection;
    } catch (error) {
        console.error('❌ MongoDB Connection Failed:', error.message);
        
        // Provide specific solutions based on error type
        if (error.message.includes('ENOTFOUND')) {
            console.error('� DNS Resolution Error - Possible Solutions:');
            console.error('   1. Check your internet connection');
            console.error('   2. Verify the MongoDB cluster URL is correct');
            console.error('   3. Check if the cluster is paused in MongoDB Atlas');
            console.error('   4. Try using a different DNS server (8.8.8.8)');
        } else if (error.message.includes('authentication failed')) {
            console.error('🚨 Authentication Error - Check username/password');
        } else if (error.message.includes('IP that isn\'t whitelisted')) {
            console.error('🚨 IP Whitelist Error - Add your IP to MongoDB Atlas');
        }
        
        // Don't exit the process in development - let the server start without DB
        console.warn('⚠️  Server will start without database connection');
        return null;
    }
}


// add your mongoDB connection string above.
// Do not use '@' symbol in your databse user's password else it will show an error.