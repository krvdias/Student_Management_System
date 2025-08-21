const Class = require('../model/ClassModel');
const Teachers = require('../model/TeacherModel');
const { Op } = require('sequelize');


const classController = {

    async addClass(req, res) {
        try {
            const {name, year, subjectCount} = req.body;

            if (!name || !year || !subjectCount) {
                return res.status(400).json({ message: "All fields are required." });
            }

            const existingClass = await Class.findOne({ where: { name } });
            if (existingClass) {
                return res.status(409).json({ message: `Class name already existing` });
            }

            const newClass = await Class.create({
                name,
                year,
                subject_count: subjectCount
            });

            res.status(201).json({
                success: true,
                message: 'Class added successfully!',
                data: newClass
            });
        } catch (error) {
            console.error('Class adding error:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    async searchClass(req, res) {
        try {
            const { searchTerm } = req.body;

            let whereCondition = {};

            if (searchTerm && searchTerm.trim() !== "") {
                whereCondition = {
                    [Op.or]: [
                        { name: { [Op.like]: `%${searchTerm}%` } } // Added % at both ends for better search
                    ]
                };
            }

            const classes = await Class.findAll({
                where: whereCondition,
                include: [
                    {
                        model: Teachers,
                        as: 'classTeacher',  // Using the association alias
                        attributes: ['id', 'first_name', 'last_name'],
                        required: false // Left join to include classes without teachers
                    }
                ],
                order: [
                    ['name', 'ASC'] // Order classes alphabetically
                ]
            });

            // Format the response data
            const formattedClasses = classes.map(classItem => ({
                id: classItem.id,
                name: classItem.name,
                year: classItem.year,
                subjectCount: classItem.subject_count,
                teacher: classItem.classTeacher ? {
                    id: classItem.classTeacher.id,
                    name: `${classItem.classTeacher.first_name} ${classItem.classTeacher.last_name}`
                } : null
            }));

            res.status(200).json({
                success: true,
                message: searchTerm ? "Classes fetched with search term" : "All classes fetched",
                data: formattedClasses
            });

        } catch (error) {
            console.error("Error searching classes:", error);
            res.status(500).json({
                success: false,
                message: "Internal server error",
                error: error.message
            });
        }
    },

    async getClass(req, res) {
        try {
            const classes = await Class.findAll();

            res.status(200).json({
                success: true,
                message: "Classes retrived successfully!",
                data: classes
            });
        } catch (error) {
            console.error('Error fetching classes:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    async editClass(req, res) {
        try {
            const { id } = req.params;
            const {name, year, subjectCount} = req.body;

            const chekClass = await Class.findByPk(id);
            if(!chekClass) {
                return res.status(404).json({ message: 'Class not found with this id' });
            }

            const updateClass = {};
            if (name) updateClass.name = name;
            if (year) updateClass.year = year;
            if (subjectCount) updateClass.subject_count = subjectCount;

            // Check if at least one field is being updated
            if (Object.keys(updateClass).length === 0) {
                return res.status(400).json({ message: "No valid fields provided for update." });
            }

            const [affectedRows] = await Class.update(updateClass, {
                where: { id }
            });

            if (affectedRows === 0) {
                return res.status(500).json({ message: "Failed to update class" });
            }

            const editedClass = await Class.findByPk(id);

            res.status(200).json({
                success: true,
                message: "Class updated successfully!",
                data: editedClass
            });
        } catch (error) {
            console.error('Error updating class:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    async deleteClass(req, res) {
        try {
            const { id } = req.params;

            // Check if the class exists
            const existingClass = await Class.findByPk(id);
            if (!existingClass) {
                return res.status(404).json({ message: `Class not found with id` });
            }

            await Class.destroy({ where: { id } });

            res.status(200).json({
                success: true,
                message: "Class deleted Successfully!"
            });
        } catch (error) {
            console.error("Error deleting class:", error);
            res.status(500).json({ success: false, message: "Failed to delete class" });
        }
    }
}

module.exports = classController;