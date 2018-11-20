var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    flash = require("connect-flash"),
    passport = require("passport"),
    LocalStrategy = require("passport-local"),
    methodOverride = require("method-override"),
    Campground = require("./models/campground"),
    Comment = require("./models/comment"),
    User = require("./models/user"),
    seedDB = require("./seeds");

//requiring Routes
var commentRoutes = require("./routes/comments"),
    campgroundRoutes = require("./routes/campgrounds"),
    indexRoutes = require("./routes/index");
    
mongoose.connect("mongodb://localhost/yelp_camp_v6");
//app.use affects every file of the app
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public")); // this connects this app to the styling sheet
app.use(methodOverride("_method"));
app.use(flash());
// seedDB(); //run function seedDB from seed.js

// PASSPORT PRE-CONFIGURATION
app.use(require("express-session")({ //express middleware use for persisting sessions accross HYYP requests.
    secret: "Once again Rusty wins cutest dog!",
    resave: false,
    saveUninitialized: false
}));

//PASSPORT CONFIGURATION
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//Creating a middleware for currentUser with "next" that can be used on any file
app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   res.locals.error = req.flash("error");
   res.locals.success = req.flash("success");
   next();
});

app.use(commentRoutes);
app.use(indexRoutes);
app.use(campgroundRoutes);

app.listen(process.env.PORT || 3000, function(){
 console.log('App listening on port 3000');
});