const { Op } = require('sequelize');
const Students = require('../model/StudentModel');
const Class = require('../model/ClassModel');
const { formatMobileNumber } = require('../utils/functions');

const studentController = {

        async addStudent(req, res) {
        try {
            const {firstName, lastName, dateOfBirth, address, gender, gardian, religion, mobile, thiredOrUpper, teacherChild, registerNo, addmissionDate, classes, leaveDate } = req.body;

            if (!firstName || !lastName || !dateOfBirth || !address || !gender || !gardian || !religion || !mobile  || !registerNo || !addmissionDate || !classes ) {
                return res.status(400).json({ message: "All fields are required." });
            }

            const trimmedMobile = formatMobileNumber(mobile);

            const existingStudent = await Students.findOne({ where: { register_no: registerNo} });
            if (existingStudent) {
                return res.status(409).json({ message: `Register number already existing` });
            }

            const existingClass = await Class.findByPk(classes);
            if (!existingClass) {
                return res.status(409).json({ message: `There is no any class in this id` });
            }

            // Date validation
            const currentDate = new Date();
            currentDate.setHours(0, 0, 0, 0);

            const dob = new Date(dateOfBirth);
            const admission = new Date(addmissionDate);
            const leveDate = new Date(leaveDate);

            if (isNaN(dob.getTime())) {
                return res.status(400).json({ message: "Invalid date of birth format" });
            }

            if (isNaN(admission.getTime())) {
                return res.status(400).json({ message: "Invalid admission date format" });
            }

            if (admission > currentDate) {
                return res.status(400).json({ 
                    message: "Admission date cannot be in the future" 
                });
            }

            if (leveDate > currentDate) {
                return res.status(400).json({ 
                    message: "Leave date cannot be in the future" 
                });
            }

            const newStudent = await Students.create({
                first_name: firstName,
                last_name: lastName,
                dob: dateOfBirth,
                address,
                gender,
                gardian,
                religion,
                mobile: trimmedMobile,
                thired_or_upper: thiredOrUpper || 'false',
                teacher_child: teacherChild || 'false',
                register_no: registerNo,
                addmission_date: addmissionDate,
                class: classes,
                leave_date: leaveDate
            });

            res.status(201).json({
                success: true,
                message: "Student added successfully!",
                data: newStudent
            });
        } catch (error) {
            console.error('Student adding error:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    async fetchStudents(req, res) {
        try {
            const { searchTerm } = req.body;
            
            let whereCondition = {};
            
            if (searchTerm && searchTerm.trim() !== "") {
                whereCondition = {
                    [Op.or]: [
                        { first_name: { [Op.like]: `%${searchTerm}%` } },
                        { last_name: { [Op.like]: `%${searchTerm}%` } },
                        { register_no: { [Op.like]: `%${searchTerm}%` } }
                    ]
                };
            }

            let students = await Students.findAll({
                where: whereCondition,
                include: [{
                    model: Class,
                    as: 'classStudent',  
                    attributes: ['id', 'name', 'year'] 
                }],
                order: [['createdAt', 'DESC']] // Optional: order by creation date
            });

            // Separate students with and without leave_date
            const activeStudents = students.filter(student => !student.leave_date);
            const inactiveStudents = students.filter(student => student.leave_date);

            // Combine with inactive students at the end
            students = [...activeStudents, ...inactiveStudents];

            res.status(200).json({
                success: true,
                message: searchTerm ? "Students fetched with search term" : "All students fetched",
                data: students
            });

        } catch (error) {
            console.error('Error fetching students:', error);
            res.status(500).json({ 
                success: false,
                message: 'Internal server error',
                error: error.message 
            });
        }
    },

    async getStudent(req, res) {
        try {
            const { id } = req.params;

            const checkStudent = await Students.findByPk(id);
            if (!checkStudent) {
                return res.status(404).json({ message: 'Student not found with this id' });
            }

            const student = await Students.findOne({ 
                where: { id },
                include: [{
                    model: Class,
                    as: 'classStudent',  
                    attributes: ['id', 'name', 'year'] 
                }]
            });

            res.status(200).json({
                success: true,
                message: "Student data found",
                data: student
            });
        } catch (error) {
            console.error('Student getting error:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    async editStudent(req, res) {
        try {
            const { id } = req.params;
            const {firstName, lastName, dateOfBirth, address, gender, gardian, religion, mobile, thiredOrUpper, teacherChild, registerNo, addmissionDate, classes, leaveDate } = req.body;

            const checkStudent = await Students.findByPk(id);
            if (!checkStudent) {
                return res.status(404).json({ message: 'Student not found with this id' });
            }

            const currentDate = new Date();
            currentDate.setHours(0, 0, 0, 0);

            const updateStudent = {};
            if (firstName) updateStudent.first_name = firstName;
            if (lastName) updateStudent.last_name = lastName;

            if (dateOfBirth) {
                const dob = new Date(dateOfBirth);

                if (isNaN(dob.getTime())) {
                    return res.status(400).json({ message: "Invalid date of birth format" });
                }

                updateStudent.dob = dateOfBirth;
            } 

            if (address) updateStudent.address = address;
            if (gender) updateStudent.gender = gender;
            if (gardian) updateStudent.gardian = gardian;
            if (religion) updateStudent.religion = religion;

            if (mobile) {
                const trimmedMobile = formatMobileNumber(mobile);

                updateStudent.mobile = trimmedMobile;
            } 

            if (thiredOrUpper) updateStudent.thired_or_upper = thiredOrUpper || 'false';
            if (teacherChild) updateStudent.teacher_child = teacherChild || 'false';
            if (registerNo) updateStudent.register_no = registerNo;

            if (addmissionDate) {
                const admission = new Date(addmissionDate);

                if (isNaN(admission.getTime())) {
                    return res.status(400).json({ message: "Invalid admission date format" });
                }

                if (admission > currentDate) {
                    return res.status(400).json({ 
                        message: "Admission date cannot be in the future" 
                    });
                }

                updateStudent.addmission_date = addmissionDate;
            }

            if (classes) {
                const existingClass = await Class.findByPk(classes);
                if (!existingClass) {
                    return res.status(409).json({ message: `There is no any class in this id` });
                }

                updateStudent.class = classes;
            }

            if (leaveDate) {
                const leveDate = new Date(leaveDate);

                if (isNaN(leveDate.getTime())) {
                    return res.status(400).json({ message: "Invalid leave date format" });
                }

                if (leveDate > currentDate) {
                    return res.status(400).json({ 
                        message: "Leave date cannot be in the future" 
                    });
                }

                updateStudent.leave_date = leaveDate;
            }

            if (Object.keys(updateStudent).length === 0) {
                return res.status(400).json({ message: "No valid fields provided for update." });
            }

            const [affectedRows] = await Students.update(updateStudent, {
                where: { id }
            });

            if (affectedRows === 0) {
                return res.status(500).json({ message: "There is no update anthything" });
            }

            const updatedStudent = await Students.findByPk(id);

            res.status(200).json({
                success: true,
                message: "Student update successfully",
                data: updatedStudent
            });
        } catch (error) {
            console.error('Error updating student:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    async deleteStudent(req, res) {
        try {
            const { id } = req.params;

            const checkStudent = await Students.findByPk(id);
            if (!checkStudent) {
                return res.status(404).json({ message: 'Student not found with this id' });
            }

            await Students.destroy({ where: { id } });

            res.status(200).json({
                success: true,
                message: "Student deleted successfully"
            });
        } catch (error) {
            console.error("Error deleting student:", error);
            res.status(500).json({ success: false, message: "Failed to delete student" });
        }
    }
}

module.exports = studentController;