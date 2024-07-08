// const sessionIdToUserMap=new Map();
const secret="Piyush$123@$"
const jwt=require("jsonwebtoken");

function setUser(user){
    // sessionIdToUserMap.set(id,user);
    return jwt.sign({
        _id:user._id,
        email:user.email
    },secret);
}

function getUser(token){
    // return sessionIdToUserMap.get(id);
    if(!token) return null;
    try{
        return jwt.verify(token,secret);
    }
    catch(err){
        return null;
    }
}

module.exports={
    setUser,
    getUser,
}