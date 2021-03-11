const express = require('express')
const passport = require('passport')
const router = express.Router()
const User = require('../models/user')
const catchAsync = require('../utilities/catchAsync')



//form to register
router.get('/register',(req,res)=>{
    res.render('users/register')
})

//create a user 
router.post('/register',catchAsync(async (req,res)=>{
    try{
        const {username,email,password} = req.body
        const user = new User({email,username})
        const registered = await User.register(user,password)
        req.login(registered,err =>{
            if (err) return next(err)
            req.flash('success','welcome')
            res.redirect('/campgrounds')
        })
    } catch (e){
        req.flash('error',e.message)
        res.redirect('/register')
    }
}))

// form to login
router.get('/login',(req,res)=>{
    res.render('users/login')
})
//login
router.post('/login',
    passport.authenticate('local', {failureFlash: true, failureRedirect:'/login'}),
    (req,res)=>{
        // req.flash("sucess","")
        const to = req.session.returnTo || '/campgrounds'
        delete req.session.returnTo
        res.redirect(to)
    }
)

//logout
router.get('/logout',(req,res)=>{
    req.logout()
    res.redirect('/campgrounds')
})
module.exports = router