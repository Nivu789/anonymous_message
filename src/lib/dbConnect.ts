import mongoose from "mongoose"

type Connection = {
    isConnected?:number
}

const connection:Connection = {}

export default async function dbConnect(){
    if(connection.isConnected){
        console.log("Databse already connected")
        return
    }

    try {
        const db = await mongoose.connect(process.env.MONGO_URI||"")
        if(db){
            connection.isConnected = db.connections[0].readyState
            console.log("Database Connected")
        }
    } catch (error) {
        console.log("Database connection failed")
    }
}