const { Partner } = require("../models/index");
const { User } = require("../models/index");
const { Op } = require('sequelize');
const { 
  getPagination, 
  getPaginationData 
} = require("../utils/paginationHelper");


//GET /api/partners 
exports.getAllPartners = async (req, res) => {
  const { page, size, name } = req.query;
  const condition = name ? { name: {[Op.iLike]: `%${name}%` }} : null;
  const { currentPage, pageSize, offset } = getPagination(page, size);
  try {
    const { count, rows } = await Partner.findAndCountAll({
      where: condition,
      offset,
      limit: pageSize
    });
    
    const response = getPaginationData({ count, rows }, currentPage, pageSize);
    if(response.data.length === 0 && name){
      return res
        .status(404)
        .json({ message: `No partners found with name= "${name}"`});
    }
    res.json(response);
  } catch (error) {
    console.error("Error retrieving partners: ", error);
    res.status(500).json({ message: "Internal server error" })
  }
};

// GET /api/partners/:partnerId
exports.getPartnerById = async (req, res) => {
  try {
    const  partner = await Partner.findByPk(req.params.partnerId);
    if(!partner) {
      return res
        .status(404)
        .json({ msg: `No partner with ID ${req.params.partnerId} was found.`});
    }
    res.json(partner);
  } catch (error) {
    console.error("Error validating partner id: ", error);
    res.status(500).json({ message: "Internal server error"});
  }
};

// POST /api/partners
exports.createPartner = async(req,res)=>{
  try {
    const userId = res.locals.user.uid;
    const { name, description, url,image } = req.body;
    const newPartner = await Partner.create({
      userId,
      name,
      description,
      url,
      image,
    })
    res.status(201).json(newPartner);
  } catch (error) {
    console.error("Error creating a new partner: ", error);
    res.status(500).json({ message:"Internal server error" });
  }
};

// PUT /api/partners/:partnerId
exports.updatePartner = async (req, res) => {
  try {
    const user = await User.findOne({
      where: {email: res.locals.user.email}
    });
    if(user.roleId === 3) {
      return res.status(403).json({ message:'User not authorized' });
    };
    const { name, description, image, url } = req.body;
    const numAffectedRows = await Partner.update({
      name,
      description,
      image,
      url
    },
    {
      where:{ id:req.params.partnerId },
    });
    if(numAffectedRows[0] > 0) {
      const updatedPartner = await Partner.findByPk(req.params.partnerId);
      res.status(200).json(updatedPartner);
    } else {
      res.status(404).json({ message:`No partner with ID ${req.params.partnerId} found` });
    }
  } catch (error) {
    console.error("Error updating partner: ", error);
    res.status(500).json({ message:"Internal Server Error" });
  }
};

// DELETE /api/partners/:partnerId
exports.deletePartner = async  (req, res) => {
  try {
    const user =  await User.findOne({
      where:{ email: res.locals.user.email }
    });
    if(user.roleId === 3) {
      return res.status(403).json({message:" User not authorized"});
    };
    const numPartnersDeleted = await Partner.destroy({ where:{ id:req.params.partnerId } });
    if(numPartnersDeleted) {
      res.status(204).json({message:"Successfully deleted the partner."});
    } else {
      res.status(404).json({message:`No partner with ID ${req.params.partnerId} found`});
    }
  } catch (error) {
    console.error("Error deleting partner: ", error);
    res.status(500).json({message:"Internal server error"});
  }
};
