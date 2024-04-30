const { body, header } = require("express-validator");
const { validateResult } = require("./validateResult");

exports.validateNewPost = [
  header("Authorization")
    .notEmpty()
    .withMessage("Header es requerido!")
    .isString()
    .withMessage("Header tiene que ser una cadena de texto")
    .escape(),
  body("content")
    .notEmpty()
    .withMessage("Contenido no puede estar vacío")
    .isString()
    .withMessage("Contenido debe ser un string"),
  validateResult,
];

exports.validateUpdatePost = [
    header("Authorization")
    .notEmpty()
    .withMessage("Header es requerido!")
    .isString()
    .withMessage("Header tiene que ser una cadena de texto")
    .escape(),
  body("content")
    .notEmpty()
    .withMessage("Contenido no puede estar vacío")
    .isString()
    .withMessage("Contenido debe ser un string"),
  validateResult,
];

exports.validateDeletePost = [
    header("Authorization")
    .notEmpty()
    .withMessage("Header es requerido!")
    .isString()
    .withMessage("Header tiene que ser una cadena de texto")
    .escape(),
    validateResult
]

exports.validateLikePost = [
    header("Authorization")
    .notEmpty()
    .withMessage("Header es requerido!")
    .isString()
    .withMessage("Header tiene que ser una cadena de texto")
    .escape(),
    validateResult
]



