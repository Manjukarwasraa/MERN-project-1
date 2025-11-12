const express = require('express');

const dotenv = require('dotenv');
dotenv.config();

const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URL).then(()=>{
	console.log("Database is connected")
}).catch((err)=>{
	console.log("Error", err.message)
})

const app = express();
app.use(express.json());

const User = require('./models/user.model')

//api

const userRouter = require('./routes/user.route')

const sessionRouter = require('./routes/session.route')

app.use('/api/User', userRouter );

app.use('/api/session', sessionRouter);


app.listen(5000, ()=>{
	console.log("Server is connected")
});


//ptmY4LvlWEdfybuc

// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9eyJpZCI6IjY5MGNiOTFiZDU2ZmRmZTkwMDVkNjIxMSIsImVtYWlsIjoia2RpcGVzaEBnbWFpbC5jb20iLCpYXQiOjE3NjI1MTMyMjQsImV4cCI6MTc2MjU5OTYyNH0.m1m-NSSgLk_m9REdwxmcqyja-1nNU85qQ-OuluDLjMw
