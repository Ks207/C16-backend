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
        ],
      },
    },
  }
);

module.exports = Post;
