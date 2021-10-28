let join  = document.querySelector("#join")
var userid;
join.addEventListener("click" , ()=>{
   userid = document.querySelector("#joinuserid").value;
   //document.querySelector("#loading").innerHTML = userid;
    sendrequest(userid)
})

 function sendrequest(userid)
{
    
    // console.log(e);
    console.log(userid)
    axios.post("http://localhost:3000/join" , {UserId : userid}).then(async (res)=>{
        window.location = res.data;
   })

}

function init()
{

   //let userid = document.querySelector("#loading").innerHTML;
    axios.post("http://localhost:3000/check" , {UserId : userid} ).then((res)=>{
        window.location = res.data;
     
    }) 
   
}

