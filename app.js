const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const ejsMate = require('ejs-mate')
const {campgroundSchema} = require('./validationSchema.js')
const catchAsync = require('./utilities/catchAsync')
const ExpressError = require('./utilities/ExpressError')
const methodOverride = require('method-override')
const Campground = require('./models/campground')

// connecting to mongoDB
mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
})
//checking mongoDB conncetion 
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
})

// seting for express and ejs
const app = express()
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))


const validateCampground = (req,res,next) =>{
    // const campgroundSchema = joi.object({
    //     campground:joi.object({
    //         title: joi.string().required(),
    //         price: joi.number().required().min(0),
    //         image: joi.string().required(),
    //         location: joi.string().required(),
    //         description: joi.string()
    //     }).required()
    // })
    const {error} = campgroundSchema.validate(req.body)
    if(error){
        const message = error.details.map(el => el.message).join(',')
        throw new ExpressError(400,message)
    }else{
        next()
    }
}


// home page
app.get('/', (req, res) => {
    res.render('home')
})

//list all campgrounds
app.get('/campgrounds', catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({})
    res.render('campgrounds/index', { campgrounds })
}))

//render a form to create new campground
app.get('/campgrounds/new', (req,res) => {
    res.render('campgrounds/new')
})

//form to create new campground
app.post('/campgrounds',validateCampground, catchAsync(async (req,res,next) =>{
        const campground = new Campground(req.body.campground)
        await campground.save();
        res.redirect(`/campgrounds/${campground._id}`)
}))

//show campground by id
app.get('/campgrounds/:id', catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id)
    res.render("campgrounds/show", { campground })
}))

// form to edit specific campground
app.get('/campgrounds/:id/edit', validateCampground, catchAsync(async (req,res) => {
    const campground = await Campground.findById(req.params.id)
    res.render("campgrounds/edit", { campground })
    
}))

// update a specific campground on server
app.put('/campgrounds/:id', catchAsync(async(req,res) => {
    const campground = await Campground.findByIdAndUpdate(
        req.params.id,
        {...req.body.campground},
        {new: true}
        )
    res.redirect(`/campgrounds/${campground._id}`)
}))

// delete a campground
app.delete('/campgrounds/:id', catchAsync(async(req,res) => {
    const {id} = req.params
    await Campground.findByIdAndDelete(id)
    res.redirect('/campgrounds')
}))

//not match
app.all('*', (req, res, next) => {
    next(new ExpressError(404,'Page Not Found'))
})

//error handler
app.use((error,req,res,next)=>{
    const {status = 500} = error
    if (! error.message) error.message = "bad,bad"
    res.status(status).render('error',{error})
})

//server
app.listen(3000, () => {
    console.log("Serving on port 3000")
})

