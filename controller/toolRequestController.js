const ToolRequest = require("../models/toolRequest");
const { sendMail } = require("../utils/sendMail");
require("dotenv");
const toolRequestTemplate = require('../utils/emailTemplates/toolRequestTemplate')

exports.toolRequest = async (request, response) => {
  //This file takes user, name, email,tooldescription and budget from the frontend. Then it saves it to the database and also sends an email to the admin that the website has received on request.

  //There will be a page for the user from where the user can see all the request made by him. And they are also see the status of thier request.

  // There is also a admin message field where while changing the  status the admin can comment something. In default the value is "No comment"

  const { user, name, email, toolDescription, budget } = request.body;

  const userRequest = new ToolRequest({
    createdBy: user._id,
    name,
    email,
    toolDescription,
    budget,
  });

  await userRequest.save();

  const data ={
    name:name,
    email:email,
    toolDescription:toolDescription,
  }

  await sendMail(
    process.env.ADMIN_EMAIL,
    `🛠️ New Tool Request from ${data.name}`,
    toolRequestTemplate(data),
  );

  return response.status(200).json({
    success: true,
    message: "Tool requested successfully",
  });
};

exports.getAllRequest = async (request,response)=>{

  try{
    const {user} = request.body;

    const requestList =await ToolRequest.find({createdBy:user._id});

    return response.status(200).json({
      requests:requestList,
      success:true,
      message:"All request found",
    })
  }catch (err){
    return response.status(500).json({
      success:false,
      message:err.message,
    })
  }
}