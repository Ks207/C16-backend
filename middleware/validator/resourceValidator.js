const { body, header } = require("express-validator");
const { validateResult } = require("./validateResult");

exports.validateNewResource = [
    header("Authorization")
    .notEmpty()
    .withMessage("Header es requerido!")
    .isString()
    .withMessage("Header tiene que ser una cadena de texto")
    .escape(),
  body("description")
    .notEmpty()
    .withMessage("Descripción no puede estar vacía")
    .isString()
    .withMessage("Descripción debe ser un string"),
  body("comuna")
    .notEmpty()
    .withMessage("Comuna no puede estar vacía")
    .isString()
    .withMessage("Comuna debe ser un string"),
  validateResult,
];

exports.validateUpdateResource = [
    header("Authorization")
    .notEmpty()
    .withMessage("Header es requerido!")
    .isString()
    .withMessage("Header tiene que ser una cadena de texto")
    .escape(),
  validateResult,
];

exports.validateDeleteResource = [
    header("Authorization")
    .notEmpty()
    .withMessage("Header es requerido!")
    .isString()
    .withMessage("Header tiene que ser una cadena de texto")
    .escape(),
    validateResult
]