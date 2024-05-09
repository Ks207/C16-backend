const { Material } = require("../models/index");
const { User } = require("../models/index");
const { Op, Sequelize } = require("sequelize");
const {
  getPagination,
  getPaginationData,
} = require("../utils/paginationHelper");
const { getId } = require("../utils/youtubeHelper");

// GET /api/materials
// /api/materials //return default size 4 materials
// /api/materials?title=some-material-title //return material by title
// /api/materials?page=page-number //return specific page
  exports.getAllMaterials = async (req, res) => {
     const { page, size } = req.query;
     const searchTerm = req.query.search || "";
     const { currentPage, pageSize, offset } = getPagination(page, size);
     try {
       const { count, rows } = await Material.findAndCountAll({
         include: [{
           model: User,
           attributes: []
         }],
         attributes: {
           include: [
             [Sequelize.fn('concat', Sequelize.col('User.firstname'), ' ', Sequelize.col('User.lastname')), 'author']
           ]
         },
         where: {
           [Op.or]: [
             { title: { [Op.iLike]: `%${searchTerm}%` } },
             { description: { [Op.iLike]: `%${searchTerm}%` } },
           ]
         },
         offset,
         limit: pageSize,
         order: [["createdAt", "DESC"]],
       });
       const response = getPaginationData({ count, rows }, currentPage, pageSize);
       res.json(response);
     } catch (error) {
       console.error("Error obteniendo materiales:", error);
       res.status(500).json({ error: "Error interno del servidor" });
     }
   };

// GET /api/materials/:id
exports.getMaterialsById = async (req, res) => {
     try {
       const material = await Material.findByPk(req.params.id, {
         include: [{
           model: User,
           attributes: []
         }],
         attributes: {
           include: [
             [Sequelize.fn('concat', Sequelize.col('User.firstname'), ' ', Sequelize.col('User.lastname')), 'author']
           ]
         }
       });
       if (material) {
         res.json(material);
       } else {
         res.status(404).json({ message: `Material con id=${req.params.id} no encontrado` });
       }
     } catch (error) {
       console.error("Error obteniendo material: ", error);
       res.status(500).json({ error: "Error interno del servidor" });
     }
   };

// POST /api/materials
exports.createMaterials = async (req, res) => {
  try {
    const userId = res.locals.user.uid;
    const { title, description, materialURL, duration } = req.body;

    const myId = getId(materialURL);
    if (myId === "error") {
      return res.status(400).json({ error: "URL de YouTube no válida" });
    }

    const embedUrl = `https://www.youtube.com/embed/${myId}`;
    const imageUrl = `https://img.youtube.com/vi/${myId}/0.jpg`;

    const newMaterial = await Material.create({
      userId,
      title,
      description,
      materialURL: embedUrl,
      duration,
      image: imageUrl,
    });
    res.status(201).json(newMaterial);
  } catch (error) {
    console.error("Error creando material:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// PUT /api/materials/:id
exports.updateMaterials = async (req, res) => {
  try {
    const user = await User.findOne({
      where: { email: res.locals.user.email },
    });

    if (user.roleId === 3) {
      return res.status(403).json({ message: "Acceso denegado." });
    }

    const material = await Material.findByPk(req.params.id);
    if (!material) {
      return res
        .status(404)
        .json({ message: `Material con id: ${req.params.id} no encontrado` });
    }

    const { title, description, materialURL, duration } = req.body;

    let myId = materialURL ? getId(materialURL) : null;
    if (materialURL && myId === "error") {
      return res.status(400).json({ error: "URL de YouTube no válida" });
    }

    const embedUrl = materialURL
      ? `https://www.youtube.com/embed/${myId}`
      : material.materialURL;
    const imageUrl = materialURL
      ? `https://img.youtube.com/vi/${myId}/0.jpg`
      : material.image;

    const updatedData = {
      title: title || material.title,
      description: description || material.description,
      materialURL: embedUrl,
      duration: duration || material.duration,
      image: imageUrl,
    };

    const numAffectedRows = await Material.update(updatedData, {
      where: { id: req.params.id },
    });
    if (numAffectedRows[0] > 0) {
      const updatedMaterial = await Material.findByPk(req.params.id);
      res.json(updatedMaterial);
    } else {
      res
        .status(404)
        .json({ message: `Material con id: ${req.params.id} no encontrado` });
    }
  } catch (error) {
    console.error("Error actualizando material:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// DELETE /api/materials/:id
exports.deleteMaterials = async (req, res) => {
  try {
    const user = await User.findOne({
      where: { email: res.locals.user.email },
    });

    if (user.roleId === 3) {
      return res.status(403).json({ message: "Acceso denegado." });
    }

    const numDeleted = await Material.destroy({ where: { id: req.params.id } });
    if (numDeleted) {
      res.status(204).json({ message: "Material borrado correctamente" });
    } else {
      res
        .status(404)
        .json({ message: `Material con id=${req.params.id} no encontrado` });
    }
  } catch (error) {
    console.error("Error eliminando material:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};
