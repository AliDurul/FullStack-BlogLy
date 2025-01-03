"use strict"

import mongoose from "mongoose"

export const dbConnection = async () => {

    if (!process.env.MONGO_URI) {
        throw new Error("MONGO_URI is not defined in the environment variables");
    }

    mongoose.connect(process.env.MONGO_URI)
        .then(() => console.log("Connected to MongoDB"))
        .catch((err) => console.log("Error connecting to MongoDB", err));
}

export { mongoose }