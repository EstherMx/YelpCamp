var express = require("express"),
    router = express.Router(),
    passport = require("passport"),
    User = require("../models/user"),
    Campground = require("../models/campground"),
    Comment = require("../models/comment");


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
          //if the user already exists then return the form
            console.log(err);
            return res.render("register");
        }
        //else, go to campground page
        passport.authenticate("local")(req, res, function(){
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
   res.redirect("/campgrounds");
});

//middleware login
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}


module.exports = router;