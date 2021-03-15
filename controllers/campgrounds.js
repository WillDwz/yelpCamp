const Campground = require('../models/campground')
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN
const geocoder = mbxGeocoding({ accessToken: mapBoxToken})
const {cloudinary} = require('../cloudinary')
//list all campgrounds
module.exports.index = async (req, res) => {
    const campgrounds = await Campground.find({})
    res.render('campgrounds/index', { campgrounds })
}

//form to create new campground
module.exports.newForm = (req,res) => {
    res.render('campgrounds/new')
}

//create a new campground
module.exports.create = async (req, res, next) => {
    const geoData = await geocoder.forwardGeocode({
        query: req.body.campground.location,
        limit: 1
    }).send()
    const campground = new Campground(req.body.campground)
    campground.geometry = geoData.body.features[0].geometry
    campground.images = req.files.map(f => ({ url: f.path, filename: f.filename }))
    campground.author = req.user._id
    await campground.save();
    // req.flash('success','campground added')
    res.redirect(`/campgrounds/${campground._id}`)
}

//show campground by id
module.exports.show = async (req, res) => {
    const campground = await Campground.findById(req.params.id).populate(
        {path:"reviews",
        populate:{
            path:"author"
        }}
    ).populate("author")
    if(!campground)
    {
        req.flash('error','Cannot find that campground')
        return res.redirect('/campgrounds')
    }
    res.render("campgrounds/show", { campground })
}

// form to edit specific campground
module.exports.editForm = async (req,res) => {
    const campground = await Campground.findById(req.params.id)
    if(!campground)
    {
        req.flash('error','Cannot find that campground')
        return res.redirect('/campgrounds')
    }
    res.render("campgrounds/edit", { campground })
}

// update a specific campground on server
module.exports.update = async (req, res) => {
    newimg = req.files.map(f => ({ url: f.path, filename: f.filename }))
    const campground = await Campground.findByIdAndUpdate(
        req.params.id,
        {
            $push: { "images": newimg },
            ...req.body.campground
        },
        {new: true}
    )
    if (req.body.delete) {
        for (let file of req.body.delete) {
            cloudinary.uploader.destroy(file)
        }
        await campground.updateOne({ $pull: { images: { filename: {$in:req.body.delete}}}})
    }
    res.redirect(`/campgrounds/${campground._id}`)
}

// delete a campground
module.exports.delete = async(req,res) => {
    const {id} = req.params
    await Campground.findByIdAndDelete(id)
    res.redirect('/campgrounds')
}