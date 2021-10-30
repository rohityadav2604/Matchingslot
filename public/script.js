

var socket = new WebSocket("ws://localhost:3000");
socket.onopen = async function (event) {
  console.log("Connection established");
  
  //   let userid = document.querySelector("#useridjoin").value;
  //  const res =  await axios.get('/check' , {
  //     params:{
  //       UserId :3
  
  //     }
  //   })
  //   if(res.data.status == "matched")
  //   {
  //         window.location = '/video#'+1;
  //   }
  
   

  
  
  
  
  
};
socket.onmessage = function (e) {
  console.log("msg");
  console.log(e.data);
  var server_message = e.data;
  console.log(typeof server_message);
  let jsonMsg = JSON.parse(server_message);
  console.log(jsonMsg);
  let uid = document.querySelector("#useridjoin").value;

  

  if (jsonMsg.p1 == uid) {
    window.location = "/video#" + jsonMsg.p1 +"@" + jsonMsg.roomid ;
  }

  if (jsonMsg.p2 == uid) {
    window.location = "/video#" + jsonMsg.p2 +"@" + jsonMsg.roomid;
  }
};

socket.onclose = function(e){
  console.log("disconnected");
}

let join = document.querySelector("#join");
join.addEventListener("click", makesearch);
async function makesearch() {
  console.log("makesearch");
  let div = document.createElement("div");
  div.innerHTML = "loading....";
  div.id = 'loading';
  document.body.appendChild(div);
  let userid = document.querySelector("#useridjoin").value;
  console.log(userid);
  const res = await axios.post("http://localhost:3000/join", {
    UserId: userid,
  });
  if(res.data.status == "matched")
  {
    window.location = "/video#" + userid + "@" + res.data.roomid;
  }
  
}

