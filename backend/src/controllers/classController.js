const Class = require('../model/ClassModel');

const classController = {

    async addClass(req, res) {
        try {
            const {name, year} = req.body;

            if (!name || !year) {
                return res.status(400).json({ message: "All fields are required." });
            }

            const existingClass = await Class.findOne({ where: { name } });
            if (existingClass) {
                return res.status(409).json({ message: `Class name already existing` });
            }

            const newClass = await Class.create({
                name,
                year
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
            const {name, year} = req.body;

            const chekClass = await Class.findByPk(id);
            if(!chekClass) {
                return res.status(404).json({ message: 'Class not found with this id' });
            }

            const updateClass = {};
            if (name) updateClass.name = name;
            if (year) updateClass.year = year;

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
            })
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