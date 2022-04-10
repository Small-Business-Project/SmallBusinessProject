const mongoose = require('mongoose');

let appointmentSchema = new mongoose.Schema({
    date: Date,
    //user: User,
    available: Boolean
});

appointmentSchema.statics.listAllAppointments = function() {
    return this.find({});
};

/*
userSchema.statics.listAllUsers = function() {
    return this.find({});
};
userSchema.statics.listAgeGT = function(num) {
    return this.find({age : {$gt: num} })
};
userSchema.statics.listAgeLT = function(num) {
    return this.find({age : {$lt: num} })
};
userSchema.statics.listAgeET = function(num) {
    return this.find({age : {$eq: num} })
};
*/

let appointmentModel = mongoose.model('users', appointmentSchema);

module.exports = appointmentModel;