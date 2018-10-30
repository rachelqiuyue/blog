var express = require("express");
var app = express();
var methodOverride = require("method-override");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var expressSanitizer = require("express-sanitizer");

mongoose.connect("mongodb://localhost/blog_app");
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.set("view engine","ejs");
app.use(methodOverride("_method"));
app.use(expressSanitizer());

var blogSchema = new mongoose.Schema({
    title:String,
    image: String,
    body: String,
    created: {type: Date,default: Date.now}
});

var Blog = mongoose.model("Blog",blogSchema);

// Blog.create({
//      title:"Test Dog",
//      image:"https://img-aws.ehowcdn.com/600x600p/photos.demandstudios.com/getty/article/129/142/75546255.jpg",
//      body:"First post"
// });





//index
app.get("/",function(req,res){
  res.redirect("/blogs");
});

app.get("/blogs",function(req,res){
    Blog.find({},function(err,blogs){
        if (err){
            console.log("ERROR");
        }else{
            res.render("index",{blogs:blogs});
        }
    });
});

//new route
app.get("/blogs/new",function(req, res){
    res.render("new.ejs");
});

//create route
app.post("/blogs",function(req,res){
    req.body.blog.body = req.sanitizer(req.body.blog.body)
    Blog.create(req.body.blog,function(err,newBlog){
        if(err){
            res.render("new.ejs");
        }else{
            res.redirect("/blogs");
        }
    });
});

//show route
app.get("/blogs/:id",function(req, res) {
    Blog.findById(req.params.id,function(err,foundBlog){
        if (err){
            res.redirect("/blogs");
        }else{
            res.render("show.ejs",{blog:foundBlog});
        }
    });
});
app.listen(process.env.PORT,process.env.IP,function(){
   console.log("Started"); 
});

//edit
app.get("/blogs/:id/edit",function(req,res){
        Blog.findById(req.params.id,function(err,foundBlog){
        if(err){
            res.redirect("/blogs");
        }else{
            res.render("edit",{blog:foundBlog});
        }
    });
});

//update
app.put("/blogs/:id",function(req,res){
    Blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err,updatedBlog){
        if (err){
            res.redirect("/blogs");
        }else{
            res.redirect("/blogs/"+req.params.id);
        }
    });
});


//delete
app.delete("/blogs/:id",function(req,res){
    Blog.findByIdAndRemove(req.params.id,function(err){
        if (err){
            res.redirect("/blogs");
        }else{
            res.redirect("/blogs");
        }
    });
});