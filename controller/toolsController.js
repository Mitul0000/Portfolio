const Tools = require('../models/tools')

exports.getPaidTools = async (request,response)=>{
  try{
    const paidTools = await Tools.find({type:"PAID"})
    return response.status(200).json({
      success:true,
      message:"Paid tool fetched successfully"
    })
  }catch(err){
    return response.status(500).json({
      success:false,
      message:err.message
    })
  }
}

exports.getFreeTools = async (request,response)=>{
  try{
    const freeTools = await Tools.find({type:"FREE"})
    return response.status(200).json({
      success:true,
      message:"Free tool fetched successfully"
    })
  }catch(err){
    return response.status(500).json({
      success:false,
      message:err.message
    })
  }
}