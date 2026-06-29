//External modules
const express = require('express');
const { isAuth } = require('../middleware/isAuth');

//Internal modules
const {getComment,postComment} = require('../controller/commentController')


const commentRoutes = express.Router();

//public routes
commentRoutes.get('/get:blogId',getComment);

//private routes
commentRoutes.post('/post',isAuth,postComment);


module.exports = commentRoutes;
