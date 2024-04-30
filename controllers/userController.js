const { User } = require("../models/index");
const { Op } = require("sequelize");
const {
  getPagination,
  getPaginationData,
} = require("../utils/paginationHelper");
const { sendEmail } = require('../config/mailerConfig');
const excelJS = require("exceljs");
const firebaseAdminAuth = require("../config/firebase").auth;
const { uploadImage, deleteImage } = require('../utils/imageHelper');

//GET /api/users/downloadExcel
exports.exportUsers = async (req, res) => {
 
try {
  const user = await User.findOne({
    where: { email: res.locals.user.email },
});

  if(user.roleId === 3){
    return res.status(403).json({ message: "Solo administradores pueden descargar el excel" });
  }

  const workbook = new excelJS.Workbook(); 
  const worksheet = workbook.addWorksheet("Mis usuarios");

  worksheet.columns = [ 
    { header: "ID", key: "id", width: 30 },
    { header: "Nombre", key: "firstname", width: 10 },
    { header: "Apellido", key: "lastname", width: 10 },
    { header: "Email", key: "email", width: 30 },
    { header: "Telefono", key: "phone", width: 10 },
    { header: "RUT", key: "rut", width: 11 },
    { header: "Fecha de nacimiento", key: "birthday", width: 10 },
    { header: "Género", key: "gender", width: 10 },
    { header: "Region", key: "region", width: 10 },
    { header: "Comuna", key: "comuna", width: 10 },
    { header: "Fecha de registro", key: "createdAt", width: 15 },
  ];

  const users = await User.findAll({
    attributes:{
      exclude: ['roleId']}
  });
  
  worksheet.getRow(1).eachCell((cell) => {
    cell.font = { bold: true };
  });

  users.forEach((user) => {
    worksheet.addRow({
      id: user.id,
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      phone: user.phone,
      rut: user.rut,
      birthday: user.birthday,
      gender: user.gender,
      region: user.region,
      comuna: user.comuna,
      createdAt: user.createdAt
    });
  });
  
  workbook.xlsx
    .writeBuffer()
    .then((buffer) => {
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename=users.xlsx');
      res.send(buffer);
    })
    .catch((error) => {
      res.status(500).json({ error: error.message });
    })
}
catch (error) {
  return res.status(500).json({ error: "Error interno del servidor" });
}

  
};

