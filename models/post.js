const { sequelize, Sequelize } = require("../config/database");

const Post = sequelize.define(
  "Post",
  {
    userId: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    content: {
      type: Sequelize.STRING(2000),
      allowNull: false,
    },
    image: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    parentId: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
    active: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    timestamps: true,
    createdAt: "createdAt",
    updatedAt: "updatedAt",
    defaultScope: {
      attributes: {
        include: [
          [
            sequelize.literal(
              `(SELECT COUNT(*) FROM "Posts" AS "Replies" WHERE "Replies"."parentId" = "Post"."id")`
            ),
            "repliesCount",
          ],
          [
            sequelize.literal(
              `(SELECT COUNT(*) FROM "Likes" WHERE "Likes"."postId" = "Post"."id")`
            ),
            "likesCount",
          ],
        ],
      },
    },
  }
);

module.exports = Post;
