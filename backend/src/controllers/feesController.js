const Fees = require('../model/FeesModel');
const Class = require('../model/ClassModel');
const Student = require('../model/StudentModel');
const { Op } = require('sequelize');

const feesController = {

    async addFees(req, res) {
        try {
            const {classes, amount} = req.body;

            if (!classes || !amount) {
                return res.status(400).json({ message: "Required all fields." });
            }

            const existingClass = await Class.findByPk(classes);
            if(!existingClass) {
                return res.status(404).json({ message: "There is no class in this id"})
            }

            const existingFees = await Fees.findOne({ where: {class: classes} });
            if (existingFees) {
                return res.status(409).json({ message: "This class fees already existed"})
            }

            if (amount <= 0) {
                return res.status(400).json({ message: "Entern valid amount." });
            }

            const fees = await Fees.create({
                class: classes,
                amount
            });

            res.status(201).json({
                success: true,
                message: "Fees added successfully!",
                data: fees
            });
        } catch (error) {
            console.error('Fess adding error:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    async searchFees(req, res) {
        try {
            const { searchTerm } = req.body;

            let whereCondition = {};

            if (searchTerm && searchTerm.trim() !== "") {
                whereCondition = {
                    [Op.or]: [
                        { name: { [Op.like]: `%${searchTerm}%`}}
                    ]
                };
            }

            const fees = await Fees.findAll({
                include: [{
                    model: Class,
                    as: 'classFees',
                    where: whereCondition,
                    attributes: ['id','name']
                }],
                order: [['createdAt', 'DESC']]
            });

            res.status(200).json({
                success: true,
                message: searchTerm ? "Fees fetch with searchterm" : "All fees fetched",
                data: fees
            });
        } catch (error) {
            console.error('Error fetching fees:', error);
            res.status(500).json({ 
                success: false,
                message: 'Internal server error',
                error: error.message 
            });
        }
    },

    async getFees(req, res) {
        try {
            const {id} = req.params;

            const student = await Student.findByPk(id);
            const classes = student.class;

            const fees = await Fees.findOne({where: {class: classes}});

            res.status(200).json({
                success: true,
                message: "Fees get for student class",
                data: fees
            });
        } catch (error) {
            console.error('Error fetching fees:', error);
            res.status(500).json({ 
                success: false,
                message: 'Internal server error',
                error: error.message 
            });
        }
    },

    async editFees(req, res) {
        try {
            const { id } = req.params;
            const { classes, amount } = req.body;

            const existingFees = await Fees.findByPk(id);
            if (!existingFees) {
                return res.status(404).json({ message: 'Fees not found with this id' });
            }
            
            const existingClass = await Class.findByPk(classes);
            if (!existingClass) {
                return res.status(404).json({ message: "Class not found wih this id" });
            }

            const updateFees = {};
            if (classes) updateFees.class = classes;
            if (amount) updateFees.amount = amount;

            if (Object.keys(updateFees).length === 0) {
                return res.status(400).json({ message: "No valid fields provided for update." });
            }

            const [affectedRows] = await Fees.update(updateFees, {
                where: { id }
            });

            const updatedFees = await Fees.findByPk(id);

            res.status(200).json({
                success: true,
                message: "Fees update successfully!",
                data: updatedFees
            });
        } catch (error) {
            console.error('Error updating fees:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    async deleteFees(req, res) {
        try {
            const { id } = req.params;

            const existingFees = await Fees.findByPk(id);
            if(!existingFees) {
                return res.status(404).json({ message: 'Fees not found with this id' });
            }

            await Fees.destroy({ where: { id } });

            res.status(200).json({
                success: true,
                message: "Fees deleted successfully"
            });
        } catch (error) {
            console.error("Error deleting fees:", error);
            res.status(500).json({ success: false, message: "Failed to delete fees" });
        }
    }
}

module.exports = feesController;