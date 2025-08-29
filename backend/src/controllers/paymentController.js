const StudentFees = require('../model/StudentFeesModel');
const Fees = require('../model/FeesModel');
const Student = require('../model/StudentModel');
const Class = require('../model/ClassModel');
const { calculateFees, checkCurrentTerm } = require('../utils/functions');
const { Op } = require('sequelize');


const paymentController = {

    async addPayment(req, res) {
        try {
            const { student, billId, term, method, discount } = req.body;

            // Validate required fields
            if (!student || !term || !billId || !method) {
                return res.status(400).json({ message: "All fields are required." });
            }

            // Check student exists
            const existingStudent = await Student.findByPk(student);
            if (!existingStudent) {
                return res.status(404).json({ message: `Student not found with this ID` });
            }

            // Get current term
            const currentTerm = checkCurrentTerm();

            // Get student's fees amount
            const studentWithFees = await Student.findOne({
                where: { id: student },
                include: [{
                    model: Class,
                    as: 'classStudent',
                    include: [{
                        model: Fees,
                        as: 'feesClass',
                        attributes: ['id', 'amount']
                    }]
                }]
            });

            if (!studentWithFees?.classStudent?.feesClass) {
                return res.status(400).json({ message: "Student's class or fees not found" });
            }

            const feeAmount = studentWithFees.classStudent.feesClass.amount;
            const finalFee = calculateFees(feeAmount, discount);

            // Check if there's an unpaid/pending payment for the requested term
            const existingUnpaid = await StudentFees.findOne({
                where: {
                    student: student,
                    term: term,
                    status: { 
                        [Op.or]: ["not paid", "pending"]
                    }
                },
                order: [['createdAt', 'DESC']]
            });

            if (existingUnpaid) {
                // Found unpaid/pending record for the requested term
                const payment = await existingUnpaid.update({
                    bill_id: billId,
                    fees: finalFee,
                    method,
                    status: "paid",
                    payed_date: new Date()
                });

                return res.status(200).json({
                    success: true,
                    message: "Payment processed successfully for requested term",
                    payment
                });
            }

            // If no unpaid record found for requested term, check if it's current term
            if (term !== currentTerm.term) {
                return res.status(400).json({ 
                    success: false,
                    message: `No unpaid record found for ${term}. Payment can only be made for current term (${currentTerm.term}) or existing unpaid terms.`
                });
            }

            // For current term, check if already paid
            const currentTermPayment = await StudentFees.findOne({
                where: {
                    student: student,
                    term: currentTerm.term,
                    status: "paid"
                }
            });

            if (currentTermPayment) {
                return res.status(400).json({
                    success: false,
                    message: "You already paid this term"
                });
            }

            // Check previous terms payment status (only for current term payments)
            const termsOrder = ["1st Term", "2nd Term", "3rd Term"];
            const currentTermIndex = termsOrder.indexOf(currentTerm.term);
            
            if (currentTermIndex > 0) {
                const previousTerm = termsOrder[currentTermIndex - 1];
                const previousTermPayment = await StudentFees.findOne({
                    where: {
                        student: student,
                        term: previousTerm,
                    },
                    order: [['createdAt', 'DESC']]
                });

                if (previousTermPayment && 
                    previousTermPayment.status !== "paid" && 
                    previousTermPayment.createdAt.getFullYear() === new Date().getFullYear()) {
                    return res.status(400).json({
                        success: false,
                        message: `You have not paid ${previousTerm} fees. Please pay that first.`
                    });
                }
            }

            // Create new payment record for current term
            const payment = await StudentFees.create({
                student: student,
                bill_id: billId,
                fees: finalFee,
                method,
                term: currentTerm.term,
                status: "paid",
                payed_date: new Date()
            });

            if (!payment) {
                throw new Error("Payment creation failed - returned null");
            }

            return res.status(200).json({
                success: true,
                message: "Payment processed successfully",
                payment
            });

        } catch (error) {
            console.error('Error in addPayment:', error);
            return res.status(500).json({ 
                message: "Internal server error", 
                error: error.message 
            });
        }
    },

    async searchPayment(req, res) {
        try {
            const {searchTerm} = req.body;

            let whereCondition = {};
            if (searchTerm && searchTerm.trim() !== "") {
                whereCondition = {
                    [Op.or]: [
                        { term: { [Op.like]: `%${searchTerm}%` } },
                        { bill_id: { [Op.like]: `%${searchTerm}%` } },
                        { status: { [Op.like]: `%${searchTerm}%` } },
                        // Correct way to search in associated model
                        { '$studentTFees.register_no$': { [Op.like]: `%${searchTerm}%` } },
                        { '$studentTFees.first_name$': { [Op.like]: `%${searchTerm}%` } },
                        { '$studentTFees.last_name$': { [Op.like]: `%${searchTerm}%` } }
                    ]
                }
            }

            let payments = await StudentFees.findAll({
                where: whereCondition,
                include: [{
                    model: Student,
                    as: 'studentTFees',
                    attributes: ['id', 'first_name', 'last_name', 'register_no']
                }],
                attributes: ['id','term','bill_id','payed_date','fees', 'method', 'status', 'createdAt'],
                order: [['createdAt','DESC']]
            });

            res.status(200).json({
                success: true,
                message: searchTerm ? "Payements fetch with search term" : "All paymentd fetched",
                data: payments
            });
        } catch (error) {
            console.error('Error fetching payments:', error);
            res.status(500).json({ 
                success: false,
                message: 'Internal server error',
                error: error.message 
            });
        }
    },

    async getStudentPayments(req, res) {
        try {
            const { id } = req.params;
            
            const existingStudent = await Student.findByPk(id);
            if (!existingStudent) {
                return res.status(404).json({ message: `There is no any student in this id` });
            }

            const student = await Student.findAll({
                where: { id },
                include: [{
                    model: StudentFees,
                    as: 'feesTStudent',
                    attributes: ['id','term','bill_id','payed_date','fees','method','status','createdAt'],
                    order: [['createdAt', 'DESC']]
                }],
                attributes: ['id','first_name','last_name','register_no','religion','thired_or_upper','teacher_child']
            });

            // Extract student data from first payment (all should have the same student)
            const studentData = student.length > 0 ? {
                id: student[0].id,
                first_name: student[0].first_name,
                last_name: student[0].last_name,
                register_no: student[0].register_no,
                religion: student[0].religion,
                thired_or_upper: student[0].thired_or_upper,
                teacher_child: student[0].teacher_child,
                feesTStudent: student.map(student => student.feesTStudent)
            } : null;

            res.status(200).json({
                success: true,
                message: "Payement data found",
                data: studentData
            });
        } catch (error) {
            console.error('Payment fetch error:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
}

module.exports = paymentController;