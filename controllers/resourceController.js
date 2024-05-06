const { Resource } = require("../models/index");
const { User } = require("../models/index");
const {
  getPagination,
  getPaginationData,
} = require("../utils/paginationHelper");
const { Op } = require("sequelize");
const { uploadImage, deleteImage } = require('../utils/imageHelper');

// GET /api/resources
exports.getAllResources = async (req, res) => {
  try {
    const { currentPage, pageSize, offset } = getPagination(
      req.query.page,
      req.query.limit
    );
    const searchTerm = req.query.search || "";
    const comunaFilter = req.query.comuna || "";
    const titleFilter = req.query.title || "";

    const { count, rows } = await Resource.findAndCountAll({
      where: {
        ...(searchTerm && { description: { [Op.iLike]: `%${searchTerm}%` } }),
        ...(comunaFilter && { comuna: { [Op.iLike]: comunaFilter } }),
        ...(titleFilter && { title: { [Op.iLike]: `%${titleFilter}%` } }),
      },
      offset,
      limit: pageSize,
      order: [
        ['highlighted', 'DESC'],
        ['createdAt', 'DESC']
      ]
    });
    const response = getPaginationData({ count, rows }, currentPage, pageSize);
    res.json(response);
  } catch (error) {
    console.error("Error obteniendo recursos:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// GET /api/resources/:id
exports.getResourceById = async (req, res) => {
  try {
    const resource = await Resource.findByPk(req.params.id);
    if (resource) {
      res.json(resource);
    } else {
      res
        .status(404)
        .json({ message: `Recurso con id=${req.params.id} no encontrado` });
    }
  } catch (error) {
    console.error("Error obteniendo recursos:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// POST /api/resources
exports.createResource = async (req, res) => {
  try {
    const userId = res.locals.user.uid;
    const { description, comuna, url, highlighted, title } = req.body;
    let imageUrl = '';
    if (req.file) {
      imageUrl = await uploadImage(req.file.buffer, req.file.originalname, userId);
    }

    if (highlighted) {
      await Resource.update({ highlighted: false }, { where: { highlighted: true } });
    }

    const newResource = await Resource.create({
      userId,
      description,
      comuna,
      url,
      image: imageUrl,
      highlighted,
      title,
    });
    res.status(201).json(newResource);
  } catch (error) {
    console.error("Error creando recurso:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// PUT /api/resources/:id
exports.updateResource = async (req, res) => {
  try {
    const user = await User.findOne({
      where: { email: res.locals.user.email },
    });

    if (user.roleId === 3) {
      return res.status(403).json({ message: "User no autorizado." });
    }

    const userId = res.locals.user.uid;
    const { description, comuna, url, highlighted, title } = req.body;
    let imageUrl = req.body.image;

    if (req.file) {
      const resourceToUpdate = await Resource.findByPk(req.params.id);
      if (resourceToUpdate) {
        try {
          await deleteImage(resourceToUpdate.image);
        } catch (error) {
          console.log("Ocurrio un error al borrar la imagen:", error);
        }
        imageUrl = await uploadImage(req.file.buffer, req.file.originalname, userId);
      }
    }

    if (highlighted) {
      await Resource.update({ highlighted: false }, { where: { highlighted: true } });
    }

    const numAffectedRows = await Resource.update(
      { description, comuna, image: imageUrl, url, highlighted, title },
      { where: { id: req.params.id } }
    );

    if (numAffectedRows[0] > 0) {
      const updatedResource = await Resource.findByPk(req.params.id);
      res.json(updatedResource);
    } else {
      res.status(404).json({ message: `Recurso con id=${req.params.id} no encontrado` });
    }
  } catch (error) {
    console.error("Error actualizando recurso:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// DELETE /api/resources/:id
exports.deleteResource = async (req, res) => {
  try {
    const user = await User.findOne({
      where: { email: res.locals.user.email },
    });

    if(user.roleId === 3) {
      return res.status(403).json({ message: "User no autorizado" });
    }

    const resource = await Resource.findByPk(req.params.id);
    if (!resource) {
      return res.status(404).json({ message: `Resource con id=${req.params.id} no encontrado` });
    }

    if (resource.image) {
      try {
        await deleteImage(resource.image);
      } catch (error) {
        console.log("Ocurrio un error al borrar la imagen:", error);
      }
    }

    const numDeleted = await Resource.destroy({ where: { id: req.params.id } });
    if (numDeleted) {
      res.status(204).json({ message: "Recurso eliminado correctamente" });
    } else {
      res.status(404).json({ message: `Resource con id=${req.params.id} no encontrado` });
    }
  } catch (error) {
    console.error("Error eliminando recurso:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};
