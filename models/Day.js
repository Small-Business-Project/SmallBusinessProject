const mongoose = require('mongoose');

let DaySchema = new mongoose.Schema({
    date: Date,
    timeSlots: [{
        type: Number
    }]
});


DaySchema.statics.getDay = function(day) {
    let monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const temp = day.split("-");
    const month = monthNames.indexOf(temp[0]);
    return this.find({date : {$eq: new Date(2022, month, temp[1], 0, 0, 0, 0)}});
};
DaySchema.statics.listAllDays = function(){
    return this.find({});
}
let DayModel = mongoose.model('days', DaySchema);

module.exports = DayModel;