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
    for (let i = 0; i < 10; i++) {
        const randcity = sample(cities)
        const camp = new Campground({
            location: `${randcity.city}, ${randcity.state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description: "something.....tbc",
            price: Math.floor(Math.random()*100)+20,
            author: '6049d8afe3eb602c3862ec10',
            images:[
                {
                  url: 'https://res.cloudinary.com/willdwz/image/upload/v1615639092/YelpCamp/a9oyhldr7s5zhgxtpbag.jpg',
                  filename: 'YelpCamp/a9oyhldr7s5zhgxtpbag'                          
                },
                {
                  url: 'https://res.cloudinary.com/willdwz/image/upload/v1615639091/YelpCamp/jncxh8niof0ez71gjhkf.jpg',       
                  filename: 'YelpCamp/jncxh8niof0ez71gjhkf'
                }
            ]
        })
        await camp.save()
    }
}
seedDB()
