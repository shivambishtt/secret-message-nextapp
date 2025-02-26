import mongoose from "mongoose"

type ConnectionObject = {
    isConnected?: number
}

const connection: ConnectionObject = {}


const connectDB = async (): Promise<void> => {
    if (connection.isConnected) {
        console.log("Already connected to the database")
        return
    }
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}` || "")
        connection.isConnected = connectionInstance.connection.readyState

        console.log("MONGO DB connected successfully");

    } catch (error) {
        console.log("Mongo DB connection error", error);
        process.exit(1)
    }
}
export default connectDB