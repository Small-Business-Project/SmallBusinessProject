const mongoose = require('mongoose');
//sets up the schema for the user inputs expected
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
    },
    status: {
        type: String
    },
    appointments: [{ date: Date, time: Number }],
    
    isAdmin: {
        type: Boolean
    }
},
);

const User = mongoose.model('User',userSchema)
module.exports = User;