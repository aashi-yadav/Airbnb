const express = require("express");
const app = express();
const users = require("./routes/user.js");
const posts = require("./routes/post.js");
const session = require("express-session");
const flash = require("connect-flash");
const path = require("path");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

const sessionOpt = {
  secret: "mypassword",
  resave: false,
  saveUninitialized: true
};

app.use(session(sessionOpt));
app.use(flash());
app.use((req,res,next)=>{
    res.locals.successMsg = req.flash("success"); // Retrieve flash message
    res.locals.errorMsg = req.flash("error"); // Retrieve flash message
    next();
});

app.get("/register", (req, res) => {
  let { name = "anonymous" } = req.query;
  req.session.name = name;
  if(name==="anonymous"){
    req.flash("error", "User not registered successfully!"); // Set flash message
  }else{
    req.flash("success", "User registered successfully!"); // Set flash message
  }
  
  res.redirect("/hello");
});

app.get("/hello", (req, res) => {
  res.render("page.ejs", {name: req.session.name});
});
// app.get("/hello", (req, res) => {
//     res.locals.message = req.flash("success"); // Retrieve flash message
//     console.log(res.locals.message); // Access message via res.locals
//     res.render("page.ejs", { name: req.session.name });
//   });
  

app.listen(3000, () => {
  console.log("Server is listening on 3000");
});
