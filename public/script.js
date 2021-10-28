let join2 = document.querySelector("#join2");
let join = document.querySelector("#join");

let userId;
if(join2!= null)
{
join2.addEventListener('submit' , (e)=>{
    console.log("el2")
    userid = document.querySelector("#userid").value;
    console.log(userid);
    


})
}
if(join!=null)
{
join.addEventListener('submit',(e) => {
    console.log("el1")
    sendrequest(userid);
})
}
async function sendrequest(userid)
{
       setInterval(async () => {
           console.log("interval")
           await axios.post("http://localhost:3000/join" , {UserId : userid});
       }, 30000);
}