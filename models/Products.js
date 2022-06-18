const { type } = require('@testing-library/user-event/dist/type');
const mongoose = require('mongoose')

const { Schema } = mongoose;

const ProductSchema = new Schema({
    prod_name: {
        type: String
    },
    desc: {
        type: String
    },
    category: {
        type: String
    },
    slug: {
        type: String
    },
    size: {
        type: String
    },  
    avail_Qty: {
        type: Number
    },
    color: {
        type: String
    }


})

module.exports = mongoose.model('Products', ProductSchema)