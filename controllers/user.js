const User=require("../models/user");
const {v4:uuidv4}=require("uuid");
const { setUser }=require("../service/auth");

async function handleUserSignUp(req,resp){
    const {name,email,password}=req.body;
    await User.create({
        name,
        email,
        password,
    });
    return resp.redirect("/");
}

async function handleUserLogin(req,resp){
    const {email,password}=req.body;
    const user=await User.findOne({
        email,
        password,
    });
    if(!user){
        return resp.render("login",{
            err:"invalid username or password",
        })
    }
    const token=setUser(user);
    resp.cookie("uid",token);
    return resp.redirect("/");
}

module.exports={
    handleUserSignUp,
    handleUserLogin
}