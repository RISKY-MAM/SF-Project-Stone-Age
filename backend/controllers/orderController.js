import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js"
import Stripe from "stripe";
import mongoose from "mongoose";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Dummy order storage for when DB is not connected
let dummyOrders = [];
let dummyOrderCounter = 1000;

//config variables
const currency = "lkr";
const deliveryCharge = 500;
const frontend_URL = 'http://localhost:5173';

// Placing User Order for Frontend using stripe
const placeOrder = async (req, res) => {

    try {
        // Check if database is connected
        if (mongoose.connection.readyState !== 1) {
            console.log('⚠️  DB not connected - Stripe payment not available in demo mode');
            return res.json({ success: false, message: "Online payment not available when database is disconnected. Please use Cash on Delivery." });
        }

        const newOrder = new orderModel({
            userId: req.body.userId,
            items: req.body.items,
            amount: req.body.amount,
            address: req.body.address,
        })
        await newOrder.save();
        await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });

        const line_items = req.body.items.map((item) => ({
            price_data: {
                currency: currency,
                product_data: {
                    name: item.name
                },
                unit_amount: item.price * 100 
            },
            quantity: item.quantity
        }))

        line_items.push({
            price_data: {
                currency: currency,
                product_data: {
                    name: "Delivery Charge"
                },
                unit_amount: deliveryCharge * 100
            },
            quantity: 1
        })

        const session = await stripe.checkout.sessions.create({
            success_url: `${frontend_URL}/verify?success=true&orderId=${newOrder._id}`,
            cancel_url: `${frontend_URL}/verify?success=false&orderId=${newOrder._id}`,
            line_items: line_items,
            mode: 'payment',
        });

        res.json({ success: true, session_url: session.url });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" })
    }
}

// Placing User Order for Frontend using COD
const placeOrderCod = async (req, res) => {

    try {
        // Check if database is connected
        if (mongoose.connection.readyState !== 1) {
            console.log('⚠️  DB not connected - Creating dummy order');
            
            const dummyOrder = {
                _id: `dummy_order_${dummyOrderCounter++}`,
                userId: req.body.userId,
                items: req.body.items,
                amount: req.body.amount,
                address: req.body.address,
                status: "Food Processing",
                date: new Date(),
                payment: true
            };
            dummyOrders.push(dummyOrder);
            
            return res.json({ success: true, message: "Thank you for your order! Our team will contact you soon. For any inquiry, contact: 01109876788 (Demo Mode)" });
        }

        const newOrder = new orderModel({
            userId: req.body.userId,
            items: req.body.items,
            amount: req.body.amount,
            address: req.body.address,
            payment: true,
        })
        await newOrder.save();
        await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });

        res.json({ success: true, message: "Thank you for your order! Our team will contact you soon. For any inquiry, contact: 01109876788" });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" })
    }
}

// Listing Order for Admin panel
const listOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({});
        res.json({ success: true, data: orders })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" })
    }
}

// User Orders for Frontend
const userOrders = async (req, res) => {
    try {
        // Check if database is connected
        if (mongoose.connection.readyState !== 1) {
            console.log('⚠️  DB not connected - Returning dummy orders');
            const userDummyOrders = dummyOrders.filter(order => order.userId === req.body.userId);
            return res.json({ success: true, data: userDummyOrders });
        }

        const orders = await orderModel.find({ userId: req.body.userId });
        res.json({ success: true, data: orders })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" })
    }
}

const updateStatus = async (req, res) => {
    console.log(req.body);
    try {
        await orderModel.findByIdAndUpdate(req.body.orderId, { status: req.body.status });
        res.json({ success: true, message: "Status Updated" })
    } catch (error) {
        res.json({ success: false, message: "Error" })
    }

}

const verifyOrder = async (req, res) => {
    const { orderId, success } = req.body;
    try {
        if (success === "true") {
            await orderModel.findByIdAndUpdate(orderId, { payment: true });
            res.json({ success: true, message: "Thank you for your order! Our team will contact you soon. For any inquiry, contact: 01109876788" })
        }
        else {
            await orderModel.findByIdAndDelete(orderId)
            res.json({ success: false, message: "Not Paid" })
        }
    } catch (error) {
        res.json({ success: false, message: "Not  Verified" })
    }

}

export { placeOrder, listOrders, userOrders, updateStatus, verifyOrder, placeOrderCod }