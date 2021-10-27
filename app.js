const express = require("express");
const app = express();


app.get('/' , (req , res)=>{
    res.send("basic server");
})
app.listen(3000);