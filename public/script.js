

let userid;
let useridjoin = document.querySelector("#joinuserid");
if(useridjoin!=null)
{
    useridjoin.addEventListener("input", ()=>{
    
        userid = useridjoin.value;   
        sendrequest(userid);
  })
 

}

async function sendrequest(userid)
{ 
       
       setInterval(async () => {
           console.log("interval")
           await axios.post("http://localhost:3000/join" , {UserId : userid});
       }, 10000);
}