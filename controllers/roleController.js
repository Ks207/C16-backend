const { Role } = require("../models/index");

// GET /api/roles
exports.getAllRoles = async (req, res) => {
    try {
        const roles = await Role.findAll({order: [['id', 'ASC']] });
        if (!roles) {
            return res
                .status(404)
                .json({ message: "No rols encontrados" });
        }
        res.json(roles);
    } catch (error) {
        console.error("Error obteniendo roles:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
}

// GET /api/roles/:id
exports.getRoleById = async (req, res) => {
    try {
        const role = await Role.findByPk(req.params.id);
        if (role) {
            res.json(role);
        } else {
            res
                .status(404)
                .json({ message: `Role con id ${req.params.id} no encontrado` });
        }
    } catch (error) {
        console.error("Error obteniendo rol:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
}

// POST /api/roles
exports.createRole = async (req, res) => {
    try {
        const { name } = req.body;
        const existingRole = await Role.findOne({ where: { name } });
        if (existingRole) {
            return res
                .status(409)
                .json({ message: `Role con nombre ${name} ya existe` });
        }
        const newRole = await Role.create({ name });
        res.status(201).json(newRole);
    } catch (error) {
        console.error("Error creando rol:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
}

// PUT /api/roles/:id
exports.updateRole = async (req, res) => {
    try {
        const { name } = req.body;
        const existingRole = await Role.findOne({ where: { name } });
        if (existingRole) {
            return res
                .status(409)
                .json({ message: `Role con nombre ${name} ya existe` });
        }
        const numAffectedRows = await Role.update({ name }, { where: { id: req.params.id } });
        if (numAffectedRows[0] > 0) {
            const updatedRole = await Role.findByPk(req.params.id);
            res.json(updatedRole);
        } else {
            res
                .status(404)
                .json({ message: `Role con id ${req.params.id} no encontrado` });
        }
    } catch (error) {
        console.error("Error actualizando rol:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
}

// DELETE /api/roles/:id
exports.deleteRole = async (req, res) => {
    try {

        const rol = await Role.findOne({
            where: { id: req.params.id },
        })
       
        if (rol.name === "Super Admin") {
            res.status(403).json({ message: "No puedes borrar el rol Super Admin" });
        }

         const numDeleted = await Role.destroy({ where: { id: req.params.id  } });
        if (numDeleted) {
            res.status(204).json({ message: "Rol eliminado correctamente" });
        } else {
            res
                .status(404)
                .json({ message: `Role con id: ${req.params.id} no encontrado` });
        }
    } catch (error) {
        console.error("Error eliminando rol:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
}



