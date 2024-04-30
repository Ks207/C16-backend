const { body, header } = require("express-validator");
const { validateResult } = require("./validateResult");

exports.validateNewUser = [
  header("Authorization")
    .notEmpty()
    .withMessage("Header es requerido!")
    .isString()
    .withMessage("Header tiene que ser una cadena de texto")
    .escape(),
  validateResult,
];

exports.validateNewAdmin = [
  header("Authorization")
    .notEmpty()
    .withMessage("Header es requerido!")
    .isString()
    .withMessage("Header tiene que ser una cadena de texto")
    .escape(),
    body("id")
    .notEmpty().withMessage("Id no puede estar vacío")
    .isString().withMessage("Id tiene que ser una cadena de texto")
    .escape(),
    body("email")
    .notEmpty().withMessage("Email no puede estar vacío")
    .isString().withMessage("Email tiene que ser una cadena de texto")
    .escape(),
    validateResult,
]

exports.validateFinishUser = [
    header("Authorization")
    .notEmpty()
    .withMessage("Header es requerido!")
    .isString()
    .withMessage("Header tiene que ser una cadena de texto")
    .escape(),
    body("firstname")
    .notEmpty().withMessage("Nombre no puede estar vacío")
    .isString().withMessage("Nombre tiene que ser una cadena de texto")
    .escape(),
    body("lastname")
    .notEmpty().withMessage("Apellido no puede estar vacío")
    .isString().withMessage("Apellido tiene que ser una cadena de texto")
    .escape(),
    body("phone")
    .notEmpty().withMessage("Teléfono no puede estar vacío")
    .isString().withMessage("Teléfono tiene que ser una cadena de texto")
    .escape(),
    body("rut")
    .notEmpty().withMessage("Rut no puede estar vacío")
    .isString().withMessage("Rut tiene que ser una cadena de texto")
    .escape(),
    body("birthday")
    .notEmpty().withMessage("Fecha de nacimiento no puede estar vacía")
    .escape(),
    body("gender")
    .notEmpty().withMessage("Género no puede estar vacío")
    .isString().withMessage("Género tiene que ser una cadena de texto")
    .escape(),
    body("region")
    .notEmpty().withMessage("Región no puede estar vacía")
    .isString().withMessage("Región tiene que ser una cadena de texto")
    .escape(),
    body("comuna")
    .notEmpty().withMessage("Comuna no puede estar vacía")
    .isString().withMessage("Comuna tiene que ser una cadena de texto")
    .escape(),
    body("completed")
    .isBoolean().withMessage("Completado tiene que ser un booleano")
    .escape(),
    validateResult,
]

exports.validateDeleteUser = [
    header("Authorization")
    .notEmpty()
    .withMessage("Header es requerido!")
    .isString()
    .withMessage("Header tiene que ser una cadena de texto")
    .escape(),
    validateResult
]

exports.validateUserImage = [
    header("Authorization")
    .notEmpty()
    .withMessage("Header es requerido!")
    .isString()
    .withMessage("Header tiene que ser una cadena de texto")
    .escape(),
    validateResult
]

exports.validateToggleUser = [
    header("Authorization")
    .notEmpty()
    .withMessage("Header es requerido!")
    .isString()
    .withMessage("Header tiene que ser una cadena de texto")
    .escape(),
    validateResult
]