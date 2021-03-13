const User = require('../models/user')

//form to register
module.exports.registerForm = (req,res)=>{
    res.render('users/register')
}

//create a user
module.exports.register = async (req,res)=>{
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
}

// form to login
module.exports.loginForm = (req,res)=>{
    res.render('users/login')
}

//login
module.exports.login =  (req,res)=>{
    // req.flash("sucess","")
    const to = req.session.returnTo || '/campgrounds'
    delete req.session.returnTo
    res.redirect(to)
}

//logout
module.exports.logout = (req,res)=>{
    req.logout()
    res.redirect('/campgrounds')
}