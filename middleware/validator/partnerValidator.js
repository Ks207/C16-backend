const { body, header } = require("express-validator");
const { validateResult } = require("./validateResult");

exports.validateNewPartner = [
  header("Authorization")
    .notEmpty().withMessage("Header es requerido!")
    .isString().withMessage("Header tiene que ser una cadena de texto")
    .escape(), 
  body("name")
    .notEmpty().withMessage("Nombre no puede estar vacío")
    .escape(),
  body("description")
    .notEmpty().withMessage("Descripción no puede estar vacío")
    .escape(),
  validateResult,
];

exports.validateUpdatePartner = [
  header("Authorization")
    .notEmpty().withMessage("Header es requerido!")
    .isString().withMessage("Header tiene que ser una cadena de texto")
    .escape(), 
  body("name")
    .notEmpty().withMessage("Nombre no puede estar vacío")
    .escape(),
  body("description")
    .notEmpty().withMessage("Descripción no puede estar vacío")
    .escape(),
    validateResult
];

exports.validateDeletePartner = [
  header("Authorization")
    .notEmpty().withMessage("Header es requerido")
    .isString().withMessage("Header tiene que ser una cadena de texto")
    .escape(),
    validateResult
]