const mongoose = require('mongoose')

const BreakFastSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    author: {
        ref: 'User',
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },

    ingredients: {  // Fixed spelling
        type: Array,
        required: true
    },
    how_to: {  // Consider using snake_case for consistency
        type: Array,
        required: true,
    }
})

module.exports = mongoose.model('BreakFast', BreakFastSchema) 