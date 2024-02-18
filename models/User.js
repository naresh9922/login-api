import mongoose from "mongoose";

// define schema
const userSchema = new mongoose.Schema({
    name:{type:String, required:true, trim:true},
    email:{type:String, required:true, trim:true},
    password:{type:String, required:true, trim:true}
})

// model

const UserModel = mongoose.model("user",userSchema)

export default UserModel