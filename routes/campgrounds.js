const express = require('express')
const router = express.Router()
const catchAsync = require('../utilities/catchAsync')
const {isLoggedIn, isAuthor, validateCampground} = require('../middleware')
const campgrounds = require('../controllers/campgrounds')


router.route('/')
    .get(catchAsync(campgrounds.index))
    .post(isLoggedIn,validateCampground, catchAsync(campgrounds.create))

router.get('/new', isLoggedIn, campgrounds.newForm)

router.route('/:id')
    .get(catchAsync(campgrounds.show))
    .put(isLoggedIn,isAuthor,validateCampground, catchAsync(campgrounds.update))
    .delete(isLoggedIn,isAuthor,catchAsync(campgrounds.delete))

router.get('/:id/edit', isLoggedIn,isAuthor,catchAsync(campgrounds.editForm))

module.exports = router