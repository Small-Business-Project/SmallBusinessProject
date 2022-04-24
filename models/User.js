const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
    },
    pasword: {
        type: String,
        required: true,
    },
    appointments: {
        day : {type: Date},
        time: {type: Number}
    }
});

const User = mongoose.model('User',userSchema)
module.exports = User;