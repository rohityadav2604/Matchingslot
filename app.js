const express = require("express");
const mongoose = require("mongoose");
const slotBooking = require("./models/slotBooking.js");
const slotMatching = require("./models/slotMatching.js");
const app = express();
const user = {

}

app.get('/' , (req , res)=>{
    res.send("basic server");
})

app.post('/slotbook' , async(req , res)=>{
    //save object;
    try{
        const slotBook = new slotBooking();
        slotBook.BookingId = req.BookingId;
        slotBook.UserId = req.UserId;
        slotBook.Topic = req.Topic;
        slotBook.SlotDateTime = req.SlotDateTime;
        slotBook.LanguagePreffered = req.LanguagePreffered;
        await slotBook.save();
        res.send("succesfully added");

    }
    catch(err){
        console.log(err);
    }
   

})
mongoose.connect("mongodb+srv://Matching:admin@123@cluster0.jabnw.mongodb.net/Matching?retryWrites=true&w=majority")
.then(console.log("connected succesfully"))
.catch((err)=>{console.log(err)});
app.listen(3000);