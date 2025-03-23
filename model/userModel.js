const mongoose = require("mongoose");

const user = mongoose.Schema({
    name:{
        type:String,
        required: true
    },
    email:{
        type:String,
        required:true,
        unique: true
    },
    password:{
        type:String,
        required:true
    },
    role:{
        type:String,
        enum: ['admin', 'user'], default: 'user',
        required:true,
    }
    // image:{
    //     type:String,
    //     required:true
    // },

    // name: String,
    // email: { type: String, unique: true },
    // password: String,
    // role: { type: String, enum: ['admin', 'user'], default: 'user' }

},{timestamps:true});


module.exports = mongoose.model("User", user);