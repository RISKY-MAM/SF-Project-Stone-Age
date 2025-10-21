import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";
import userModel from "../models/userModel.js";
import mongoose from "mongoose";

// Dummy user for testing when DB is not connected
const dummyUser = {
    _id: "dummy_user_123",
    name: "Test",
    email: "test@gmail.com",
    password: "Test", // Plain text for dummy user
    cartData: {}
};

//create token
const createToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET);
}

//login user
const loginUser = async (req,res) => {
    const {email, password} = req.body;
    try{
        // Check if database is connected
        if (mongoose.connection.readyState !== 1) {
            console.log('⚠️  DB not connected - Using dummy user authentication');
            
            // Check dummy user credentials
            if (email === dummyUser.email && password === dummyUser.password) {
                const token = createToken(dummyUser._id);
                return res.json({success:true, token, isDummy: true});
            } else {
                return res.json({success:false, message: "Invalid credentials (DB not connected - use test@gmail.com / Test)"});
            }
        }

        const user = await userModel.findOne({email})

        if(!user){
            return res.json({success:false,message: "User does not exist"})
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if(!isMatch){
            return res.json({success:false,message: "Invalid credentials"})
        }

        const token = createToken(user._id)
        res.json({success:true,token})
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error - Using dummy user: test@gmail.com / Test"})
    }
}

//register user
const registerUser = async (req,res) => {
    const {name, email, password} = req.body;
    try{
        // Check if database is connected
        if (mongoose.connection.readyState !== 1) {
            console.log('⚠️  DB not connected - Cannot register new users');
            return res.json({
                success: false, 
                message: "Registration not available when database is disconnected. Use test account: test@gmail.com / Test"
            });
        }

        //check if user already exists
        const exists = await userModel.findOne({email})
        if(exists){
            return res.json({success:false,message: "User already exists"})
        }

        // validating email format & strong password
        if(!validator.isEmail(email)){
            return res.json({success:false,message: "Please enter a valid email"})
        }
        if(password.length<8){
            return res.json({success:false,message: "Please enter a strong password"})
        }

        // hashing user password
        const salt = await bcrypt.genSalt(10); // the more no. round the more time it will take
        const hashedPassword = await bcrypt.hash(password, salt)

        const newUser = new userModel({name, email, password: hashedPassword})
        const user = await newUser.save()
        const token = createToken(user._id)
        res.json({success:true,token})

    } catch(error){
        console.log(error);
        res.json({success:false,message:"Registration error - Use test account: test@gmail.com / Test"})
    }
}

export {loginUser, registerUser}