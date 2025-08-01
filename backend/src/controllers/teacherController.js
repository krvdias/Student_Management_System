const Teachers = require('../model/TeacherModel');
const Class = require('../model/ClassModel');
const { Op } = require('sequelize');
const { formatMobileNumber } = require('../utils/functions');

const teacherController = {

    async addTeacher(req, res) {
        try {
            const {firstName, lastName, address, mobile, email, training, classes} = req.body;

            if (!firstName || !lastName || !address || !mobile || !email) {
                return res.status(400).json({ message: "All fields are required." });
            }

            const trimmedMobile = formatMobileNumber(mobile);

            const existingTeacher = await Teachers.findOne({ where: {mobile: trimmedMobile} });
            if (existingTeacher) {
                return res.status(409).json({ message: `Mobile number already exist` });
            }

            if (classes) {
                const existingClass = await Class.findByPk(classes);
                if (!existingClass) {
                    return res.status(409).json({ message: `There is no any class in this id` });
                }
            }

            const newTeacher = await Teachers.create({
                first_name: firstName,
                last_name: lastName,
                address,
                mobile: trimmedMobile,
                email,
                training: training || 'false',
                class: classes || null
            });

            res.status(201).json({
                success: true,
                message: "Teacher added successfully",
                data: newTeacher
            });
        } catch (error) {
            console.error('Teacher adding error:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    async searchTeacher(req, res) {
        try {
            const { searchTerm } = req.body;

            let whereCondition = {};

            if (searchTerm && searchTerm.trim() !== "") {
                whereCondition = {
                    [Op.or]: [
                        { first_name: { [Op.like]: `%${searchTerm}%` } },
                        { last_name: { [Op.like]: `%${searchTerm}%` } },
                        { email: { [Op.like]: `%${searchTerm}%` } }
                    ]
                };
            }

            const teachers = await Teachers.findAll({
                where: whereCondition,
                include: [{
                    model: Class,
                    as: 'classTeacher',  
                    attributes: ['id', 'name', 'year'] 
                }],
                order: [['createdAt', 'DESC']]
            });

            res.status(200).json({
                success: true,
                message: searchTerm ? "Teachers fetched with search term" : "All teachers feched",
                data: teachers
            });
        } catch (error) {
            console.error('Error fetching teachers:', error);
            res.status(500).json({ 
                success: false,
                message: 'Internal server error',
                error: error.message 
            });
        }
    },

    async editTeacher(req, res) {
        try {
            const { id } = req.params;
            const {firstName, lastName, address, mobile, email, training, classes} = req.body;

            const checkTeacher = await Teachers.findByPk(id);
            if (!checkTeacher) {
                return res.status(404).json({ message: 'Teacher not found with this id' });
            }

            const updateTeacher = {};
            if (firstName) updateTeacher.first_name = firstName;
            if (lastName) updateTeacher.last_name = lastName;
            if (address) updateTeacher.address = address;

            if (mobile) {
                const trimmedMobile = formatMobileNumber(mobile);

                updateTeacher.mobile = trimmedMobile;
            }

            if (email) updateTeacher.email = email;
            if (training) updateTeacher.training = training;

            if (classes) {
                const existingClass = await Class.findByPk(classes);
                if (!existingClass) {
                    return res.status(409).json({ message: `There is no any class in this id` });
                }

                updateTeacher.class = classes;
            }

            if (Object.keys(updateTeacher).length === 0) {
                return res.status(400).json({ message: "No valid fields provided for update." });
            }

            const [affectedRows] = await Teachers.update(updateTeacher, {
                where: { id }
            });

            if (affectedRows === 0) {
                return res.status(500).json({ message: "There is no update anthything" });
            }

            const updatedTeacher = await Teachers.findByPk(id);

            res.status(200).json({
                success: true,
                message: "Teacher update successfully",
                data: updatedTeacher
            });
        } catch (error) {
            console.error('Error updating teacher:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    async deleteTeacher(req, res) {
        try {
            const { id } = req.params;

            const checkTeacher = await Teachers.findByPk(id);
            if (!checkTeacher) {
                return res.status(404).json({ message: 'Teacher not found with this id' });
            }

            await Teachers.destroy({ where: { id } });

            res.status(200).json({
                success: true,
                message: "Teacher deleted successfully"
            });
        } catch (error) {
            console.error("Error deleting teacher:", error);
            res.status(500).json({ success: false, message: "Failed to delete teacher" });
        }
    }
}



module.exports = teacherController;