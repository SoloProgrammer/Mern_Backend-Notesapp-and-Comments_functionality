const express = require('express');
const router = express.Router();

const { body, validationResult } = require('express-validator');
const fetchuser = require('../middleware/fetchuser')
const Note = require('../models/Note');
const User = require('../models/User');
const Comment = require('../models/Comment');
//...........................................................ROUTE 1 FOR fetchingall notes of loggedin user


// Create a User  using: POST "/api/notes/fetchallnotes" Doesnt Auth/login required..........

router.get('/fetchallnotes', fetchuser, async (req, res) => {

    try {

        const notes = await Note.find({ user: req.user.id });

        const allnotes = await Note.find({});

        // res.json(notes)
        // console.log("......",notes);
        const user1 = await User.findById(req.user.id)
        // console.log(user1)
        res.json({ user1, notes , allnotes })
    } catch (error) {
        res.status(500).send("Internal Server Error")
    }
})


//...........................................................ROUTE 2 FOR Adding a note of loggedin user


// Addng a new note of logged in user  using: PUT "/api/notes/Addanote" require Auth/login required..........

router.post('/Addanote', fetchuser, [
    body('title', 'Title should be min 3 characters long').isLength({ min: 3 }),
    body('description', 'Description should be 5 characters long').isLength({ min: 5 }),
], async (req, res) => {

    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {

        const validstring = /\d/;
        console.log(Object.values(req.body))

        console.log(validstring.test(Object.values(req.body)))

        if(validstring.test(req.body.tag)){ return res.status(400).json({"status":false,"msg":"Numbers are not allowed in tag"}) }

        // const { title, description, tag } = req.body;

        // newnote = Note({title,description,tag,user:req.user.id})

        newnote = new Note({ ...req.body, user: req.user.id }) //....................... using spread operator 
        
        newnote.save()

        res.json({"status":true})

    } catch (error) {
        res.status(500).send("Internal Server Error")
    }
})

//...........................................................ROUTE 3 FOR Upating an Existing note of logged in user


// Upating an Existing note of logged in user  using: DELETE "/api/notes/Updatenote" require Auth/login required..........

router.put('/Updatenote/:id', fetchuser, async (req, res) => {

    const { title, description, tag } = req.body;

    // Creating a new Updted note

    const Updatednote = {}

    if (title) { Updatednote.title = title }

    if (description) { Updatednote.description = description }

    if (tag) { Updatednote.tag = tag }

    let note = await Note.findById(req.params.id)

    if (!note) {
        res.status(404).send("Not Found")
    }

    if (note.user.toString() !== req.user.id) {
        res.status(401).send("Not Allowed")
    }
    // note = await Note.findByIdAndUpdate(req.params.id, { $set: Updatednote }, { new: true })
    note = await Note.findByIdAndUpdate(req.params.id, { $set: Updatednote })

    res.json(note)

    // console.log(note.user.toString())
})

//...........................................................ROUTE 4 FOR Deleting an Existing note of logged in user


// Deleting an Existing note of logged in user  using: POST "/api/notes/Updatenote" require Auth/login required..........

router.delete('/Deletenote/:id', fetchuser, async (req, res) => {

    try {

        // find the note to be deleted and delete it
        let note = await Note.findById(req.params.id)

        if (!note) {
            res.status(404).send("Not Found")
        }

        // Allow deletion only if user owns this note

        if (note.user.toString() !== req.user.id) {
            res.status(401).send("Not Allowed")
        }

        note = await Note.findByIdAndDelete(req.params.id)

        res.json({ "Success": "Note has been Deleted", note })

    } catch (error) {
        res.status(500).send("Internal Server Error")
    }

})




module.exports = router