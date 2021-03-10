const express = require('express')
const router = express.Router({mergeParams:true})

const {reviewSchema} = require('../validationSchema.js')

const catchAsync = require('../utilities/catchAsync')
const ExpressError = require('../utilities/ExpressError')

const Review = require('../models/review')
const Campground = require('../models/campground')


const validateReview = (req,res,next) =>{
    const {error} = reviewSchema.validate(req.body)
    if(error){
        const message = error.details.map(el => el.message).join(',')
        throw new ExpressError(400,message)
    }else{
        next()
    }
}
//create review
router.post('/', validateReview, catchAsync(async(req,res) => {
    const {id} = req.params
    const campground = await Campground.findById(id)
    const review = new Review(req.body.review)
    campground.reviews.push(review)
    await campground.save()
    await review.save()
    res.redirect(`/campgrounds/${campground._id}`)
}))

//delete review
router.delete('/:reviewId', catchAsync(async (req,res,)=>{
    const {id, reviewId} = req.params
    await Campground.findByIdAndUpdate(id,{$pull: { reviews: reviewId }})
    await Review.findByIdAndDelete(reviewId)
    res.redirect(`/campgrounds/${id}`)
}))

module.exports = router