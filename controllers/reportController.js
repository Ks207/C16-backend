const { Report, User, Post } = require("../models/index");
const {
    getPagination,
    getPaginationData,
  } = require("../utils/paginationHelper");


exports.getAllReports = async (req, res) => {
    try{
        const { currentPage, pageSize, offset } = getPagination(
            req.query.page,
            req.query.limit
          );
          const active = req.query.active || null;

     const { count, rows } = await Report.findAndCountAll({
         attributes: ['id', 'userId', 'author', 'content', 'quantity', 'active' ,'createdAt', 'updatedAt'],
         include: [
             {
                 model: User,
                 attributes: ['firstname', 'lastname'],
                 as: 'PostAuthor', 
             },
             {
                 model: User,
                 attributes: ['firstname', 'lastname'],
                 as: 'ReportAuthor',
             }
         ],
         offset,
         limit: pageSize,
         order: [['quantity', 'DESC']],
         where: {
             active: active
         }
     });

     if(!count){
         return res.status(404).json({ message: "No reports found" });
     }

     const reports = getPaginationData({ count, rows }, currentPage, pageSize);
     
     res.status(200).json(reports);
    } catch (error) {
     console.error("Error retrieving reports:", error);
     res.status(500).json({ error: "Internal server error" });
    }
 }
 

exports.getReportById = async (req, res) => {
    try{
        const report = await Report.findByPk(req.params.id);
        if(report){
            res.status(200).json(report);
        } else {
            res
                .status(404)
                .json({ message: `Report with id ${req.params.id} not found` });
        }
    } catch (error) {
        console.error("Error retrieving report:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

exports.createReport = async (req, res) => {

    try {
        const user = await User.findOne({
          where: { email: res.locals.user.email },
      });

        const { postId, author, content, quantity } = req.body;
        const existingReport = await Report.findOne({ where: { postId: postId } });
       
        if (existingReport) {
            const newQuantity = existingReport.quantity + 1;
            await Report.update({ quantity: newQuantity }, { where: { id: existingReport.id } });
            return res.status(201).json({ message: "Se le sumo uno al reporte!"});
        }
        const newReport = await Report.create({ userId: user.id, postId, author, content, quantity });

        res.status(200).json(newReport);
    } catch (error) {
        console.error("Error creating report:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

exports.updateReport = async (req, res) => {
    try {

        const user = await User.findOne({
            where: { email: res.locals.user.email },
        });

        if (user.roleId === 3) {
            return res.status(403).json({ message: "User not authorized" });
          }
         
        const { active } = req.body;

        const numUpdated = await Report.update(req.body, {
            where: { id: req.params.id },
        });

        if (numUpdated) {
            const updatedReport = await Report.findOne({ where: { id: req.params.id } });
            const postId = updatedReport.postId;
            switch (active) {
                case true:
                    await Report.update({ active: active }, { where: { id: req.params.id } });
                    await Post.update({ active: !active }, { where: { id: postId } });
                case false:
                    await Report.update({ active: active }, { where: { id: req.params.id } });
                    await Post.update({ active: !active }, { where: { id: postId } });
            }
        }   
     
        res.status(200).json({ message: "Report updated" });
    } catch (error) {
        console.error("Error updating report:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

exports.deleteReport = async (req, res) => {
    try {
        const deletedReport = await Report.destroy({ where: { id: req.params.id } });
        if (deletedReport) {
            res.status(200).json({ message: "Report deleted" });
        } else {
            res
                .status(404)
                .json({ message: `Report with id ${req.params.id} not found` });
        }
    } catch (error) {
        console.error("Error deleting report:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}