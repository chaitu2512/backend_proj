import dotenv from 'dotenv';
import connectDB from "./db/index.js";
import app from "./app.js";
// import app from "./app.js";

// dotenv.config({
//     path: './.env'
// })

connectDB()
.then(() => {
    app.listen(process.env.PORT || 8000 , () => {
        console.log(`Server running on port ${process.env.PORT}`);
    })
})
.catch((err)=>{
    console.error(`Error connecting to MongoDB: ${err.message}`);
})
















/*
import express from "express";
const app = express()

;(async () => {
    try {
        await mongoose.connect('${process.env.MONGODB_URI/${DB_NAME}')
        app.on("error", (err) =>{
            console.log("ERROR : " + err.message);
            throw err;
        })
        app.listen(process.env.PORT,()=>{
            console.log("App is listening on port " + process.env.PORT)
        })
    } catch (error) {
        console.error("Error: ",error);
    }
})()
*/