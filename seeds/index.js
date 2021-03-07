const mongoose = require('mongoose')
const cities = require('./cities')
const { places, descriptors } = require('./seedHelpers')
const Campground = require('../models/campground')
// connecting to mongoDB
mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
})
//checking mongoDB conncetion 
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"))
db.once("open", () => {
    console.log("Database connected")
})

const sample = (array) => { return array[Math.floor(Math.random() * array.length)] }
// const sample = array => array[Math.floor(Math.random() * array.length)];


const seedDB = async () => {
    await Campground.deleteMany({})
    for (let i = 0; i < 50; i++) {
        const randcity = sample(cities)
        const camp = new Campground({
            location: `${randcity.city}, ${randcity.state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            image: 'https://source.unsplash.com/collection/827743',
            description: "something.....tbc",
            price: Math.floor(Math.random()*100)+20
        })
        await camp.save()
    }
}
seedDB()
