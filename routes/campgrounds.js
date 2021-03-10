const express = require('express')
const router = express.Router()
const {campgroundSchema} = require('../validationSchema.js')
const catchAsync = require('../utilities/catchAsync')
const ExpressError = require('../utilities/ExpressError')
const Campground = require('../models/campground')


const validateCampground = (req,res,next) =>{
    const {error} = campgroundSchema.validate(req.body)
    if(error){
        const message = error.details.map(el => el.message).join(',')
        throw new ExpressError(400,message)
    }else{
        next()
    }
}
//list all campgrounds
router.get('/', catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({})
    res.render('campgrounds/index', { campgrounds })
}))

//render a form to create new campground
router.get('/new', (req,res) => {
    res.render('campgrounds/new')
})

//form to create new campground
router.post('/',validateCampground, catchAsync(async (req,res,next) =>{
        const campground = new Campground(req.body.campground)
        await campground.save();
        // req.flash('success','campground added')
        res.redirect(`/campgrounds/${campground._id}`)
}))

//show campground by id
router.get('/:id', catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id).populate("reviews")
    if(!campground)
    {
        req.flash('error','Cannot find that campground')
        return res.redirect('/campgrounds')
    }
    res.render("campgrounds/show", { campground })
}))

// form to edit specific campground
router.get('/:id/edit', catchAsync(async (req,res) => {
    const campground = await Campground.findById(req.params.id)
    if(!campground)
    {
        req.flash('error','Cannot find that campground')
        return res.redirect('/campgrounds')
    }
    res.render("campgrounds/edit", { campground })
}))

// update a specific campground on server
router.put('/:id', validateCampground, catchAsync(async(req,res) => {
    const campground = await Campground.findByIdAndUpdate(
        req.params.id,
        {...req.body.campground},
        {new: true}
        )
    res.redirect(`/campgrounds/${campground._id}`)
}))

// delete a campground
router.delete('/:id', catchAsync(async(req,res) => {
    const {id} = req.params
    await Campground.findByIdAndDelete(id)
    res.redirect('/campgrounds')
}))

module.exports = router