const { body } = require("express-validator");
const { validateResult } = require("./validateResult");

exports.validateNewResource = [
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
