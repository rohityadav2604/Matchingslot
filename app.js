const express = require("express");
const mongoose = require("mongoose");
const app = express();
const user = {

}

app.get('/' , (req , res)=>{
    res.send("basic server");
})

app.post('/slotbook' , (req , res)=>{
    //save object;
})
mongoose.connect("mongodb+srv://Matching:<admin@123>@cluster0.jabnw.mongodb.net/Matching?retryWrites=true&w=majority")
app.listen(3000);