if(process.env.Node_ENV !== "production")
{
    require('dotenv').config()
}
const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const ejsMate = require('ejs-mate')
const session = require('express-session')
const flash = require('connect-flash')
const ExpressError = require('./utilities/ExpressError')
const methodOverride = require('method-override')
const passport = require('passport')
const localStrategy = require('passport-local')
const mongoSanitize = require('express-mongo-sanitize')

const User = require('./models/user')
const userRoute = require('./routes/users')
const campgroundRoute = require('./routes/campgrounds')
const reviewRoute = require('./routes/reviews')

const MongoStore = require('connect-mongo')
const db_Url = process.env.db_Url || 'mongodb://localhost:27017/yelp-camp'

// connecting to mongoDB
mongoose.connect(db_Url, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
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
app.use(express.static(path.join(__dirname, 'public')))
app.use(mongoSanitize())

const secret = process.env.SECRET || 'thisshouldbeabettersecret!';
const store = MongoStore.create({
    mongoUrl: db_Url,
    touchAfter: 24 * 3600,
    crypto: {
        secret
    }
  })
//session
const sessionConfig = {
    store,
    secret,
    resave: false,
    saveUninitialized: true,
    // store: mongodb
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000*60*60*24*7,
        maxAge: 1000*60*60*24*7
    }
    
}
app.use(session(sessionConfig))

//setup for user authentication 
app.use(passport.initialize())
app.use(passport.session())
passport.use(new localStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use(flash())
app.use((req,res,next)=>{
    res.locals.currentUser = req.user
    res.locals.success = req.flash('success')
    res.locals.error = req.flash('error')
    next()
})


//routes
app.use('/',userRoute)
app.use('/campgrounds',campgroundRoute)
app.use('/campgrounds/:id/reviews',reviewRoute)

// home page
app.get('/', (req, res) => {
    res.render('home')
})


//not match any page
app.all('*', (req, res, next) => {
    next(new ExpressError(404,'Page Not Found'))
})

//error handler
app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh No, Something Went Wrong!'
    res.status(statusCode).render('error', { err })
})

const port = process.env.PORT || 3000
//server
app.listen(port, () => {
    console.log(`Serving on port ${port}`)
})

