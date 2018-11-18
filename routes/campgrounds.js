var express = require("express"),
    router = express.Router(),
    Campground = require("../models/campground"),
    middleware = require("../middleware/index.js");

//INDEX - show all campgrounds
router.get("/campgrounds", function(req, res){
    // Get all campgrounds from DB
    Campground.find({}, function(err, allCampgrounds){
       if(err){
           console.log(err);
       } else {
          res.render("campgrounds/index",{campgrounds:allCampgrounds});
       }
    });
});

//CREATE ROUTE - add new campground to DB
router.post("/campgrounds", middleware.isLoggedIn, function(req, res){
    // get data from form and add to campgrounds array
    var name = req.body.name;
    var price = req.body.price;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newCampground = {name: name, price: price, image: image, description: desc, author: author}
    // Create a new campground and save to DB
    Campground.create(newCampground, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            //redirect back to campgrounds page
            res.redirect("/campgrounds");
        }
    });
});

//NEW ROUTE - show form to create new campground
router.get("/campgrounds/new", middleware.isLoggedIn, function(req, res){
   res.render("campgrounds/new"); 
});

// SHOW ROUTE - shows more info about one campground
router.get("/campgrounds/:id", function(req, res){
    //find the campground with provided ID
    //.populate will show the actual comment instead of its id
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
            console.log(err);
        } else {
            console.log(foundCampground)
            //render show template with that campground
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
});

//EDIT ROUTE
router.get("/campgrounds/:id/edit", middleware.checkCampgroundOwnership, function(req,res){
    Campground.findById(req.params.id, function(err, foundCampground){
        res.render("campgrounds/edit", {campground: foundCampground});
    });
});

//UPDATE ROUTE
router.put("/campgrounds/:id", middleware.checkCampgroundOwnership, function(req,res){
    //find and update the correct campground
    //the arguments are: the given id, the specific data saved in campground, callback
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
        if(err){
            res.redirect("/campgrounds");
        }else{
             //redirect to the giveen campground with its id
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

//DESTROY ROUTE
router.delete("/campgrounds/:id", middleware.checkCampgroundOwnership, function(req,res){
    Campground.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/campgrounds");
        }else{
            res.redirect("/campgrounds");
        }
    });
});

module.exports = router;