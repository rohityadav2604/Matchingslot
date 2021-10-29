// let join  = document.querySelector("#join")
// var userid;
// join.addEventListener("click" , ()=>{
//    userid = document.querySelector("#joinuserid").value;
//    //document.querySelector("#loading").innerHTML = userid;
//     sendrequest(userid)
// })

//  function sendrequest(userid)
// {
    
//     // console.log(e);
//     console.log(userid)
//     axios.post("http://localhost:3000/join" , {UserId : userid}).then(async (res)=>{
//         window.location = res.data;
//    })


   

// }


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
  if(res.data == "matched")
  {
    window.location = `/video#${userid}`;
  } 
  else
  {
    // interval(userid);
  }
  
  
}
async function interval(userid)
{
   console.log("i am in interval");
  var int = setInterval(async ()=>{
    const res = await axios.post("http://localhost:3000/join"  , {UserId : userid});
    if(res.data == "matched")
    {
       window.location = `/video#${userid}`;
       clearInterval(int)
    } 
  }, 30000)
  
  
 
}




