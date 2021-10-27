const mongoose = require("mongoose");

const slotBookingSchema = mongoose.Schema({
    BookingId : Number,
    UserId : Number,
    Topic : String,
    SlotDateTime : String,
    LanguagePreffered : String
    ,
    createdAt : {
        type : Date,
        default : new Date()
    },
});


const SlotBooking = mongoose.model('SlotBooking',slotBookingSchema);

module.exports = SlotBooking;