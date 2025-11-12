const jwt = require('jsonwebtoken');

const sessionMiddleware = async(req, res,next)=>{
	const token = req.headers.authorization;

	if(!token){
		return res.status(500).json({message:"Please enter a token"});
	}

	try{
		const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
		req.userId = decoded.id;
		next();
	}
	catch(err){
		return res.status(500).json({message:"Server not found"})
	}
}

module.exports = sessionMiddleware;