const express=require("express");
const URL=require("../models/url");

const router=express.Router();

router.get("/",async (req,resp)=>{
    if(!req.user) return resp.redirect("/login");
    const allurls = await URL.find({createdBy:req.user._id});

    return resp.render("home",{
        urls:allurls,
    });
});

router.get("/signup",async (req,resp)=>
{
    return resp.render("signup");
})

router.get("/login",async (req,resp)=>
{
    return resp.render("login");
})

module.exports=router;