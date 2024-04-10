const { body, header } = require("express-validator");
const { validateResult } = require("./validateResult");

exports.validateNewMaterial = [
  header("Authorization")
    .notEmpty()
    .withMessage("Header es requerido!")
    .isString()
    .withMessage("Header tiene que ser una cadena de texto")
    .escape(), 
  body("title")
    .notEmpty()
    .withMessage("Título no puede estar vacío")
    .isString()
    .withMessage("Título debe ser un string"),
  body("description")
    .notEmpty()
    .withMessage("Descripcion no puede estar vacío")
    .isString()
    .withMessage("Descripcion debe ser un string"),
  body("materialURL")
    .notEmpty()
    .withMessage("URL de video no puede estar vacío")
    .isString()
    .withMessage("URL de video debe ser un string"),
  body("duration")
    .notEmpty()
    .withMessage("Duración no puede estar vacía")
    .isNumeric()
    .withMessage("Duración debe ser un numero"),
  validateResult,
];
