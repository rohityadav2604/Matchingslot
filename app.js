const express = require("express");
const mongoose = require("mongoose");
const slotBooking = require("./models/slotBooking.js");
const slotMatching = require("./models/slotMatching.js");
const socketIO = require('socket.io');
const http = require('http')

const app = express();
app.use(express.static(__dirname+"/public"));

let server = http.createServer(app)
let io = socketIO(server)
var roomId ;
var today = new Date();

app.use(express.json());
app.use(express.urlencoded());


app.get('/'  ,(req , res)=>{
    res.send("basic server");
})

app.post('/slotbook' , async(req , res)=>{
    //save object;
    try{
        
        // res.send("slotBook");
        console.log("hello i am form data");
        console.log(req);
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


async function matching(slotMatch){
        
    const matched = await slotMatching.find({Time : slotMatch.Time,Topic : slotMatch.Topic,LanguagePreffered : slotMatch.LanguagePreffered});
    console.log(matched);
    let f =0;

  

    for(let i = 0;i<matched.length ;i++){
        
    
        if(matched[i].UserId != slotMatch.UserId && matched[i].Status  == "queued")
        {   
            f = 1;
            console.log("matched");
            await slotMatching.findByIdAndUpdate({_id : matched[i]._id},{Status : "matched",AllotedRoomId : 12});
            await slotMatching.findByIdAndUpdate({_id : slotMatch._id},{Status : "matched",AllotedRoomId : 12});
            io.on('connection', (socket)=>{
                console.log('New user connected');
                // socket.emit("matched","test");
                roomId = 12
                socket.join(roomId);
                
            
                console.log(socket.id)
                 
              });
            return matched[i];
        }
    }

    if(f==0)
    {   
        
        return -1;
    }
    // res.send("there are no matches found");

}

app.post("/join",async (req,res) => {
    try {
        // console.log(req)
    const userId = req.body.UserId;
    console.log(userId);
    
    const isExist = await slotMatching.find({UserId : userId});

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
        await slotMatch.save();
    }
    
    else {
   
            if(isExist[0].Status  == "matched" && today.getHours() - isExist[0].Time < 1)
            {
                io.to(roomId).emit("matched",result.AllotedRoomId);
               // res.sendFile(__dirname+"/public/room.html");
                return;
            }
    }
   

    const result =    await matching(slotMatch);
    // res.send(slotMatch);
    if(result != -1)
    {   
        io.to(roomId).emit("matched",result.AllotedRoomId);
        res.sendFile(__dirname+"/public/room.html");
        // res.send("you are macthed with "+ result.UserId);
    }
    else{
        io.to(roomId).emit("unmatched","test3");
        res.sendFile(__dirname+"/public/loading.html");
    //    res.send("No match found");
    }

    
    

    
    // res.send("successfully added to matching");
    }
    catch(err) {
        console.log(err);
    }
})
mongoose.connect("mongodb+srv://salik:123@cluster0.mzkzr.mongodb.net/memories?retryWrites=true&w=majority")
.then(console.log("connected succesfully"))
.catch((err)=>{console.log(err)});
server.listen(3000);