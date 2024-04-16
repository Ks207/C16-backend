const { body, header } = require("express-validator");
const { validateResult } = require("./validateResult");

exports.validateNewPartner = [
  header("Authorization")
    .notEmpty().withMessage("Header es requerido!")
    .isString().withMessage("Header tiene que ser una cadena de texto")
    .escape(), 
  body("name")
    .notEmpty().withMessage("Nombre no puede estar vacío")
    .isString().withMessage("Nombre debe ser un string")
    .escape(),
  body("description")
    .notEmpty().withMessage("Descripción no puede estar vacío")
    .isString().withMessage("Descripción debe ser un string")
    .escape(),
  body("url")
    .notEmpty().withMessage("URL no puede estar vacío")
    .isString().withMessage("URL debe ser un string")
    .escape(),
  body("image")
    .notEmpty().withMessage("Imagen no puede estar vacía")
    .isString().withMessage("Imagen debe ser un string")
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
    .isString().withMessage("Nombre debe ser un string")
    .escape(),
  body("description")
    .notEmpty().withMessage("Descripción no puede estar vacío")
    .isString().withMessage("Descripción debe ser un string")
    .escape(),
  body("url")
    .notEmpty().withMessage("URL no puede estar vacío")
    .isString().withMessage("URL debe ser un string")
    .escape(),
  body("image")
    .notEmpty().withMessage("Imagen no puede estar vacía")
    .isString().withMessage("Imagen debe ser un string")
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