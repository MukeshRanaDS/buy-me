//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const session = require('express-session');
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const findOrCreate = require('mongoose-findorcreate');

//____________________________ Settings __________________________________________
const app = express();
app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(session({
  secret: "Our little secret.",
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

//________________________Mongoose Database_____________________________________
mongoose.connect("mongodb+srv://muqesh:Mongo2020@cluster0.pt7eglh.mongodb.net/InventoryDB", {useNewUrlParser: true})
  .then(()=>console.log("DataBase Connected......."))
  .catch((err)=> console.log(err));mongoose.set("useCreateIndex", true);

// ______________________Get____________________________________________________
// Home Page
app.get("/", function(req, res){
  res.render("home");
});
// About
app.get("/about", function(req, res){
  res.render("about");
});
// achievements
app.get("/achievements", function(req, res){
  res.render("achievements");
});
// downloads
app.get("/downloads", function(req, res){
  res.render("downloads");
});
// Career
app.get("/career", function(req, res){
  res.render("career");
});
// contact
app.get("/contact", function(req, res){
  res.render("contact");
});

// ___________________________ Post ______________________________________________
// Submit
app.post("/submit", function(req, res){
  const submittedSecret = req.body.secret;
  User.findById(req.user.id, function(err, foundUser){
    if (err) {
      console.log(err);
    } else {
      if (foundUser) {
        foundUser.secret = submittedSecret;
        foundUser.save(function(){
          res.redirect("/dashboard");
        });
      }
    }
  });
});
// Register
app.post("/register", function(req, res){
  User.register({username: req.body.username}, req.body.password, function(err, user){
    if (err) {
      console.log(err);
      res.redirect("/register");
    } else {
      passport.authenticate("local")(req, res, function(){
        res.redirect("/dashboard");
      });
    }
  });
});
// Login
app.post("/login", function(req, res){
  const user = new User({
    username: req.body.username,
    password: req.body.password
  });
  req.login(user, function(err){
    if (err) {
      console.log(err);
    } else {
      passport.authenticate("local")(req, res, function(){
        res.redirect("/dashboard");
      });
    }
  });
});
// Parts Manager
app.post("/", function(req, res){
  const addRecord = new Table({
    itemID : req.body.itemID,
    itemName : req.body.partName,
    itemManufacturer : req.body.manuName,
    currBalance : req.body.quantity,
    timestamp : req.body.timestamp,
  });
  addRecord.save(function(err, req1){
    if(err) throw err;
    Table.find(function(err, data){
      if(err) throw err;
        res.render("career", {completeTableList:data});
    }).sort({"itemID":-1}).limit(7)
  });
});



//_________________________________Run Call_____________________________________
let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, function() {
  console.log("Server has started on port 3000..................");
});
