// models
const Role = require("./role");
const User = require("./user");
const Post = require("./post");
const Resource = require("./resource");
const Material = require("./material");
const Report = require("./report");
const Partner = require("./partner");
const Like = require("./like");

// relationships
User.belongsTo(Role, { foreignKey: "roleId" });

Post.hasMany(Post, { as: "replies", foreignKey: "parentId" });
Post.belongsTo(User, { foreignKey: "userId", as: "user" });
Post.hasMany(Like, { foreignKey: "postId" });

User.hasMany(Like, { foreignKey: "userId" });
Resource.belongsTo(User, { foreignKey: "userId" });

Material.belongsTo(User, { foreignKey: "userId" });

Report.belongsTo(User, { foreignKey: "userId", as: "ReportAuthor" });
Report.belongsTo(User, { foreignKey: "author", as: "PostAuthor" });

Partner.belongsTo(User, { foreignKey: "userId" });

module.exports = {
  Role,
  User,
  Post,
  Resource,
  Material,
  Report,
  Partner,
  Like,
};
