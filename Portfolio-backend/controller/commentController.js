const Comment = require('../models/comment')

exports.postComment = async (request,response) => {
  try{
    const {user,blogId,content} = request.body;
    const comment = new Comment({
      blogId:blogId,
      userId:user._id,
      content:content
    })
    await comment.save()
    return response.status(200).json({
      success:true,
      message:"Comment successfull"
    })
  } catch(err){
    return response.status(500).json({
      success:true,
      message:err.message
    })
  }
}

exports.getComment = async (request,response) =>{
  try{
    const {blogId} = request.params;
    const foundComments = await Comment.find({blogId:blogId}).populate("userId","firstName lastName -_id");

    return response.status(200).json({
      comments:foundComments,
      success:true,
      message:"All Comments fetched successfully."
    })

  }catch (err){
    return response.status(500).json({
      success:true,
      message:err.message
    })
  }
}