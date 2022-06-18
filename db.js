const mongoose = require('mongoose')

require('dotenv').config()

// console.log(process.env.mongoURI);
const connectToMongo = () =>{
        mongoose.connect(process.env.mongoURI, () =>{
            console.log("Connected to mongo Successfully")
        })
}

module.exports = connectToMongo;

