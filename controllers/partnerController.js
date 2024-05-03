const { Partner } = require("../models/index");
const { User } = require("../models/index");
const { Op } = require('sequelize');
const validateUrl = require("../utils/validateUrl");
const { uploadImage, deleteImage } = require("../utils/imageHelper");
const { 
  getPagination, 
  getPaginationData 
} = require("../utils/paginationHelper");



//GET /api/partners 
exports.getAllPartners = async (req, res) => {
  const { page, size } = req.query;
  const searchTerm = req.query.search || "";
  const { currentPage, pageSize, offset } = getPagination(page, size);
  try {
    const { count, rows } = await Partner.findAndCountAll({
      where: {
        [Op.or]: [
          { name: { [Op.iLike]: `%${searchTerm}%` } },
          { description: { [Op.iLike]: `*${searchTerm}*` } }
        ]
      },
      offset,
      limit: pageSize,
      order: [["createdAt", "DESC"]],    
    });    
    const response = getPaginationData({ count, rows }, currentPage, pageSize);
    res.json(response);
  } catch (error) {
    console.error("Error retrieving partners: ", error);
    res.status(500).json({ message: "Error interno del servidor" })
  }
};

// GET /api/partners/:partnerId
exports.getPartnerById = async (req, res) => {
  try {
    const  partner = await Partner.findByPk(req.params.partnerId);
    if(!partner) {
      return res
        .status(404)
        .json({ msg: `No se encontro colaborador con el ID ${req.params.partnerId}`});
    }
    res.json(partner);
  } catch (error) {
    console.error("Error validating partner id: ", error);
    res.status(500).json({ message: "Error interno del servidor"});
  }
};

// POST /api/partners
exports.createPartner = async(req,res)=>{
  try {
    const partnerUrl = validateUrl(req.body.url);
    if(!partnerUrl) return res.status(400).json({ message: "Url invalida. Incluir http:// o https://" });
    
    const user = await User.findOne({
      where: {email: res.locals.user.email}
    });

    const userId = res.locals.user.uid;
    
    if(user.roleId === 3) {
      return res.status(403).json({ message:'Usuario no Autorizado' });
    };

    const { name, description } = req.body;
    let imageUrl = "";
    if(req.file){
      imageUrl = await uploadImage(req.file.buffer, req.file.originalname, userId);
    }
    const newPartner = await Partner.create({
      userId,
      name,
      description,
      url: partnerUrl,
      image: imageUrl,
    })
    res.status(201).json(newPartner);
  } catch (error) {
    console.error("Error creating a new partner: ", error);
    res.status(500).json({ message:"Error interno del servidor" });
  }
};

// PUT /api/partners/:partnerId
exports.updatePartner = async (req, res) => {
  try {
    const partnerUrl = validateUrl(req.body.url);
    if(!partnerUrl) return res.status(400).json({ message: "Url invalida. Incluir http:// o https://" });

    const user = await User.findOne({
      where: {email: res.locals.user.email}
    });

    if(user.roleId === 3) {
      return res.status(403).json({ message:'Usuario no Autorizado' });
    };

    const userId = res.locals.user.uid;
    const { name, description } = req.body;
    let imageUrl = req.body.image;
    
    if(req.file) {
      const partnerToUpdate = await  Partner.findByPk(req.params.partnerId);
      if(partnerToUpdate) {
        try {
          await deleteImage(partnerToUpdate.image);
        } catch (error) {
          console.log("Error deleting Image");
        }
        imageUrl = await uploadImage(req.file.buffer, req.file.originalname, userId);
      }
    }
    const numAffectedRows = await Partner.update(
      { name, description, image: imageUrl, url: partnerUrl },
      { where:{ id:req.params.partnerId }}
    );

    if(numAffectedRows[0] > 0) {
      const updatedPartner = await Partner.findByPk(req.params.partnerId);
      res.status(200).json(updatedPartner);
    } else {
      res.status(404).json({ message:`No se encontro colaborador con el ID ${req.params.partnerId}` });
    }
  } catch (error) {
    console.error("Error updating partner: ", error);
    res.status(500).json({ message:"Error interno del servidor" });
  }
};

// DELETE /api/partners/:partnerId
exports.deletePartner = async  (req, res) => {
  try {
    const user =  await User.findOne({
      where:{ email: res.locals.user.email }
    });

    if(user.roleId === 3) {
      return res.status(403).json({message:" Usuario no Autorizado"});
    };

    const partner = await Partner.findByPk(req.params.partnerId);
    if(!partner){
      return res.status(404).json({message:`No se encontro colaborador con el ID ${req.params.partnerId}`});
    }

    if(partner.image) {
      try {
        await deleteImage(partner.image);
      } catch (error) {
        console.log("Error deleting image");
      }
    }
    const numPartnersDeleted = await Partner.destroy({ where:{ id:req.params.partnerId } });
    if(numPartnersDeleted) {
      res.status(204).json({message:`Colaborador con el ID ${req.params.partnerId} fue eliminado con exito`});
    } else {
      res.status(404).json({message:`No se encontro colaborador con el ID ${req.params.partnerId}`});
    }
  } catch (error) {
    console.error("Error deleting partner: ", error);
    res.status(500).json({message:"Error interno del servidor"});
  }
};
