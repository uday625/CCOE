var express             = require("express"),
    mongoose            = require("mongoose"),
    methodOverride      = require("method-override"),
    bodyParser          = require("body-parser"), 
    expressSanitizer    = require("express-sanitizer"),
    Tool                = require("./models/tool");

mongoose.connect("mongodb://localhost/CCOE_Tool");

var app = express();

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.use(expressSanitizer());

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
app.get("/tools",(req,res)=>{
    Tool.find({},function(err,alltools){
        if(err){
            console.log(err);
        }else{
            res.render("tool", {tools:alltools});
        }
    });    
});

// NEW ROUTE
app.get("/tools/new", (req,res)=>{
     res.render("new");
});

// CREATE ROUTE
app.post("/tools", (req,res)=>{
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


// AUTH ROUTE 
//===============

//LOGIN ROUTE

app.get("/login", (req,res)=>{
    res.render("login");
});






app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server Has Started...");
});