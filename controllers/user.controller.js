const uuid = require('uuid');
const models = require('../models')
const responseData = {
	status: true,
	message: "Completed",
	data: null
}

const createSHFAccount = async (req,res) =>{
  const data = req.body;
  const user = req.user;
  const isAdmin = await models.admin.findOne(
    {
      where:{
        id:user.id
      }
    }
  );
  if(isAdmin){
    const createFarmer = await models.farmer.create(
      {
        id:uuid.v4(),
        photoId:req.file
      }
    )
  }
}

const updateSHFAccount = async (req,res)=>{

}

const deleteSHFAccount = async (req,res)=>{

}

const getSHFAccount = async (req,res)=>{

}

module.exports = {
  createSHFAccount,
  updateSHFAccount,
  deleteSHFAccount,
  getSHFAccount
}