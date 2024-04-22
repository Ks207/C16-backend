const { body, header } = require("express-validator");
const { validateResult } = require("./validateResult");


exports.validateNewReport = [
    header("Authorization")
    .notEmpty()
    .withMessage("Header es requerido!")
    .isString()
    .withMessage("Header tiene que ser una cadena de texto")
    .escape(),
  body("postId")
    .notEmpty()
    .withMessage("Post ID no puede estar vacío")
    .isString()
    .withMessage("Post ID debe ser un string"),
  validateResult,
]

exports.validateUpdateReport = [
    header("Authorization")
    .notEmpty()
    .withMessage("Header es requerido!")
    .isString()
    .withMessage("Header tiene que ser una cadena de texto")
    .escape(),
    body("active")
    .notEmpty()
    .withMessage("Active no puede estar vacío")
    .isBoolean()
    .withMessage("Active debe ser un boolean"),
    validateResult
]