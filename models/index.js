// models
const Role = require("./role");
const User = require("./user");
const Post = require("./post");
const Resource = require("./resource");
const Material = require("./material");

// relationships
User.belongsTo(Role, { foreignKey: "roleId" });

Post.hasMany(Post, { as: "replies", foreignKey: "parentId" });

Post.belongsTo(User, { foreignKey: "userId", as: "user" });

Resource.belongsTo(User, { foreignKey: "userId" });

Material.belongsTo(User, { foreignKey: "userId" });

module.exports = {
  Role,
  User,
  Post,
  Resource,
  Material,
};
