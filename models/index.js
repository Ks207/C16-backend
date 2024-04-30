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

Post.belongsTo(User, { foreignKey: "userId", as: "user" });
Post.hasMany(Post, { as: "replies", foreignKey: "parentId", onDelete: 'CASCADE' });
Post.hasMany(Like, { foreignKey: "postId", onDelete: 'CASCADE' });

User.hasMany(Post, { foreignKey: "userId", as: "posts", onDelete: 'CASCADE' });
User.hasMany(Resource, { foreignKey: "userId", as: "resources", onDelete: 'CASCADE' });
User.hasMany(Material, { foreignKey: "userId", as: "materials", onDelete: 'CASCADE' });
User.hasMany(Report, { foreignKey: "userId", as: "authoredReports", onDelete: 'CASCADE' });
User.hasMany(Partner, { foreignKey: "userId", as: "partners", onDelete: 'CASCADE' });
User.hasMany(Like, { foreignKey: "userId", as: "likes", onDelete: 'CASCADE' });

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