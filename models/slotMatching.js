const mongoose = require("mongoose");

const slotMatchingSchema = mongoose.Schema({
    Status : String,
    Time : Number,
    Topic : String,
    LanguagePreffered : String,
    AllotedRoomId : Number,
    UserId : Number
    ,
  
    jwtToken : String,
    createdAt : {
        type : Date,
        default : new Date()
    },
});


const SlotMatching = mongoose.model('SlotMatching',slotMatchingSchema);

module.exports= SlotMatching;