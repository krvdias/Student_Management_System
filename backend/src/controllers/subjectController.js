const Subject = require('../model/SubjectModel');
const { Op } = require('sequelize');

const subjectController = {

    async addSubject(req, res) {
        try {
            const {subjectId, name} = req.body;

            if (!subjectId || !name) {
                return res.status(400).json({ message: "All fields are required." });
            }

            const existingSubject = await Subject.findOne({ where: {subject_id: subjectId} });
            if (existingSubject) {
                return res.status(409).json({ message: `Subject id already exist` });
            }

            const newSubject = await Subject.create({
                subject_id: subjectId,
                name
            });

            return res.status(201).json({
                success: true,
                message: "Subject add successfully!",
                data: newSubject
            });
        } catch (error) {
            console.error("Error adding subject:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    },

    async searchSubject(req, res) {
        try {
            const { searchTerm } = req.body;

            let whereCondition = {};

            if (searchTerm && searchTerm.trim() !== "") {
                whereCondition = {
                    [Op.or]: [
                        { name: { [Op.like]: `%${searchTerm}%` }},
                        { subject_id: { [Op.like]: `%${searchTerm}%` }},
                    ]
                };
            }

            const subject = await Subject.findAll({
                where: whereCondition,
            });

            res.status(200).json({
                success: true,
                message: searchTerm ? "Subject fetched with search term" : "All subjects feched",
                data: subject
            });
        } catch (error) {
            console.error('Error fetching subjects:', error);
            res.status(500).json({ 
                success: false,
                message: 'Internal server error',
                error: error.message 
            });
        }
    },

    async getSubjects(req, res) {
        try {
            const subjects = await Subject.findAll();

            res.status(200).json({
                success: true,
                message: "Subjects retrived successfully!",
                data: subjects
            });
        } catch (error) {
            console.error('Error fetching subjects:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    async editSubject(req, res) {
        try {
            const { id } = req.params;
            const {subjectId, name} = req.body;

            const checkSubject = await Subject.findByPk(id);
            if(!checkSubject) {
                return res.status(404).json({ message: 'Subject not found with this id' });
            }

            const updateSubject = {};
            if (subjectId) updateSubject.subject_id = subjectId;
            if (name) updateSubject.name = name;

            if (Object.keys(updateSubject).length === 0) {
                return res.status(400).json({ message: "No valid fields provided for update." });
            }

            const [affectedRows] = await Subject.update(updateSubject, {
                where: { id }
            });

            if (affectedRows === 0) {
                return res.status(500).json({ message: "Failed to update subject" });
            }

            const editedSubject = await Subject.findByPk(id);

            res.status(200).json({
                success: true,
                message: "Subject updated successfully",
                data: editedSubject
            });
        } catch (error) {
            console.error('Error updating subject:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    async deleteSubject(req, res) {
        try {
            const { id } = req.params;

            const checkSubject = await Subject.findByPk(id);
            if(!checkSubject) {
                return res.status(404).json({ message: 'Subject not found with this id' });
            }

            await Subject.destroy({ where: { id }});

            return res.status(200).json({
                success: true,
                message: "Subject deleted successfully"
            });
        } catch (error) {
            console.error('Error deleting subjct:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
}

module.exports = subjectController;