const { body, header } = require("express-validator");
const { validateResult } = require("./validateResult");

exports.validateNewRole = [
    body("name")
        .notEmpty()
        .withMessage("El nombre del rol no puede estar vacío")
        .isString()
        .withMessage("El nombre del rol tiene que ser una cadena de texto")
        .escape(),
    validateResult,
]

exports.validateUpdateRole = [
    body("name")
        .notEmpty()
        .withMessage("El nombre del rol no puede estar vacío")
        .isString()
        .withMessage("El nombre del rol tiene que ser una cadena de texto")
        .escape(),
    validateResult,
]

exports.validateDeleteRole = [
    header("Authorization")
    .notEmpty()
    .withMessage("Header es requerido!")
    .isString()
    .withMessage("Header tiene que ser una cadena de texto")
    .escape(),
    validateResult
]