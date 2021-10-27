const express = require("express");
const mongoose = require("mongoose");
const slotBooking = require("./models/slotBooking.js");
const slotMatching = require("./models/slotMatching.js");
var bodyParser = require('body-parser')
const app = express();
const user = {

}

var jsonParser = bodyParser.json()
var urlencodedParser = bodyParser.urlencoded({ extended: false })

app.get('/' , urlencodedParser,(req , res)=>{
    res.send("basic server");
})

app.post('/slotbook' ,jsonParser, async(req , res)=>{
    //save object;
    try{
        // res.send("slotBook");
        const slotBook = new slotBooking();
        // console.log(req.body);
        slotBook.BookingId = req.body.BookingId;
        slotBook.UserId = req.body.UserId;
        slotBook.Topic = req.body.Topic;
        slotBook.SlotDateTime = req.body.SlotDateTime;
        slotBook.LanguagePreffered = req.body.LanguagePreffered;
        slotBook.Time = req.body.Time;
        await slotBook.save();
        res.send("succesfully added");

    }
    catch(err){
        console.log(err);
    }
   

})
mongoose.connect("mongodb+srv://salik:123@cluster0.mzkzr.mongodb.net/memories?retryWrites=true&w=majority")
.then(console.log("connected succesfully"))
.catch((err)=>{console.log(err)});
app.listen(3000);