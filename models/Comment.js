const mongoose = require("mongoose");

const { Schema } = mongoose;

const CommentSchema = new Schema({ 
    user:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    },
    name:{
        type:String,
        required:true
    },
    comment:{
        type:String,
        required:true
    },
    
    likeArr:[mongoose.Schema.Types.ObjectId],

    DislikeArr:[mongoose.Schema.Types.ObjectId],

    ReplyArr:[Object],

});

const Comment = mongoose.model('Comments',CommentSchema )

module.exports = Comment