const express = require('express');

const Session = require('../models/session.model');

const router = express.Router();

const sessionMiddleware = require('../middleware/session.middleware');


/**Create Session API*/
router.post('/create-session', sessionMiddleware, async(req, res)=>{
	try{
		const {title, description, category, mentor, date} = req.body;

	  const newSession = new Session({
			title, 
		  description,
		  category, 
		  mentor, 
		  date,
			userId: req.userId
	  });
	  await newSession.save().then(()=>{
			return res.status(200).json({message: "Session post successfully!!", newSession})
	  })
	}
	catch(err){
		return res.status(500).json({message: "Server not found", error:err.message})
	}
	
});


/**Get All Session API*/
router.get('/get-session', async(req, res)=>{
	try{
		const sessionID = req.params.id;
		const getSession = await Session.findById({sessionID});
		return res.status(200).json({message: "Session list", getSession})
	}
	catch(err){
		return res.status(500).json({message: "All session", error: err.message})
	}
});


/**Get By ID Session API*/
router.get('/get-session/:id', sessionMiddleware, async(req, res)=>{
	try{
		const sessionID = req.params.id;
		const getSession = await Session.findOne({_id:sessionID, userId: req.userId});
		if(!getSession) return res.status(404).json({message:"Session not found"})
		return res.status(200).json({message: "This is the session", id:sessionID, getSession})
	}
	catch(err){
		return res.status(500).json({message: "Server not found"});
	}
});


/**Update Session API*/
router.patch('/update-session/:id', sessionMiddleware, async(req, res)=>{
	try{
		const sessionID = req.params.id;
		const {title, description, category, mentor, date} = req.body;

		const updateObj = {
			title,
			description,
			category,
			mentor,
			date
		}
		const update = await Session.findOneAndUpdate({_id:sessionID, userId:req.userId}, updateObj, {new:true})
		
		if(!update) return res.status(404).json({message:"Session not found"});

		return res.status(200).json({message:"Session updated successfully", update})
	}
	catch(err){
		return res.status(500).json({message:"Server not found"})
	}
});


/**Delete Session API*/
router.delete('/delete-session/:id', sessionMiddleware, async(req, res)=>{
	try{
		const sessionID = req.params.id;
		const delsession = await Session.deleteOne({_id:sessionID, userId: req.userId});

		if(!delsession) return res.status(404).json({message:"Session not found"});

		return res.status(200).json({message: "Session deleted successfully!!", delsession})
	}
	catch(err){
		return res.status(500).json({message:"Server not found", error:err.message})
	}
});
	

/**Join Session API*/
router.patch('/join-session/:id', sessionMiddleware, async(req, res)=>{
	try{
		const sessionID = req.params.id;
		const userId = req.userId;

		//$addToSet => add only those are not already joined
		const sessionUpdate = await Session.findByIdAndUpdate(sessionID, {$addToSet:{students:userId}},{new:true});
		if(!sessionUpdate){
			return res.status(404).json({message:"Session not found"});
		}
		return res.status(200).json({message:"Joined session successfully!!"});
	}
	catch(err){
		return res.status(500).json({message:"Server not found", error:err.message});
	}
});


/**Leave Session API*/
router.patch('/leave-session/:id', sessionMiddleware, async(req, res)=>{
	try{
		const sessionID = req.params.id;
	  const userId = req.userId;

	  const leaveSession = await Session.findByIdAndUpdate(sessionID, {$pull:{students:userId}},{new:true});
	  //$pull => emoove if user exits

	  if(!leaveSession){
			return res.status(404).json({message:"Session not found"});
	  }
	  return res.status(200).json({message: "Session leave successfully!!"});

	}
	catch(err){
		return res.status(500).json({message:"Server not found"});
	}
});


/**Get Joined Session API*/
router.get('/joined-session', sessionMiddleware, async(req, res)=>{
	try{
	  const userId = req.userId;

	  const joinedSession = await Session.find({students: userId});

	  return res.status(200).json({message:"Session you joined", joinedSession});
	}
	catch(err){
		return res.status(500).json({message:"Server not found"});
	}
	
});


/**Get My Session API*/
router.get('/mySession/:id', sessionMiddleware, async(req, res)=>{
	try{
		const sessionID = req.params.id;
		const mySession = await Session.find({userId : req.userId});
		return res.status(200).json({message:"My session", mySession})
	}
	catch(err){
		return res.status(500).json({message:"Server not found", error:err.message});
	}
});



/**Update Status of Session API*/
router.patch('/update-status/:id', sessionMiddleware, async(req, res)=>{
	try{
		const sessionID = req.params.id;
		const userId = req.userId;

		const {status} = req.body;

		//includes => it is a js function that check wether the value exit in array or string 
		const vaild = ["Scheduled", "Completed", "Cancelled"];
		if(!vaild.includes(status)){
			return res.status(404).json({message: "Invalid status value"})
		}

		const update = await Session.findByIdAndUpdate({_id:sessionID, userId}, {status}, {new:true});
		if(!update){
			return res.status(404).json({message:"Session not found"})
		}
		return res.status(200).json({message:"Status updated!!"});
	}
	catch(err){
		return res.status(500).json({message:"Server not found", error:err.message})
	}
});


module.exports = router;



