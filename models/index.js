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

Post.belongsTo(User, { foreignKey: "userId", as: "user", onDelete: 'CASCADE' });
Post.hasMany(Post, { as: "replies", foreignKey: "parentId", onDelete: 'CASCADE' });
Post.hasMany(Like, { foreignKey: "postId", onDelete: 'CASCADE' });

User.hasMany(Post, { foreignKey: "userId", as: "posts", onDelete: 'CASCADE' });
User.hasMany(Resource, { foreignKey: "userId", as: "resources", onDelete: 'CASCADE' });
User.hasMany(Material, { foreignKey: "userId", as: "materials", onDelete: 'CASCADE' });
User.hasMany(Report, { foreignKey: "author", as: "authoredReports", onDelete: 'CASCADE' });
User.hasMany(Partner, { foreignKey: "userId", as: "partners", onDelete: 'CASCADE' });
User.hasMany(Like, { foreignKey: "userId", as: "likes", onDelete: 'CASCADE' });

Resource.belongsTo(User, { foreignKey: "userId", onDelete: 'CASCADE' });
Material.belongsTo(User, { foreignKey: "userId", onDelete: 'CASCADE' });
Report.belongsTo(User, { foreignKey: "author", as: "authorUser", onDelete: 'CASCADE' });
Report.belongsTo(User, { foreignKey: "userId", as: "reportedUser" });
Partner.belongsTo(User, { foreignKey: "userId", onDelete: 'CASCADE' });

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
