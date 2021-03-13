const express = require('express')
const router = express.Router({mergeParams:true})

const catchAsync = require('../utilities/catchAsync')
const reviews = require('../controllers/reviews')
const {isLoggedIn,isReviewAuthor, validateReview} = require('../middleware')


//create review
router.post('/', isLoggedIn,validateReview, catchAsync(reviews.createReview))

//delete review
router.delete('/:reviewId',isLoggedIn, isReviewAuthor,catchAsync(reviews.deleteReview))

module.exports = router