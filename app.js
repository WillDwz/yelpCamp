const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const ejsMate = require('ejs-mate')
const methodOverride = require('method-override')
const Campground = require('./models/campground')
const { request } = require('express')
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

// home page
app.get('/', (request, response) => {
    response.render('home')
})

//list all campgrounds
app.get('/campgrounds', async (request, response) => {
    const campgrounds = await Campground.find({})
    response.render('campgrounds/index', { campgrounds })
})

//render a form to create new campground
app.get('/campgrounds/new', (request,response) => {
    response.render('campgrounds/new')
})

//form to create new campground
app.post('/campgrounds',async (request,response) =>{
    const campground = new Campground(request.body.campground)
    // response.send(request.body.campground)
    await campground.save();
    response.redirect(`/campgrounds/${campground._id}`)
})

//show campground by id
app.get('/campgrounds/:id', async (request, response) => {
    const campground = await Campground.findById(request.params.id)
    response.render("campgrounds/show", { campground })
    //const {id} = request.params
})

// form to edit specific campground
app.get('/campgrounds/:id/edit', async (request,response) => {
    const campground = await Campground.findById(request.params.id)
    response.render("campgrounds/edit", { campground })
    
})

// update a specific campground on server
app.put('/campgrounds/:id', async(request,response) => {
    const campground = await Campground.findByIdAndUpdate(
        request.params.id,
        {...request.body.campground},
        {new: true}
        )
    response.redirect(`/campgrounds/${campground._id}`)
})

// delete a campground
app.delete('/campgrounds/:id', async(request,response) => {
    const {id} = request.params
    await Campground.findByIdAndDelete(id)
    response.redirect('/campgrounds')
})
//server
app.listen(3000, () => {
    console.log("Serving on port 3000")
})