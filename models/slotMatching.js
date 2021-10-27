import mongoose from 'mongoose';

const slotMatchingSchema = mongoose.Schema({
    BookingId : Number,
    Status : String,
    Time : Number,
    Topic : String,
    LanguagePreffered : String,
    AllotedRoomId : Number
    ,
    createdAt : {
        type : Date,
        default : new Date()
    },
});


const SlotMatching = mongoose.model('SlotMatching',slotMatchingSchema);

export default SlotMatching;