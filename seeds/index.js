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
    for (let i = 0; i < 200; i++) {
        const randcity = sample(cities)
        const camp = new Campground({
            location: `${randcity.city}, ${randcity.state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description: "something.....tbc",
            price: Math.floor(Math.random()*100)+20,
            author: '6049d8afe3eb602c3862ec10',
            geometry: {
                type: "Point",
                coordinates:[randcity.longitude,randcity.latitude]  
            },
            images:[
                {
                    url: 'https://res.cloudinary.com/willdwz/image/upload/v1615790046/YelpCamp/vyicl7x4tit86bt8rhw4.jpg',
                    filename: 'YelpCamp/vyicl7x4tit86bt8rhw4'
                }
            ]
        })
        await camp.save()
    }
}
seedDB()
