const mongoose = require('mongoose')

const SnacksSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    ingredients: {
        type: Array,
        required: true
    },
    author: {
        ref: 'User',
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },

    how_to: {
        type: Array,
        required: true,
    }
})

module.exports = mongoose.model('Snacks', SnacksSchema) 