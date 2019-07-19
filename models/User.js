const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Create schema

const UserSchema = new Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    date:{
        type: Date,
        default: Date.now
    },
    password:{
        type:String,
        required:true
    }
});

mongoose.model('users',UserSchema);