// importing the denpendencies in the app
const express = require("express");
const app     = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const expressSanitizer = require("express-sanitizer");

// connecting to data base
mongoose.connect("mongodb://localhost/blog_site", {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("CONNECTED TO DATABASE"))
.catch(err => console.log(err));
// steing up Schema for the database
const blogsSchema = new mongoose.Schema({
    title: String,
    image: String,
    description: String,
    created: {type:Date, default: Date.now}
});
const Blogs = mongoose.model("Blogs", blogsSchema);

// seting the variables for the app
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.use(express.static("public"));
app.use(methodOverride("_method"));


// ROUTES
// INDEX ROUTE
app.get("/", (req, res) => {
    res.redirect("/blogs")
})
app.get("/blogs", function(req, res){
    Blogs.find({}, (err, blogs) => {
        if(err){
            console.log(err);
        }else{
            res.render("index", {blogs: blogs});
        }
    });
});
// NEW ROUTE
app.get("/blogs/new", (req, res) => {
    res.render("new")
});
// CREATE ROUTE
app.post("/blogs", function(req, res){
    req.body.blog.description = req.sanitize(req.body.blog.description);
    Blogs.create(req.body.blog, (err, blog) => {
        if(err){
            console.log(err);
        }else{
            res.redirect("/blogs");
        }
    });
});
// SHOW ROUTE
app.get("/blogs/:id", (req, res) => {
    let blog = Blogs.findById(req.params.id, (err, blog) => {
        if(err){
            res.redirect("/blogs");
        }else{
            res.render("show", {blog: blog});
        }
    });
    
});
// EDIT ROUTE
app.get("/blogs/:id/edit", (req, res) => {
    Blogs.findById(req.params.id, (err, foundBlog) => {
        if(err){
            console.log(error);
        }else{
            res.render("edit", {blog: foundBlog});
        }
    });
});
// UPDATE ROUTE
app.put("/blogs/:id", (req, res) => {
    req.body.blog.description = req.sanitize(req.body.blog.description);
    Blogs.findByIdAndUpdate(req.params.id, req.body.blog, (err, updateBlog) => {
        if(err){
            res.redirect("/blogs");
        }else{
            res.redirect("/blogs/" + req.params.id)
        }
    });
});
// DELETE ROUTE
app.delete("/blogs/:id", (req, res) => {
    Blogs.findByIdAndRemove(req.params.id, err => {
        if(err){
            res.redirect("/blogs");
        }else{
            res.redirect("/blogs");
        }
    });
});
// seting the app to start listening
app.listen(3000, () => console.log("THE SERVER IS SRARTED!!"));
