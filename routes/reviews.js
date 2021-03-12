const express = require('express')
const router = express.Router({mergeParams:true})

const catchAsync = require('../utilities/catchAsync')

const Review = require('../models/review')
const Campground = require('../models/campground')
const {isLoggedIn,isReviewAuthor, validateReview} = require('../middleware')


//create review
router.post('/', isLoggedIn,validateReview, catchAsync(async(req,res) => {
    const {id} = req.params
    const campground = await Campground.findById(id)
    const review = new Review(req.body.review)
    review.author = req.user._id
    campground.reviews.push(review)
    await campground.save()
    await review.save()
    res.redirect(`/campgrounds/${campground._id}`)
}))

//delete review
router.delete('/:reviewId',isLoggedIn, isReviewAuthor,catchAsync(async (req,res,)=>{
    const {id, reviewId} = req.params
    await Campground.findByIdAndUpdate(id,{$pull: { reviews: reviewId }})
    await Review.findByIdAndDelete(reviewId)
    res.redirect(`/campgrounds/${id}`)
}))

module.exports = router