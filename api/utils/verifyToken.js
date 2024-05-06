const jwt = require("jsonwebtoken");
const { errorHandler } = require("./error");

function verifyToken(req,res,next){
    if(req.headers.authorization !== undefined){
        // console.log("authorised");
        let token = req.headers.authorization.split(" ")[1];
        jwt.verify(token,process.env.KEY,(err,data)=>{
            if(err){
                console.log(err);
                console.log("Error forbidden");
                next(errorHandler("Forbidden",500));
            }
            // console.log(data);
                req.user = data;
                next();
        })
    }else{
        console.log("error in token");
        next(errorHandler("Unauthorised",401));
    }
}

module.exports = verifyToken;


