import express  from "express"
import cors from 'cors'
import { connectDB } from "./config/db.js"
import userRouter from "./routes/userRoute.js"
import foodRouter from "./routes/foodRoute.js"
import 'dotenv/config'
import cartRouter from "./routes/cartRoute.js"
import orderRouter from "./routes/orderRoute.js"

// app config
const app = express()
const port = process.env.PORT || 3001; // Using port 3001 to avoid conflicts

// Track DB connection status
export let isDBConnected = false;

// middlewares
app.use(express.json())
app.use(cors())

// db connection - handle async connection
connectDB()
  .then((connection) => {
    if (connection) {
      isDBConnected = true;
      console.log('🎯 Database connection established successfully');
    } else {
      isDBConnected = false;
      console.log('⚠️  Server running without database connection - Using dummy data');
    }
  })
  .catch((error) => {
    isDBConnected = false;
    console.error('🔥 Database connection failed, using dummy data:', error.message);
  });

// api endpoints
app.use("/api/user", userRouter)
app.use("/api/food", foodRouter)
app.use("/images",express.static('uploads'))
app.use("/api/cart", cartRouter)
app.use("/api/order",orderRouter)

app.get("/", (req, res) => {
    res.send("API Working")
  });

app.listen(port, () => console.log(`Server started on http://localhost:${port}`))