var express = require("express"),
    router = express.Router(),
    Campground = require("../models/campground"),
    Comment = require("../models/comment"),
    middleware = require("../middleware/index.js");


//NEW ROUTE
router.get("/campgrounds/:id/comments/new", middleware.isLoggedIn, function(req, res){
    // find campground by id
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
        } else {
             res.render("comments/new", {campground: campground});
        }
    })
});

//CREATE ROUTE
router.post("/campgrounds/:id/comments",middleware.isLoggedIn, function(req, res){
   //lookup campground using ID
   Campground.findById(req.params.id, function(err, campground){
       if(err){
         console.log(err);
          res.redirect("/campgrounds");
       } else {
        //create new comment
        Comment.create(req.body.comment, function(err, comment){
           if(err){
            req.flash("error", "Something went wrong. Please, try again!");
            console.log(err);
           } else {
              //add username and id to comment
              comment.author.id = req.user._id;
              comment.author.username = req.user.username;
              //save comment
              comment.save();
              //connect new comment to campground
              campground.comments.push(comment);
              campground.save();
              req.flash("success", "Comment successfully created!");
              //redirect campground show page
              res.redirect('/campgrounds/' + campground._id);
           }
        });
       }
   });
});


//EDIT ROUTE
router.get("/campgrounds/:id/comments/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
  Comment.findById(req.params.comment_id, function(err, foundComment){
    if(err){
      res.redirect("back");
    }else{
      res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
    }
  });
});


//UPDATE ROUTE
router.put("/campgrounds/:id/comments/:comment_id", middleware.checkCommentOwnership, function(req, res){
  Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
    if(err){
      res.redirect("back");
    }else{
      //redirect to the giveen campground with its id
      res.redirect("/campgrounds/" + req.params.id);
    }
  });
});


//DESTROY ROUTE
router.delete("/campgrounds/:id/comments/:comment_id", middleware.checkCommentOwnership, function(req, res){
  Comment.findByIdAndRemove(req.params.comment_id, function(err){
    if(err){
      res.redirect("back");
    }else{
      req.flash("success", "Comment deleted!");
      res.redirect("/campgrounds/" + req.params.id);
    }
  });
});

module.exports = router;