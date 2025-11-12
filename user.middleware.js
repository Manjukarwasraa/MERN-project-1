const User = require('../models/user.model');
const jwt = require('jsonwebtoken')

const tokenMiddleware = async(req, res, next)=>{
	const token = req.headers.authorization;


	if(!token){
		return res.status(500).json({message:"Please enter a token: "})
	}

	try{
		const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
	  req.User = decoded;

	  next();
	}
	catch(err){
		return res.status(500).json({message: "Invaild token!!!", error : err.message})
	}
	

}

module.exports = tokenMiddleware;

