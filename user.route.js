const express = require('express');
const User = require('../models/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const tokenMiddleware = require('../middleware/user.middleware')

const router = express.Router();

router.post('/create-user', async(req, res)=>{
	const {name, email, password} = req.body;

	const hashedPassword = await bcrypt.hash(password, 10);
	const newUser = new User({
		name,
		email,
		password: hashedPassword
	});
	await newUser.save().then(()=>{
		return res.status(201).json({message: "User created successfully!!", user:newUser})
	}).catch((err)=>{
		return res.status(500).json({message: "ERROR : SERVER NOT FOUND", error:err.message})
	})
});

router.post('/login-user', async(req, res)=>{
	try{
		const {email, password} = req.body;

    const user = await User.findOne({email});

	  if(!user){
			return res.status(404).json({message:"User with this email is not found!"})
	  }

		const validPassword = await bcrypt.compare(password, user.password);

	  if(!validPassword){
		  return res.status(400).json({message: "Incorrect Password!!"})
	  }

		const tokenData = {
			id: user._id,
			email: user.email
    };
		const token = jwt.sign
		(tokenData, process.env.JWT_SECRET_KEY, {expiresIn: "1d"});
	  return res.status(200).json({message:"Login successfully!!", user, token})
  }
	catch(err){
		return res.status(500).json({message:"Server not found", error:err.message})
	}
});

router.get('/get-userID/:id', tokenMiddleware,  async(req, res)=>{
	try{
		const userID = req.params.id;
	  const getUser = await User.findOne({_id:userID});
	  return res.status(200).json({message:"User by ID : ", getUser})
	}
	catch(err){
		return res.status(500).json({message: "Server error", error: err.message})
	}
});

router.get('/get-user', async(req, res)=>{
	const userList = await User.find();
	return res.status(200).json({message: "Users list: ", userList})
});

// router.get('/get-userID/:id', async(req, res)=>{
// 	try{
// 		const userID = req.params.id;
// 	  const getUser = await User.findOne({_id:userID});
// 	  return res.status(200).json({message:"User by ID : ", getUser})
// 	}
// 	catch(err){
// 		return res.status(500).json({message: "Server error", error: err.message})
// 	}
	
// })

router.patch('/update-user/:id', tokenMiddleware, async(req, res)=>{
	try{
		const userID = req.params.id;
	const {name, email, password} = req.body;
	const updateobj = {
		name, 
		email
	}
	if(password){
		const hashPassword = await bcrypt.hash(password, 10);
		updateobj.password = hashPassword;
	}
	const updateUser = await User.updateOne({_id:userID}, updateobj);
	return res.status(200).json({message:"User update successfully!!", id: userID, updateUser})
	}
	catch(err){
	return res.status(500).json({message: "Server not found", error: err.message})
};
})

router.delete('/delete-user/:id', tokenMiddleware, async(req, res)=>{
	try{
		const userID = req.params.id;
	  const deluser = await User.deleteOne({_id:userID})
	  return res.status(200).json({message:"User deleted successfully!!", deluser})
	}
	catch(err){
		return res.status(500).json({message:"Server not found"})
	}
});





module.exports = router;




//manju = 12345
//karwasra = 123456 