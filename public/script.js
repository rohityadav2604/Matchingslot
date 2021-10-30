
                var socket = new WebSocket("ws://localhost:3000");
                socket.onopen = function(event) {
                console.log("Connection established");
                // console.log(data);
            }
            socket.onmessage = function(e){
                console.log("msg");
                console.log(e.data);
            var server_message = e.data;
            console.log(typeof(server_message))
            let jsonMsg = JSON.parse(server_message)
            console.log(jsonMsg);
            let uid = document.querySelector("#useridjoin").value;
            
            // console.log(uid);

            if(jsonMsg.p1 == uid){
            window.location = '/video#'+jsonMsg.p1;
            }
            
            if(jsonMsg.p2 == uid){
            window.location = '/video#'+jsonMsg.p2;
            }
        
        }
            

let join = document.querySelector("#join");
join.addEventListener("click" , makesearch);
async function makesearch()
{ 

  console.log("makesearch");
  let div = document.createElement('div');
  div.innerHTML = "loading....";
  document.body.appendChild(div);
  let userid = document.querySelector("#useridjoin").value;
  console.log(userid);
  const res = await axios.post("http://localhost:3000/join"  , {UserId : userid});
  // if(res.data == "matched")
  // {
  //   window.location = `/video#${userid}`;
  // } 
  // else
  // {
  //   // interval(userid);
  // }
  
  
}
async function interval(userid)
{
   console.log("i am in interval");
  var int = setInterval(async ()=>{
    const res = await axios.post("http://localhost:3000/join"  , {UserId : userid});
    // if(res.data == "matched")
    // {
    //    window.location = `/video#${userid}`;
    //    clearInterval(int)
    // } 
  }, 30000)
  
  
 
}




