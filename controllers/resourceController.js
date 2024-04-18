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
    const comunaFilter = req.query.comuna || "";

    const { count, rows } = await Resource.findAndCountAll({
      where: {
        ...(comunaFilter && { comuna: { [Op.iLike]: `%${comunaFilter}%` } }),
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
    console.error("Error retrieving resources:", error);
    res.status(500).json({ error: "Internal server error" });
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
        .json({ message: `Resource with id=${req.params.id} not found` });
    }
  } catch (error) {
    console.error("Error retrieving resource:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// POST /api/resources
exports.createResource = async (req, res) => {
  try {
    const userId = res.locals.user.uid;
    const { description, comuna, url, highlighted } = req.body;
    let imageUrl = '';
    if (req.file) {
      imageUrl = await uploadImage(req.file.buffer, req.file.originalname, userId);
    }
    const newResource = await Resource.create({
      userId,
      description,
      comuna,
      url,
      image: imageUrl,
      highlighted,
    });
    res.status(201).json(newResource);
  } catch (error) {
    console.error("Error creating resource:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// PUT /api/resources/:id
exports.updateResource = async (req, res) => {
  try {
    const user = await User.findOne({
      where: { email: res.locals.user.email },
    });

    if (user.roleId === 3) {
      return res.status(403).json({ message: "User not authorized." });
    }

    const userId = res.locals.user.uid;
    const { description, comuna, url, highlighted } = req.body;
    let imageUrl = req.body.image;

    if (req.file) {
      const resourceToUpdate = await Resource.findByPk(req.params.id);
      if (resourceToUpdate) {
        try {
          await deleteImage(resourceToUpdate.image);
        } catch (error) {
          console.log("Failed to delete image");
        }
        imageUrl = await uploadImage(req.file.buffer, req.file.originalname, userId);
      }
    }

    const numAffectedRows = await Resource.update(
      { description, comuna, image: imageUrl, url, highlighted },
      { where: { id: req.params.id } }
    );

    if (numAffectedRows[0] > 0) {
      const updatedResource = await Resource.findByPk(req.params.id);
      res.json(updatedResource);
    } else {
      res.status(404).json({ message: `Resource with id=${req.params.id} not found` });
    }
  } catch (error) {
    console.error("Error updating resource:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// DELETE /api/resources/:id
exports.deleteResource = async (req, res) => {
  try {
    const user = await User.findOne({
      where: { email: res.locals.user.email },
    });

    if(user.roleId === 3) {
      return res.status(403).json({ message: "User not authorized." });
    }

    const resource = await Resource.findByPk(req.params.id);
    if (!resource) {
      return res.status(404).json({ message: `Resource with id=${req.params.id} not found` });
    }

    if (resource.image) {
      try {
        await deleteImage(resource.image);
      } catch (error) {
        console.log("Failed to delete image");
      }
    }

    const numDeleted = await Resource.destroy({ where: { id: req.params.id } });
    if (numDeleted) {
      res.status(204).json({ message: "Resource deleted successfully" });
    } else {
      res.status(404).json({ message: `Resource with id=${req.params.id} not found` });
    }
  } catch (error) {
    console.error("Error deleting resource:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
