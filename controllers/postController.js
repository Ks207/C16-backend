const { Post, User, Like } = require("../models/index");
const {
  getPagination,
  getPaginationData,
} = require("../utils/paginationHelper");
const { Op } = require("sequelize");

// GET /api/posts
exports.getAllPosts = async (req, res) => {
  try {
    const { currentPage, pageSize, offset } = getPagination(
      req.query.page,
      req.query.limit
    );
    const searchTerm = req.query.search || "";
    const comunaFilter = req.query.comuna || "";
    const userId = req.query.userId || "";

    const { count, rows } = await Post.findAndCountAll({
      include: [
        {
          model: User,
          as: "user",
          attributes: ["firstname", "lastname", "photo", "region", "comuna"],
        },
      ],
      offset,
      limit: pageSize,
      where: {
        content: { [Op.iLike]: `%${searchTerm}%` },
        active: true,
        parentId: null,
        ...(comunaFilter && {
          "$user.comuna$": { [Op.iLike]: comunaFilter },
        }),
        ...(userId && { userId: userId }),
      },
      order: [["createdAt", "DESC"]],
    });
    const response = getPaginationData({ count, rows }, currentPage, pageSize);
    res.json(response);
  } catch (error) {
    console.error("Error obteniendo posts:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// GET /api/posts/:id
exports.getPostById = async (req, res) => {
  try {
    const post = await Post.findByPk(req.params.id, {
      include: [
        {
          model: User,
          attributes: ["firstname", "lastname", "photo", "region", "comuna"],
          as: "user",
        },
      ],
    });
    if (post) {
      const { currentPage, pageSize, offset } = getPagination(
        req.query.page,
        req.query.limit
      );
      const { count, rows } = await Post.findAndCountAll({
        where: { parentId: req.params.id },
        include: [
          {
            model: User,
            attributes: ["firstname", "lastname", "photo", "region", "comuna"],
            as: "user",
          },
        ],
        limit: pageSize,
        offset: offset,
        order: [["createdAt", "DESC"]],
      });
      const paginationData = getPaginationData(
        { count, rows },
        currentPage,
        pageSize
      );
      res.json({
        data: { ...post.toJSON(), replies: paginationData.data },
        pagination: paginationData.pagination,
      });
    } else {
      res
        .status(404)
        .json({ message: `Post con id=${req.params.id} no encontrado` });
    }
  } catch (error) {
    console.error("Error obteniendo post:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// POST /api/posts
exports.createPost = async (req, res) => {
  try {
    const user = await User.findOne({
      where: { email: res.locals.user.email },
    });

    const { content, image, parentId } = req.body;
    const newPost = await Post.create({
      userId: user.id,
      content,
      image,
      parentId,
    });
    res.status(201).json(newPost);
  } catch (error) {
    console.error("Error creando post:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// PUT /api/posts/:id
exports.updatePost = async (req, res) => {
  try {
    const { userId, content, image } = req.body;
    const numAffectedRows = await Post.update(
      { userId, content, image },
      { where: { id: req.params.id } }
    );
    if (numAffectedRows[0] > 0) {
      const updatedPost = await Post.findByPk(req.params.id, {
        include: [
          {
            model: User,
            as: "user",
            attributes: ["firstname", "lastname", "photo", "region", "comuna"],
          },
        ],
      });
      res.json(updatedPost);
    } else {
      res
        .status(404)
        .json({ message: `Post con id=${req.params.id} no encontrado` });
    }
  } catch (error) {
    console.error("Error actualizando post:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// DELETE /api/posts/:id
exports.deletePost = async (req, res) => {
  try {
    // Cascade delete all replies to this post
    await Post.destroy({ where: { parentId: req.params.id } });

    // Delete the main post
    const numDeleted = await Post.destroy({ where: { id: req.params.id } });
    if (numDeleted) {
      res.status(204).json({ message: "Post borrado correctamente" });
    } else {
      res
        .status(404)
        .json({ message: `Post con id=${req.params.id} no encontrado` });
    }
  } catch (error) {
    console.error("Error eliminando post:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};
// Like or Unlike a post
exports.likePost = async (req, res) => {
  try {
    const user = await User.findOne({
      where: { email: res.locals.user.email },
    });

    const userId = user.id;
    const { postId } = req.params;

    if (!userId) {
      return res.status(400).json({ error: "User ID no encontrado" });
    }

    const existingLike = await Like.findOne({
      where: { userId, postId },
      attributes: ["id", "userId", "postId", "createdAt", "updatedAt"],
    });

    if (existingLike) {
      await Like.destroy({ where: { id: existingLike.id } });
      res.status(200).json({ message: "Like removido" });
    } else {
      await Like.create({ userId, postId });
      res.status(200).json({ message: "Like agregado" });
    }
  } catch (error) {
    console.error("Error al dar like:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};
