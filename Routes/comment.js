const fetchuser = require("../middleware/fetchuser")
const express = require('express');
const Comment = require('../models/Comment');
const router = express.Router();
const User = require('../models/User')

router.post('/Addcomment', fetchuser, async (req, res) => {

    // const { name,comment } = req.body;
    try 
    {
        const curr_user = await User.findById(req.user.id)

        // newcomment = Comment.create({...req.body,name:name.name1,user:req.user.id})
        newcomment = new Comment({...req.body,name:curr_user.name1,user:req.user.id})
        newcomment.save()
        res.json({newcomment,msg:"Comment added successfully"})

    } 
    
    catch (error) {
            res.status(500).send({"error":error.message})
    }
})

router.get('/fetchallComments', async (req, res) => {

    // const { name,comment } = req.body;
    try 
    {
       const allcomments = await Comment.find({});
       res.send(allcomments)

    } 
    catch (error) {
            res.status(500).send({"error":error.message})
    }
})

router.delete('/DeleteComment/:id', async (req, res) => {

    try {

        // find the note to be deleted and delete it
        let comment = await Comment.findById(req.params.id);

        comment = await Comment.findByIdAndDelete(req.params.id)

        res.json({ "Success": "Note has been Deleted", comment })

    } catch (error) {
        res.status(500).send("Internal Server Error")
    }

})


router.put('/Like/:id',fetchuser  ,async (req,res) =>{
    try 
    {
        // if user id present in dislike array then removing userid from dislike array before adding in to like array..
        
        comm = await Comment.findByIdAndUpdate(req.params.id,{$pull: {DislikeArr:req.user.id}})
        
        let comment_by_id = await Comment.findById(req.params.id) //// uc .... {user comment}
        
        if(comment_by_id.likeArr.includes(req.user.id)){

            // if userid present in like array then removing user from like array... 
            
            comm = await Comment.findByIdAndUpdate(req.params.id,{$pull : {likeArr:req.user.id}})
            
        }
        else{

            // adding userid on like array....

            comm = await Comment.findByIdAndUpdate(req.params.id,{$addToSet : {likeArr:req.user.id}}) 
            
        }
        
        
        comm.save();

        res.json({"msg":"liked.."})

    }
     catch (error) {
        res.send({error:error.message})
        res.status(500).send("Internal server error")
    }
})



router.put('/DisLike/:id',fetchuser ,async (req,res) =>{
    try 
    {

        // if user id present in like array then removing userid from like array before adding in to dislike array..

        let comment_by_id = await Comment.findById(req.params.id)

        comm = await Comment.findByIdAndUpdate(req.params.id,{$pull : {likeArr:req.user.id}})

        if(comment_by_id.DislikeArr.includes(req.user.id)){

          // if userid present in dislike array then removing user from dislike array... 

          comm = await Comment.findByIdAndUpdate(req.params.id,{$pull : {DislikeArr:req.user.id}})

        }
        else{
            // adding userid on like array....
            
            comm = await Comment.findByIdAndUpdate(req.params.id,{$addToSet : {DislikeArr:req.user.id}})
        }


        comm.save();

        res.json({"msg":"Disliked.."})

    }
     catch (error) {
        res.send({error:error.message})
        res.status(500).send("Internal server error")
    }
})

router.put('/Reply/:id',fetchuser,async (req,res) =>{
    try {
        const {reply} = req.body;
        
        const user = await User.findById(req.user.id);

        const Unique_rep_key = Math.random() * 10 +  1;

        const comm = await Comment.findByIdAndUpdate(req.params.id,{$push:{ReplyArr:{user:user.name1,reply:reply,rep_id:Unique_rep_key}}})

        comm.save();

        res.json({"msg":"Reply Added"})
        
    } catch (error) {
        res.status(500).send({"Error":"Network issue"})
    }
})


router.put('/Del_rep/:id',async (req,res) =>{
    try {

        const {reply,rep_id} = req.body;

        console.log(rep_id)

        // deleting reply of logged in user only with unique reply id...

        const comm = await Comment.findByIdAndUpdate(req.params.id,{$pull:{ ReplyArr : {rep_id}}})

        comm.save();

        res.json({"msg":"Reply delted Successfully!,"});


    } catch (error) {
        res.status(500).json({"Error":"Network issue"});
    }
})
module.exports = router
