const mongoose = require('mongoose');
const { Schema } = mongoose;

const UserSchema = new Schema({ 
    name1:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    date:{
        type:String,
        default: Date.now
    },
});

const User = mongoose.model('users', UserSchema)

// User.createIndexes()

module.exports = User