const mongoose = require('mongoose');

let DaySchema = new mongoose.Schema({
    date: Date,
    timeSlots: [Date]
});
let monthNames = ["", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

DaySchema.statics.getDay = function(day) {
    const temp = day.split("-");
    const month = monthNames.indexOf(temp[0]);
    return this.find({date : {$eq: new Date(2021, month, temp[1])}});
};

let DayModel = mongoose.model('days', DaySchema);

module.exports = DayModel;