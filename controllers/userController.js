const { User } = require("../models/index");
const { Op } = require("sequelize");
const {
  getPagination,
  getPaginationData,
} = require("../utils/paginationHelper");
const { sendEmail } = require('../config/mailerConfig');
const excelJS = require("exceljs");

//GET /api/users/downloadExcel
exports.exportUsers = async (req, res) => {
 
  const workbook = new excelJS.Workbook(); 
  const worksheet = workbook.addWorksheet("Mis usuarios");

  worksheet.columns = [ 
    { header: "ID", key: "id", width: 30 },
    { header: "Nombre", key: "firstname", width: 10 },
    { header: "Apellido", key: "lastname", width: 10 },
    { header: "Email", key: "email", width: 30 },
    { header: "Telefono", key: "phone", width: 10 },
    { header: "RUT", key: "rut", width: 11 },
    { header: "Fecha de nacimiento", key: "birthday", width: 15 },
    { header: "Género", key: "gender", width: 10 },
    { header: "Region", key: "region", width: 10 },
    { header: "Comuna", key: "comuna", width: 10 },
    { header: "Cuida A", key: "takesCare", width: 10 },
    { header: "Photo", key: "photo", width: 10 },
    { header: "Completado", key: "completed", width: 10 },
    { header: "Fecha de creacion", key: "createdAt", width: 15 },
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
      takesCare: user.takesCare,
      photo: user.photo,
      completed: user.completed,
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
        .json({ message: `No users with name: ${name} were found` });
    }

    res.json(response);
  } catch (error) {
    console.error("Error retrieving users: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

//GET /api/users/:userId
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.userId);

    if (!user) {
      return res
        .status(404)
        .json({ message: `User with id: ${req.params.userId} not found!` });
    }

    res.json(user);
  } catch (error) {
    console.error("Error retrieving user: ", error);
    res.status(500).json({ error: "Internal server error" });
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
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Unable to create user" });
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
      return res.status(403).json({ message: "Only super admins can create admins" });
    }

   
  } catch (error) {
    console.error("Error creating admin:", error);
    res.status(500).json({ error: "Unable to create admin" });
  }
}

//DELETE /api/users/:userId
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findOne({
      where: { email: res.locals.user.email },
    });

    if (user.roleId === 3) {
      return res.status(403).json({ message: "User not authorized" });
    }

    if (user.roleId === 2) {
      const userToDelete = await User.findOne({
        where: { id: req.params.userId, roleId: 3 }, 
      });

      if (!userToDelete) {
        return res.status(400).json({ message: "User not found or unauthorized to delete this user" });
      }
    }

    const numDeleted = await User.destroy({
      where: { id: req.params.userId },
    });

    if (numDeleted) {
      return res.status(204).json({ message: "User deleted" });
    } else {
      return res.status(400).json({ message: `User with id: ${req.params.userId} not found` });
    }
  } catch (error) {
    console.error("Error deleting user:", error);
    return res.status(500).json({ error: "Internal Server Error" });
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
        return res.status(403).json({ message: "Cuidador cannot update others or their own roleId" });
      }
    }

    if (user.roleId === 2) {
      if (req.params.userId !== user.id) {
        if (req.body.roleId) {
          return res.status(403).json({ message: "Admin cannot update roleId of others" });
        }
      } else {
        if (req.body.roleId) {
          return res.status(403).json({ message: "Admin cannot update their own roleId" });
        }
      }
      const userToUpdate = await User.findByPk(req.params.userId);
      if (!userToUpdate || userToUpdate.roleId !== 3 && userToUpdate.id !== user.id) {
        return res.status(400).json({ message: "User not found or unauthorized to update this user" });
      }
    }

    const [numUpdated] = await User.update(req.body, {
      where: { id: req.params.userId },
    });

    if (numUpdated) {
      const updatedUser = await User.findByPk(req.params.userId);
      return res.json(updatedUser);
    } else {
      return res.status(400).json({ message: `User with id: ${req.params.userId} not found` });
    }
  } catch (error) {
    console.error("Error updating user:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};