//External modules
const express = require('express');
const { isAuth } = require('../middleware/isAuth');

//Internal modules
const {getComment,postCommnet} = require('../controller/commentController')


const commentRoutes = express.Router();

//public routes
commentRoutes.get('/get:blogId',getComment);

//private routes
commentRoutes.post('/post',isAuth,postCommnet);


module.exports = commentRoutes;
