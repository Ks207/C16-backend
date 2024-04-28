const { Partner } = require("../models/index");
const { User } = require("../models/index");
const { Op } = require('sequelize');
const validateUrl = require("../utils/validateUrl")
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
        .json({ message: `No partners encontrados con el nombre = "${name}"`});
    }
    res.json(response);
  } catch (error) {
    console.error("Error obteniendo partners: ", error);
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
        .json({ msg: `No partner con ID ${req.params.partnerId} fue encontrado.`});
    }
    res.json(partner);
  } catch (error) {
    console.error("Error obteniendo partner: ", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

// POST /api/partners
exports.createPartner = async(req,res)=>{
  try {
    const partnerUrl = validateUrl(req.body.url);
    if(!partnerUrl) return res.status(400).json({ message: "URL invalida" });
    
    const userId = res.locals.user.uid;
    const { name, description, image } = req.body;
    const newPartner = await Partner.create({
      userId,
      name,
      description,
      url: partnerUrl,
      image
    })
    res.status(201).json(newPartner);
  } catch (error) {
    console.error("Error creando partner: ", error);
    res.status(500).json({ message:"Error interno del servidor" });
  }
};

// PUT /api/partners/:partnerId
exports.updatePartner = async (req, res) => {
  try {
    const partnerUrl = validateUrl(req.body.url);
    if(!partnerUrl) return res.status(400).json({ message: "URL invalida" });

    const user = await User.findOne({
      where: {email: res.locals.user.email}
    });
    if(user.roleId === 3) {
      return res.status(403).json({ message:'Usuario no autorizado' });
    };
    const { name, description, image } = req.body;
    const numAffectedRows = await Partner.update({
      name,
      description,
      image,
      url: partnerUrl
    },
    {
      where:{ id:req.params.partnerId },
    });
    if(numAffectedRows[0] > 0) {
      const updatedPartner = await Partner.findByPk(req.params.partnerId);
      res.status(200).json(updatedPartner);
    } else {
      res.status(404).json({ message:`No partner con ID ${req.params.partnerId} fue encontrado` });
    }
  } catch (error) {
    console.error("Error actualizando partner: ", error);
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
      return res.status(403).json({message:"Acceso denegado."});
    };
    const numPartnersDeleted = await Partner.destroy({ where:{ id:req.params.partnerId } });
    if(numPartnersDeleted) {
      res.status(204).json({message:"Partner fue eliminado."});
    } else {
      res.status(404).json({message:`No partner con ID ${req.params.partnerId} fue encontrado`});
    }
  } catch (error) {
    console.error("Error eliminando partner: ", error);
    res.status(500).json({message:"Error interno del servidor"});
  }
};
