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
            });

            if (classes) {
                const classToUpdate = await Class.findOne({where: {id: classes} });

                if (classToUpdate.teacher && classToUpdate.teacher !== null) {
                    return res.status(409).json({ message: `This class already has a teacher` });
                }

                if (classToUpdate) {
                    classToUpdate.teacher = newTeacher.id;
                    await classToUpdate.save();
                }
            }

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

            // First get all matching teachers
            const teachers = await Teachers.findAll({
                where: whereCondition,
                order: [['createdAt', 'DESC']],
                raw: true // Get plain objects instead of model instances
            });

            // Get teacher IDs
            const teacherIds = teachers.map(teacher => teacher.id);

            // Find all classes that have these teacher IDs
            const classes = await Class.findAll({
                where: {
                    teacher: {
                        [Op.in]: teacherIds
                    }
                },
                raw: true
            });

            // Create a map of teacherId -> class for quick lookup
            const teacherClassMap = {};
            classes.forEach(classItem => {
                teacherClassMap[classItem.teacher] = classItem;
            });

            // Combine teacher data with their class info
            const teachersWithClasses = teachers.map(teacher => {
                const classTeacher = teacherClassMap[teacher.id] || null;
                return {
                    ...teacher,
                    // Convert training from 0/1 to false/true
                    training: Boolean(teacher.training),
                    class: classTeacher ? classTeacher.id : null,
                    classTeacher: classTeacher 
                        ? { 
                            id: classTeacher.id,
                            name: classTeacher.name,
                            year: classTeacher.year
                        } 
                        : null
                };
            });

            res.status(200).json({
                success: true,
                message: searchTerm ? "Teachers fetched with search term" : "All teachers fetched",
                data: teachersWithClasses
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

            if (classes) {
                const existingClass = await Class.findOne({where: {id: classes} });
                if (!existingClass) {
                    return res.status(409).json({ message: `There is no any class in this id` });
                }

                if (existingClass.teacher && existingClass.teacher !== null) {
                    if (existingClass.teacher !== updatedTeacher.id) {
                        return res.status(409).json({ message: `This class already has a teacher` });
                    }
                }

                existingClass.teacher = updatedTeacher.id;
                await existingClass.save();
            } else {
                const teacherClass = await Class.findOne({ where: { teacher: updatedTeacher.id } });
                if (teacherClass) {
                    teacherClass.teacher = null; // Remove the teacher from the class
                    await teacherClass.save();
                }
            }

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

            const classToUpdate = await Class.findOne({ where: { teacher: id } });
            if (classToUpdate) {
                classToUpdate.teacher = null; // Remove the teacher from the class
                await classToUpdate.save();
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