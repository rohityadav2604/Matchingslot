module.exports = (function () {

    var retVal = {}
    var path = require("path");
    var slotService = require('../services/slotService');
    const config = require("../config.json");
    const { jwt: { AccessToken } } = require('twilio');

    const VideoGrant = AccessToken.VideoGrant;
    const MAX_ALLOWED_SESSION_DURATION = 14400;


    async function video(req, res) {
        try{
        // await slotService.expertSlotBookingGetAll(req , (slots)=>{
        //     for(let i =0;i<slots.length;i++)
        //     { 
        //        if(slots[i].isLive)
        //        {
                   res.sendFile(path.join(__dirname, '../views/twilioVideo/index.html'));
        //            return;
        //        }
        //     }
        //     res.redirect('/');
        // } , 
        //  (error)=>{ 
        //     console.log(error);
        //     res.redirect('/');});
    }catch(error){
        console.log(error);
    }
    }
    function getToken(req, res) {
        const { identity } = req.query;

        // Create an access token which we will sign and return to the client,
        // containing the grant we just created.
        const token = new AccessToken(
            config.TWILIO_ACCOUNT_SID,
            config.TWILIO_API_KEY,
            config.TWILIO_API_SECRET,
            { ttl: MAX_ALLOWED_SESSION_DURATION }
        );

        // Assign the generated identity to the token.
        token.identity = identity;

        // Grant the access token Twilio Video capabilities.
        const grant = new VideoGrant();
        token.addGrant(grant);

        // Serialize the token to a JWT string.
        res.send(token.toJwt());
    }

    retVal.video = video;
    retVal.getToken = getToken;

    return retVal;
})()