const express = require("express");
const mongoose = require("mongoose");
const slotBooking = require("./models/slotBooking.js");
const slotMatching = require("./models/slotMatching.js");
const socketIO = require('socket.io');
const http = require('http')
const jwt = require('jsonwebtoken');
const cors = require("cors");
const { Console } = require("console");

const app = express();
app.use(express.static(__dirname+"/public"));
const twilioVideoController = require("./controller/twilioVideoController")
let server = http.createServer(app)
let io = socketIO(server)
const map = new Map();
var roomId ;
var today = new Date();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded());



app.get(`/video` , (req , res)=>{
    console.log("hello video");
    res.sendFile(__dirname + '/public/twilioindex.html');
})

app.get('/video/token' , twilioVideoController.getToken);





app.post('/slotbook' , async(req , res)=>{
    //save object;
    try{
        
        // res.send("slotBook");
        
        
        
        const slotBook = new slotBooking();
        // console.log(req.body);
        const email = req.body.email;
        const token = jwt.sign(
            {user_id : req.body.UserId,email},
            "testKey123",
            {
                expiresIn : "2h",
            }
        )
       // console.log(token);
        slotBook.BookingId = req.body.BookingId;
        slotBook.UserId = req.body.UserId;
        slotBook.Topic = req.body.Topic;
        slotBook.SlotDateTime = req.body.SlotDateTime;
        slotBook.LanguagePreffered = req.body.LanguagePreffered;
        slotBook.Time = req.body.Time;
        slotBook.jwtToken = token;
        await slotBook.save();
        
        res.send("succesfully added");

    }
    catch(err){
        console.log(err);
    }
   

})


async function matching(slotMatch){
        
    const matched = await slotMatching.find({Time : slotMatch.Time,Topic : slotMatch.Topic,LanguagePreffered : slotMatch.LanguagePreffered});
    
    let f =0;  
    for(let i = 0;i<matched.length ;i++){
        
    
        if(matched[i].UserId != slotMatch.UserId && matched[i].Status  == "queued")
        {   
            f = 1;
            console.log("matched");
            await slotMatching.findByIdAndUpdate({_id : matched[i]._id},{Status : "matched",AllotedRoomId : 12});
            await slotMatching.findByIdAndUpdate({_id : slotMatch._id},{Status : "matched",AllotedRoomId : 12});
            
            return 1;
        }
    }
    return -1;
}
function check(req ,res  ,userid)
{
    var set = setInterval(async()=>{
   
        console.log("heloo");
        const isExist = await slotMatching.find({UserId : userid});
        if(isExist.length>0)
        {
            if(isExist[0].Status == "matched")
            {
                var string = encodeURIComponent(userid);
                res.redirect(`/video#` + string);
                clearInterval(set);
            }
        }
    
       } , 120000)
    
}

async function check2(req , res)
{

    const isExist = await slotMatching.find({UserId : userid});
    if(isExist.length>0)
    {
        if(isExist[0].Status == "matched")
        {
            var string = encodeURIComponent(userid);
            res.redirect(`/video#` + string);
            clearInterval(set);
        }
    }
}

 
app.post("/join",async (req,res) => {
    try {
        // console.log(req)
    const userId = req.body.UserId;
    console.log(userId);
    
    const isExist = await slotMatching.find({UserId : userId});
    let slotMatch;
    if(isExist.length == 0)
    {
        const slotBook = await  slotBooking.find({UserId : userId});
        slotMatch = new slotMatching();
        slotMatch.Status = "queued";
        slotMatch.Time = slotBook[0].Time;
        slotMatch.Topic = slotBook[0].Topic;
        slotMatch.LanguagePreffered = slotBook[0].LanguagePreffered;
        slotMatch.AllotedRoomId = -1;
        slotMatch.UserId = userId;
        slotMatch.jwtToken = slotBook[0].jwtToken;
        io.on('connection', (socket)=>{
            console.log('New user connected');
            // socket.emit("matched","test");
            map.set(userId,socket.id);
            console.log(map.get(userId));
          });
        await slotMatch.save();
    }
    else {
            console.log("matched");
            slotMatch = isExist[0];
            if(isExist[0].Status  == "matched")
            {
                // io.to(isExist[0].AllotedRoomId).emit("matched",isExist[0].AllotedRoomId);
            //     var string = encodeURIComponent(userId);
            //    // res.redirect(`/video#` + string);
            //    res.redirect('/video');
               //res.("http://127.0.0.1:5500/public/room.html");
               res.send("matched");
                
            }
    }
   // console.log(slotMatch);
    const result =  await matching(slotMatch);
    if(result == 1)
    {
        res.send("matched");
    }
    else
    {
        res.send("notmatched");
    }
    
  //  check( req , res ,userId);
   
    ///res.redirect("http://127.0.0.1:5500/public/loading.html");
    
    
   
    // res.send("successfully added to matching");
    }
    catch(err) {
        console.log(err);
    }
})
//mongoose.connect("mongodb+srv://salik:123@cluster0.mzkzr.mongodb.net/memories?retryWrites=true&w=majority")
mongoose.connect("mongodb+srv://salik:123@cluster0.mzkzr.mongodb.net/memories?retryWrites=true&w=majority")
.then(console.log("connected succesfully"))
.catch((err)=>{console.log(err)});
server.listen(3000);