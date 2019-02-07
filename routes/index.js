var express = require("express"),
    router = express.Router(),
    passport = require("passport"),
    User = require("../models/user");


//Root Route
router.get("/", function(req, res){
    res.render("landing");
});


// show register form
router.get("/register", function(req, res){
   res.render("register"); 
});
//handle sign up logic
router.post("/register", function(req, res){
    var newUser = new User({username: req.body.username});
    //create a new User:
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            req.flash("error", err.message);
          //if the user already exists then return the form
            console.log(err);
            return res.redirect("/register");
        }
        //else, go to campground page
        passport.authenticate("local")(req, res, function(){
            req.flash("success", "Welcome to Yelcamp " + user.username);
            res.redirect("/campgrounds"); 
        });
    });
});

// show login form
router.get("/login", function(req, res){
    res.render("login");   
});

// handling login logic
// router.post("/login", middleware, passport, callback)
// the middleware call the method localStrategy authenticate defined on lign 28
router.post("/login", passport.authenticate("local",
    {
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
    }), function(req, res){
});

// handling log out route
router.get("/logout", function(req, res){
   req.logout();
   req.flash("success", "You are successfully logged out!")
   res.redirect("/");
});

module.exports = router;