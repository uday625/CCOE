var express                 = require("express"),
    mongoose                = require("mongoose"),
    methodOverride          = require("method-override"),
    bodyParser              = require("body-parser"), 
    expressSanitizer        = require("express-sanitizer"),
    LocalStrategy           = require("passport-local")  ,
    passportLocalMongoose   = require("passport-local-mongoose"),
    passport                = require("passport"),
    Tool                    = require("./models/tool"),
    User                    = require("./models/user");

mongoose.connect("mongodb://localhost/CCOE_Tool");

var app = express();

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.use(expressSanitizer());

//PASSPORT CONFIGURATION

app.use(require("express-session")({
   secret: "Durga Puja 2018 will be awesome!", 
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.currentUser = req.user;
    next();
});

// //write to mongodb
// var feeSchedule = new Tool({
//     tooName: "Data Migration",
//     image: "https://qssymposium.wikispaces.com/file/view/schedule_logo.jpg/314130052/schedule_logo.jpg",
//     frameworkORtool: "Tool",
//     account: "XYZ Health",
//     toolInfo: "Data Migration tool is a genertic stand alone application.",
//     module: "Utility",
//     poc: "Bruno Mars",
//     dateCreated: "7/28/2018",
//     lastVersionUpdated: "7/28/2018",
//     wnership: "Client IP"
// });

// //feeSchedule.save((err,toolCreated)=>{
// Tool.create(feeSchedule,(err,toolCreated)=>{   
//     if(err){
//       console.log("error"+ err);
//     } else{
//         console.log("Tool Created:"+ toolCreated);
//     }
    
// });

// Tool.find({},(err,tools)=>{
//     if(err){
//       console.log("error"+ err);
//     } else{
//         console.log("Tool from Database:"+ tools);
//     }
// });

// HOME PAGE
app.get("/", (req,res)=>{
    res.render("home");
});

//INDEX - Display Tool Page
app.get("/tools",isLoggedIn, (req,res)=>{
    
    Tool.find({},function(err,alltools){
        if(err){
            console.log(err);
        }else{
            res.render("tool", {tools:alltools, currentUser:req.user});
        }
    });    
});

// NEW ROUTE
app.get("/tools/new", isLoggedIn, (req,res)=>{
     res.render("new");
});

// CREATE ROUTE
app.post("/tools", isLoggedIn, (req,res)=>{
    req.body.tools.body = req.sanitize(req.body.tools.body);
    Tool.create(req.body.tools, (err,newTool)=>{
        if(err){
            res.render("new");
        }else{
            res.redirect("/tools");
        }
    });
});
                
// SHOW ROUTE
app.get("/tools/:id", (req,res)=>{
    Tool.findById(req.params.id, (err,foundTool)=>{
        if(err){
            res.redirect("/tools");
        }else{
            res.render("show", {tool:foundTool});
        }        
    });
});


// EDIT ROUTE
app.get("/tools/:id/edit",(req,res)=>{
    Tool.findById(req.params.id,(err,foundTool)=>{
        if(err){
            res.redirect("/tools");
        }else{
            res.render("edit", {tool:foundTool});
        }
    });
});

// UPDATE ROUTE
app.put("/tools/:id",function(req,res){
    req.body.tools.body = req.sanitize(req.body.tools.body);
    Tool.findByIdAndUpdate(req.params.id, req.body.tools, function(err,updatedTool){
        if(err){
            res.redirect("/tools");
        }else{
            res.redirect("/tools/"+req.params.id);
        }
    });
});


// DELETE ROUTE
app.delete("/tools/:id",function(req,res){
    Tool.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/tools");
        }else{
            res.redirect("/tools");
        }
    });
});


//==============
// OTHER PAGES
//==============
app.get("/help", (req,res)=>{
    res.render("help");
});


//===============
// AUTH ROUTES 
//===============

//show register form
app.get("/register", (req,res)=>{
    res.render("register");
});

// handle sign up logic
app.post("/register",(req,res)=>{
    
    var newUser = new User({username: req.body.username});
    
    User.register(newUser, req.body.password,(err,user)=>{
        if(err){
            console.log(err);
            return res.render("register");
        }
        passport.authenticate("local")(req,res,()=>{
            res.redirect("/tools");
        });
    });
    
});


//show login form
app.get("/login", (req,res)=>{
    res.render("login");
});
//handling login logic

//app.post("/login", middleware, callback);
app.post("/login", passport.authenticate("local", 
        {
                successRedirect:"/tools", 
                failureRedirect:"/login"
        }),(req, res)=>{
    
});

//logout route
app.get("/logout", (req,res)=>{
    req.logout();
    res.redirect("/");
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}


app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server Has Started...");
});