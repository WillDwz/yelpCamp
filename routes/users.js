const express = require('express')
const passport = require('passport')
const router = express.Router()
const catchAsync = require('../utilities/catchAsync')
const users = require('../controllers/users')



router.route('/register')
    .get(users.registerForm)            //form to register
    .post(catchAsync(users.register))   //create a user 


router.route('/login')
    .get(users.loginForm)               // form to login
    .post(                              //login
        passport.authenticate('local', {failureFlash: true, failureRedirect:'/login'}),
        users.login
    )  

//logout
router.get('/logout',users.logout)

module.exports = router