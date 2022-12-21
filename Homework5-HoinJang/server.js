
const express = require("express");
const session = require("express-session");
var db = require("./db");

const app = express();
const port = 3007;

let clickerCount =0;
let checkMessage = 0;

// This will be handled with the "static files"
// Use for css and javascript 

app.use("/resources", express.static('resources'))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// check this app.use(session) later
app.use(session({
    secret: "CSCI4131SecretKey",
    resave: false,
    saveUninitialized: true
}));


app.set("views", "templates");

// view engine is pug in express setting
app.set("view engine", "pug");

/****************************************************** */
app.get("/myAboutMe", (req, res) => {
    res.render("myAboutMe",{username:req.session.username})   
});
app.get("/myContacts", (req, res) => {
    res.render("myContacts", { username: req.session.username });
});

app.get("/contactMe", (req, res) => {
    res.render("contactMe", { username: req.session.username,checkMessage: 0 });
});

app.post("/contactMe", async function (req, res){

    var Info = {
        postTitle: req.body.postTitle,
        email: req.body.email,
        username: req.body.username,
        link: req.body.link,
        category: req.body.category,
        message: req.body.message
    }
    try{
        await db.addContact(Info);
        res.render("contactMe",{checkMessage:1})
    }
    catch (err) {
        res.render("contactMe",{checkMessage:2})
    }
});

app.get("/contactLog", async function(req, res){ 

    let Info = await db.getAllInfo();

        if (req.query.category === "question") {
            Info = await db.getQuestionInfo();
            res.render("contactLog", { Info: Info, username: req.session.username })
        }
        else if (req.query.category === "comment") {
            Info = await db.getCommentInfo();
            res.render("contactLog", { Info: Info, username: req.session.username  })
        }
        else if (req.query.category === "concern") {
            Info = await db.getConcernInfo();
            res.render("contactLog", { Info: Info, username: req.session.username  })
        }

        else if (req.query.category === "All") {
            Info = await db.getAllInfo();
            res.render("contactLog", { Info: Info, username: req.session.username  })
        }
        else {
            Info = await db.getAllInfo();
            res.render("contactLog", { Info: Info, username: req.session.username  })
        }
});

app.get("/myWidgets", (req, res) => {    
    res.render("myWidgets", { username: req.session.username})
});

app.get("/api/click",(req,res)=>{
    res.json({ clicks: clickerCount });
})

app.post("/api/click",(req,res)=>{
    clickerCount +=1;

   res.json({clicks:clickerCount});
})

app.post("/myWidgets",(req,res)=>{
      
    res.render("myWidgets")
})

app.get("/login", (req, res) => {

    if(req.session.username || req.session.password){
        res.render("logout",{username:req.session.username})
    }else{
        res.render("login",{username:req.session.username})
    }
});

app.post("/login", (req, res) => {

    var username = req.body.username;
    var password = req.body.password;

    req.session.username = username;
    req.session.password = password;

    res.render("myAboutMe", { username: username });
});

app.listen(port, () => {
    console.log(`app listening on ${port}`);
});
