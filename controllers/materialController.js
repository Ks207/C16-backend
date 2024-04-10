const { Material } = require("../models/index");
const { Op } = require("sequelize");
const {
  getPagination,
  getPaginationData,
} = require("../utils/paginationHelper");

// GET /api/materials
// /api/materials //return default size 4 materials
// /api/materials?title=some-material-title //return material by title
// /api/materials?page=page-number //return specific page
exports.getAllMaterials = async (req, res) => {
  const { page, size, title } = req.query;
  const condition = title ? { title: { [Op.iLike]: `%${title}%` } } : null;
  const { currentPage, pageSize, offset } = getPagination(page, size);
  try {
    const { count, rows } = await Material.findAndCountAll({
      where: condition,
      offset,
      limit: pageSize,
    });
    const response = getPaginationData({ count, rows }, currentPage, pageSize);
    if (response.data.length === 0 && title) {
      return res
        .status(404)
        .json({ message: `No materials with title=${title} found` });
    }
    res.json(response);
  } catch (error) {
    console.error("Error retrieving materials:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// GET /api/materials/:id
exports.getMaterialsById = async (req, res) => {
  try {
    const material = await Material.findByPk(req.params.id);
    if (material) {
      res.json(material);
    } else {
      res
        .status(404)
        .json({ message: `Material with id=${req.params.id} not found` });
    }
  } catch (error) {
    console.error("Error retrieving material: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// POST /api/materials
exports.createMaterials = async (req, res) => {
  try {
    const userId = res.locals.user.uid
    const { title, description, materialURL, duration, image } = req.body;
    const newMaterial = await Material.create({
      userId,
      title,
      description,
      materialURL,
      duration,
      image
    });
    res.status(201).json(newMaterial);
  } catch (error) {
    console.error("Error creating a new material:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}; 

// PUT /api/materials/:id
exports.updateMaterials = async (req, res) => {
  try {
    const { title, description, materialURL, duration, image } = req.body;
    const numAffectedRows = await Material.update({  
      title, 
      description, 
      materialURL, 
      duration, 
      image 
    },
    { where: { id: req.params.id } }
    );
    if (numAffectedRows[0] > 0) {
      const updatedMaterial = await Material.findByPk(req.params.id);
      res.json(updatedMaterial);
    } else {
      res
        .status(404)
        .json({ message: `Material with id: ${req.params.id} not found` });
    }
  } catch (error) {
    console.error("Error updating material:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// DELETE /api/materials/:id
exports.deleteMaterials = async (req, res) => {
  try {
    const numDeleted = await Material.destroy({ where: { id: req.params.id } });
    if (numDeleted) {
      res.status(204).json({ message: "Material deleted successfully" });
    } else {
      res
        .status(404)
        .json({ message: `Material with id=${req.params.id} not found` });
    }
  } catch (error) {
    console.error("Error deleting Material:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
