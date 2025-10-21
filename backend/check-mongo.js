// Comprehensive MongoDB Connection Checker
import mongoose from 'mongoose';
import 'dotenv/config';

const checkMongoConnection = async () => {
    console.log('🔍 MongoDB Connection Diagnostic Tool');
    console.log('=====================================\n');
    
    // Check environment variables
    console.log('📋 Environment Check:');
    console.log(`   MONGODB_URI: ${process.env.MONGODB_URI ? '✅ Found' : '❌ Not set'}`);
    console.log(`   JWT_SECRET: ${process.env.JWT_SECRET ? '✅ Found' : '❌ Not set'}\n`);
    
    // Test MongoDB Connection
    console.log('🔄 Testing MongoDB Connection...');
    
    const mongoUri = process.env.MONGODB_URI || 'mongodb+srv://riskyanees43_db_user:Ldq7%23mam@cluster0.2tvcilv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0/food-del';
    
    try {
        console.log(`📡 Connecting to: ${mongoUri.replace(/\/\/.*:.*@/, '//***:***@')}`);
        
        const connection = await mongoose.connect(mongoUri, {
            serverSelectionTimeoutMS: 10000, // 10 seconds timeout
        });
        
        console.log('✅ MongoDB Connected Successfully!');
        console.log(`📊 Database: ${connection.connection.name}`);
        console.log(`🌐 Host: ${connection.connection.host}`);
        console.log(`📡 Connection State: ${connection.connection.readyState === 1 ? 'Connected' : 'Disconnected'}`);
        
        // Test a simple query
        console.log('\n🧪 Testing Database Query...');
        const collections = await connection.connection.db.listCollections().toArray();
        console.log(`📁 Collections found: ${collections.length}`);
        collections.forEach(col => console.log(`   - ${col.name}`));
        
        await mongoose.connection.close();
        console.log('\n🔌 Connection closed successfully');
        console.log('✅ All tests passed! MongoDB is working correctly.');
        
        return true;
    } catch (error) {
        console.log('\n❌ MongoDB Connection Failed!');
        console.log(`🔍 Error Type: ${error.name}`);
        console.log(`💬 Message: ${error.message}`);
        
        // Specific error handling
        if (error.message.includes('IP that isn\'t whitelisted')) {
            console.log('\n🚨 SOLUTION NEEDED:');
            console.log('   1. Go to MongoDB Atlas (https://cloud.mongodb.com)');
            console.log('   2. Navigate to Network Access');
            console.log('   3. Add your current IP address to the whitelist');
            console.log('   4. Or add 0.0.0.0/0 for development (less secure)');
        } else if (error.message.includes('authentication failed')) {
            console.log('\n🚨 AUTHENTICATION ISSUE:');
            console.log('   - Check your username and password');
            console.log('   - Verify special characters are URL encoded');
        } else if (error.message.includes('ENOTFOUND')) {
            console.log('\n🚨 NETWORK ISSUE:');
            console.log('   - Check your internet connection');
            console.log('   - Verify the MongoDB cluster URL');
        }
        
        return false;
    }
};

// Run the check
checkMongoConnection()
    .then(success => {
        process.exit(success ? 0 : 1);
    })
    .catch(error => {
        console.error('💥 Unexpected error:', error);
        process.exit(1);
    });