//GET /api/users
exports.getAllUsers = async (req, res) => {
  try {
    const { page, size, name } = req.query;
    const condition = name
      ? {
          [Op.or]: [
            { firstname: { [Op.iLike]: `%${name}%` } },
            { lastname: { [Op.iLike]: `%${name}%` } },
          ],
        }
      : null;

    const { currentPage, pageSize, offset } = getPagination(page, size);

    const { count, rows } = await User.findAndCountAll({
      where: condition,
      offset,
      limit: pageSize,
      attributes: { exclude: ["updatedAt"] },
    });

    const response = getPaginationData({ count, rows }, currentPage, pageSize);

    if (response.data.length === 0 && name) {
      return res
        .status(404)
        .json({ message: `No users con nombre: ${name} fueron encontrados` });
    }

    res.json(response);
  } catch (error) {
    console.error("Error obteniendo usuarios: ", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

//GET /api/users/:userId
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.userId);

    if (!user) {
      return res
        .status(404)
        .json({ message: `User con id: ${req.params.userId} no encontrado!` });
    }

    res.json(user);
  } catch (error) {
    console.error("Error obteniendo usuario: ", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

//POST /api/users
exports.createUser = async (req, res) => {

  try {
    const existingUser = await User.findOne({
      where: { email: res.locals.user.email },
    });

    if (existingUser) {
      return res.status(200).json(existingUser);
    }

    const newUser = await User.create({
      id: res.locals.user.uid,
      email: res.locals.user.email
    });

    const mailOptions = {
      from: process.env.EMAIL_HOST,
      to:res.locals.user.email,
      subject: 'Bienvenido!',
      html:`
      <h1>Bienvenido/a</h1>
      <p>¡Gracias por unirte a nuestra comunidad como Cuidador!</p>
      <p>Esperamos que disfrutes de tu tiempo con nosotros.</p>
      `
    }

    await sendEmail(mailOptions);
    
    res.status(201).json(newUser);
  } catch (error) {
    console.error("Error creando usuario:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

//POST /api/createAdmin
exports.createAdmin = async (req, res) => {
  try {
    const isSuperAdmin = await User.findOne({
      where:{
        [Op.and]: [
          { email: res.locals.user.email },
          { roleId: 1 },
        ]
      },
    })

    if(isSuperAdmin) {
      const existingAdmin = await User.findOne({
        where: { email: req.body.email },
      })
  
      if (existingAdmin) {
        return res.status(200).json(existingAdmin);
      }

      const admin = await User.create({
        id: req.body.id,
        email: req.body.email,
        roleId: 2,
      })

      const mailOptions = {
        from: process.env.EMAIL_HOST,
        to:req.body.email,
        subject: 'Bienvenido!',
        html:`
        <h1>Bienvenido/a</h1>
        <p>¡Gracias por unirte a nuestra comunidad como Administrador!</p>
        <p>Esperamos que disfrutes de tu tiempo con nosotros.</p>
        `
      }

      await sendEmail(mailOptions);

      res.status(201).json(admin);

    } else {
      return res.status(403).json({ message: "solo super administradores pueden crear administradores" });
    }

   
  } catch (error) {
    console.error("Error creando administradores:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
}

//DELETE /api/users/:userId
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findOne({
      where: { email: res.locals.user.email },
    });

    if (user.roleId === 3 || user.roleId === 2) {
      return res.status(403).json({ message: "Solo super admin pueden borrar otros usuarios." });
    }

    if (user.roleId === 2) {
      const userToDelete = await User.findOne({
        where: { id: req.params.userId, roleId: 3 }, 
      });

      if (!userToDelete) {
        return res.status(400).json({ message: "User no encontrado o no autorizado" });
      }
    }

    const userToDelete = await User.findByPk(req.params.userId);
    if (!userToDelete) {
      return res.status(400).json({ message: "Usuario no encontrado" });
    }

    // Delete the user's image if it exists
    if (userToDelete.photo) {
      try {
        await deleteImage(userToDelete.photo);
      } catch (error) {
        console.error("Error borrando la imagen del usuario:", error);
      }
    }

    // Delete the user from Firebase
    try {
      await firebaseAdminAuth.deleteUser(userToDelete.dataValues.id);
    } catch (error) {
      console.error("Error borrando usuario de Firebase:", error);
      if (error.code !== "auth/user-not-found") {
        return res
          .status(500)
          .json({ error: "Error al borrar usuario de Firebase" });
    }
}

    const numDeleted = await User.destroy({
      where: { id: req.params.userId },
    });

    if (numDeleted) {
    return res.status(204).json({ message: "User borrado" });
} else {
      return res.status(400).json({ message: `User con id: ${req.params.userId} no encontrado` });
    }
  } catch (error) {
    console.error("Error borrando usuario:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
};

//PATCH /api/users/:userId
exports.updateUser = async (req, res) => {
  try {
    const user = await User.findOne({
      where: { email: res.locals.user.email },
    });

    if (user.roleId === 3) {
      if (user.id !== req.params.userId || req.body.roleId) {
        return res.status(403).json({ message: "Cuidador no puede actualizar otros usuarios o su rol" });
      }
    }

    if (user.roleId === 2) {
      if (req.params.userId !== user.id) {
        if (req.body.roleId) {
          return res.status(403).json({ message: "Admin no puede actualizar el rol de otros usuarios" });
        }
      } else {
        if (req.body.roleId) {
          return res.status(403).json({ message: "Admin no puede actualizar su propio rol" });
        }
      }
      const userToUpdate = await User.findByPk(req.params.userId);
      if (!userToUpdate || userToUpdate.roleId !== 3 && userToUpdate.id !== user.id) {
        return res.status(400).json({ message: "Usuario no encontrado o no autorizado" });
      }
    }

    const [numUpdated] = await User.update(req.body, {
      where: { id: req.params.userId },
    });

    if (numUpdated) {
      const updatedUser = await User.findByPk(req.params.userId);
      return res.json(updatedUser);
    } else {
      return res.status(400).json({ message: `User con id: ${req.params.userId} no encontrado` });
    }
  } catch (error) {
    console.error("Error actualizando usuario:", error);
    return res.status(500).json({ error: "Error interno del servidor", details: error.message });
  }
};

//PATCH /api/users/:userId/uploadUserImage
exports.uploadUserImage = async (req, res) => {
  try {
    const requestingUser = await User.findOne({
      where: { email: res.locals.user.email },
    });

    if (!requestingUser) {
      return res.status(404).json({ message: "No se encontró el usuario" });
    }

    const userToEdit = await User.findByPk(req.params.userId);

    if (!userToEdit) {
      return res.status(404).json({ message: "No se encontró el usuario para editar" });
    }

  
    if (requestingUser.roleId === 3 && requestingUser.id !== userToEdit.id) {
      return res.status(403).json({ message: "No puedes actualizar este usuario" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "No hay imagen adjunta." });
    }

    // Delete the existing image if it exists
    if (userToEdit.photo) {
      try {
        await deleteImage(userToEdit.photo);
      } catch (error) {
        console.error("Error al borrar la imagen anterior:", error);
      }
    }

    // Upload the new image and get the URL
    const imageUrl = await uploadImage(req.file.buffer, req.file.originalname, userToEdit.id);

    // Update the user with the new image URL
    userToEdit.photo = imageUrl;
    await userToEdit.save();

    res.status(200).json({ user: userToEdit, message: "Image cargada con éxito." });
  } catch (error) {
    console.error("Error al subir imagen", error);
    res.status(500).json({ error: "Internal server error" });
  }
};