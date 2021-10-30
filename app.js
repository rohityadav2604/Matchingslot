const express = require("express");
const mongoose = require("mongoose");
const slotBooking = require("./models/slotBooking.js");
const slotMatching = require("./models/slotMatching.js");

const jwt = require('jsonwebtoken');
const cors = require("cors");
const SocketServer = require('ws').Server;

const app = express();
app.use(express.static(__dirname+"/public"));
const twilioVideoController = require("./controller/twilioVideoController")


app.use(cors());
app.use(express.json());
app.use(express.urlencoded());
// mongoose.connect("mongodb+srv://rohit:123@cluster0.jabnw.mongodb.net/myFirstDatabase?retryWrites=true&w=majority")
mongoose.connect("mongodb+srv://salik:123@cluster0.mzkzr.mongodb.net/memories?retryWrites=true&w=majority")

.then(console.log("connected succesfully"))
.catch((err)=>{console.log(err)});
let server = app.listen(3000,()=>{console.log("server started")});
const wss = new SocketServer({ server });

wss.on('connection', (ws) => {
    console.log("user connected ");
    ws.on('close' , ()=>{
        console.log("userdisconnected");
    })
   
})


app.get(`/video` , (req , res)=>{
    console.log("hello video");
    res.sendFile(__dirname + '/public/twilioindex.html');
})

app.get('/video/token' , twilioVideoController.getToken);

let c =0;
app.get('/check'  , async(req , res)=>{
    console.log('/check' + c++);
    // console.log(req.query);
    // console.log(req.body);
    const userid = req.query.UserId;
    console.log(userid);
    const isExist = await slotMatching.find({UserId : userid});
    if(isExist.length>0)
    {
        if(isExist[0].Status == "matched")
        {
            res.send("matched");
            
        }
    }
})


app.post('/slotbook' , async(req , res)=>{
    
    try{
        
        const slotBook = new slotBooking();
      
        const email = req.body.email;
        const token = jwt.sign(
            {user_id : req.body.UserId,email},
            "testKey123",
            {
                expiresIn : "2h",
            }
        )
       
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

        wss.clients.forEach(client => client.send(JSON.stringify({p1:slotMatch.UserId ,p2 : matched[i].UserId })));

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


let c2 =0;
 
app.post("/join",async (req,res) => {
    
    console.log("join" +c2++)
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
        
        await slotMatch.save();
    }
    else {
            slotMatch = isExist[0];
            
           

            if(isExist[0].Status  == "matched")
            {
            
               res.send("matched");
                
            }
    }
    const result =  await matching(slotMatch);
    if(result == 1)
    {
        res.send("matched");
    }
    else
    {
        res.send("notmatched");
    }
    

    }
    catch(err) {
        console.log(err);
    }
})

