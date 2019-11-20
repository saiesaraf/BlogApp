var express= require("express");
var app=express();

var bodyParser= require("body-parser");

var mongoose = require("mongoose");
var methodOverride= require("method-override");
var expressSanitizer= require("express-sanitizer");

mongoose.connect("mongodb://localhost/restful_blog_app",{ useNewUrlParser: true });
app.set("view engine","ejs");

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.use(expressSanitizer());

var blogSchema= new mongoose.Schema({
    title :String,
    image :String,
    body:String,
    Created :{type:Date,default:Date.now}
});

var Blog=mongoose.model("Blog",blogSchema);
//Create blog
/*Blog.create({
    title:"This is my Test Blog",
    image:"https://newhampshirestateparks.reserveamerica.com/webphotos/NH/pid270015/0/540x360.jpg",
    body:"Hello testing",
    Created:" "
});*/
//Restful Routes:
//1.Index Route
app.get("/",function(req,res)
{
    res.redirect("/blogs");
});

app.get("/blogs",function(req,res)
{
    Blog.find({},function(err,blogs)
    {
        if(err)
        {
            console.log("Error");
        }
        else{
            res.render("index",{blogs:blogs});
        }
    });
});

//2. NewRoute
app.get("/blogs/new",function(req,res)
{
    res.render("new");
});

//Create Route
app.post("/blogs",function(req,res)
{
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.create(req.body.blog,function(err,newBlog)
    {
        if(err)
        {
            res.render("new");
        }
        else
        {
            res.redirect("/blogs");
        }
    })
});
//Show Route
app.get("/blogs/:id",function(req,res)
{
    Blog.findById(req.params.id,function(err,foundBlog)
    {
        if(err)
        {
            res.redirect("/blogs");
        }
        else
        {
            res.render("show",{blog:foundBlog});
        }
    })
});
//Edit Route
app.get("/blogs/:id/edit",function(req,res)
{
    Blog.findById(req.params.id,function(err,foundBlog)
    {
        if(err)
        {
            res.redirect("/Blogs");
        }
        else{
            res.render("edit",{blog:foundBlog});
        }
    });
});

//Update Route
app.put("/blogs/:id",function(req,res)
{
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err,updatedBlog)
    {
        if(err)
        {
            res.redirect("/blogs");
        }
        else{
            res.redirect("/blogs/"+req.params.id);
        }
    });
});

//Delete Route
app.delete("/blogs/:id",function(req,res){
    //destroy blog
    Blog.findByIdAndRemove(req.params.id,function(err){
        if(err)
        {
            res.redirect("/blogs");
        }
    else
    {
        res.redirect("/blogs");
    }
});
});
app.listen(8080,process.env.IP,function()
{
    console.log("Blog App has started");
});