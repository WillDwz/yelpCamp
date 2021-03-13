const Review = require('../models/review')
const Campground = require('../models/campground')

//create review
module.exports.createReview = async(req,res) => {
    const {id} = req.params
    const campground = await Campground.findById(id)
    const review = new Review(req.body.review)
    review.author = req.user._id
    campground.reviews.push(review)
    await campground.save()
    await review.save()
    res.redirect(`/campgrounds/${campground._id}`)
}

//delete review
module.exports.deleteReview = async (req,res,)=>{
    const {id, reviewId} = req.params
    await Campground.findByIdAndUpdate(id,{$pull: { reviews: reviewId }})
    await Review.findByIdAndDelete(reviewId)
    res.redirect(`/campgrounds/${id}`)
}