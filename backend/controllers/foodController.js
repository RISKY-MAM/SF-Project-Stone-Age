import foodModel from "../models/foodModel.js";
import fs from 'fs'

// Dummy food data for when DB is not connected
const dummyFoodData = [
    {
        _id: "dummy1",
        name: "Greek Salad",
        description: "Fresh vegetables with feta cheese and olive oil",
        price: 1200,
        image: "food_1.png",
        category: "Salad"
    },
    {
        _id: "dummy2",
        name: "Veg Salad",
        description: "Healthy mix of fresh vegetables",
        price: 1800,
        image: "food_2.png",
        category: "Salad"
    },
    {
        _id: "dummy3",
        name: "Chicken Rolls",
        description: "Delicious chicken wrapped in soft bread",
        price: 2000,
        image: "food_7.png",
        category: "Rolls"
    },
    {
        _id: "dummy4",
        name: "Veg Rolls",
        description: "Crispy vegetable rolls",
        price: 1500,
        image: "food_8.png",
        category: "Rolls"
    },
    {
        _id: "dummy5",
        name: "Vanilla Ice Cream",
        description: "Creamy vanilla ice cream",
        price: 1200,
        image: "food_12.png",
        category: "Deserts"
    },
    {
        _id: "dummy6",
        name: "Chicken Sandwich",
        description: "Grilled chicken sandwich with fresh veggies",
        price: 1200,
        image: "food_13.png",
        category: "Sandwich"
    },
    {
        _id: "dummy7",
        name: "Cup Cake",
        description: "Sweet and fluffy cupcake",
        price: 1400,
        image: "food_17.png",
        category: "Cake"
    },
    {
        _id: "dummy8",
        name: "Cheese Pasta",
        description: "Creamy cheese pasta",
        price: 1200,
        image: "food_25.png",
        category: "Pasta"
    },
    {
        _id: "dummy9",
        name: "Chicken Pasta",
        description: "Pasta with grilled chicken",
        price: 2400,
        image: "food_28.png",
        category: "Pasta"
    },
    {
        _id: "dummy10",
        name: "Veg Noodles",
        description: "Stir-fried vegetable noodles",
        price: 1200,
        image: "food_30.png",
        category: "Noodles"
    }
];

// all food list
const listFood = async (req, res) => {
    try {
        // Check if database is connected
        const mongoose = (await import('mongoose')).default;
        if (mongoose.connection.readyState !== 1) {
            console.log('⚠️  DB not connected - Returning dummy data');
            return res.json({ success: true, data: dummyFoodData, isDummy: true });
        }
        
        const foods = await foodModel.find({})
        res.json({ success: true, data: foods, isDummy: false })
    } catch (error) {
        console.log('❌ Error fetching foods, returning dummy data:', error.message);
        res.json({ success: true, data: dummyFoodData, isDummy: true })
    }

}

// add food
const addFood = async (req, res) => {

    try {
        let image_filename = `${req.file.filename}`

        const food = new foodModel({
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            category:req.body.category,
            image: image_filename,
        })

        await food.save();
        res.json({ success: true, message: "Food Added" })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" })
    }
}

// delete food
const removeFood = async (req, res) => {
    try {

        const food = await foodModel.findById(req.body.id);
        fs.unlink(`uploads/${food.image}`, () => { })

        await foodModel.findByIdAndDelete(req.body.id)
        res.json({ success: true, message: "Food Removed" })

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" })
    }

}

export { listFood, addFood, removeFood }