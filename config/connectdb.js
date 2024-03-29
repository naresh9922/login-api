import mongoose from "mongoose";

const connectDB  = async(DATABASE_URL)=>{
    try {
        const DB_OPTION = {
            dbName: "Startup_funding"
        }
        await mongoose.connect(DATABASE_URL, DB_OPTION)
        console.log('connected successfully ..')
    } catch (error) {
        console.log(error)
    }
}

export default connectDB;