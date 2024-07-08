const express=require("express");
const path=require("path");
const cookieParser=require("cookie-parser");

const app=express();

const {connectToMongoDb}=require("./connect");
const urlRoute=require("./routes/url");
const staticRouter=require("./routes/staticRouter");
const userRoute=require("./routes/user");
const URL=require("./models/url");
const {strictToLoggedinUserOnly,checkAuth}=require("./middlewares/auth");

app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(cookieParser());

app.use("/url",strictToLoggedinUserOnly,urlRoute);
app.use("/user",userRoute);
app.use("/",checkAuth,staticRouter);

connectToMongoDb("mongodb://127.0.0.1:27017/short-url").then(()=>{console.log("mongoDb connected")});

app.set('view engine','ejs');
app.set('views',path.resolve("./views"));

app.get("/test",async(req, res)=>{
    const allurls = await URL.find({});
    return res.render("home", {
        urls: allurls,
    });
    
    // return res.end(`
    // <html>
    // <head></head>
    // <body>
    // <ol>
    //     ${allUrls.map(url => `<li>${url.shortId} - ${url.redirectURL} - ${url.visitHistory.length}</li>`).join('')}
    // </ol>
    // </body>
    // </html>
    
    // `);
});

app.get("/url/:shortId", async(req, res)=>{
    const shortId = req.params.shortId;
    const entry = await URL.findOneAndUpdate(
    {
        shortId,
    },
    {
        $push:{
            visitHistory:{
                timestamp: Date.now(),    
            } 
        },
    }
    );
    res.redirect(entry.redirectURL);
});

app.listen(8000,()=>{console.log("server started")});