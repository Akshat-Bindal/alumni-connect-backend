import mongoose from "mongoose";

const connectDB=async()=>{
    try {
        const conn =await mongoose.connect(process.env.Mongo_URI)
        console.log(`MongoDB connected: ${conn.connection.host}`)
    }
    catch(err){
    console.error('Error in DB connect:', err);
    throw err
    }
}

export default connectDB