const { generateAccessToken, generateRefreshToken, verifyRefreshToken } = require('../middleware/authMiddleware');
const Admin = require('../model/AdminModel');
const bcrypt = require('bcrypt');
const Students = require('../model/StudentModel');
const Teachers = require('../model/TeacherModel');
const Events = require('../model/EventModel');
const Class = require('../model/ClassModel');
const { Op } = require('sequelize');

const adminController = {

    async login(req, res) {
        try {
            const { username, password } = req.body;

            if (!username || !password ) {
                return res.status(401).json({ message: 'All fields required' });
            }

            const admin = await Admin.findOne({ where: { username }});

            if (admin) {
                const isValidPassword = await bcrypt.compare(password, admin.password);
                if (!isValidPassword) {
                    return res.status(401).json({ message: 'Invalid credentials' });
                }

                const accessToken = generateAccessToken(admin);
                const refreshToken = generateRefreshToken(admin);

                admin.refresh_token = refreshToken;
                await admin.save();

                res.json({
                    accessToken,
                    refreshToken,
                    username: admin.username,
                    id: admin.id
                });
            } else {
                return res.status(404).json({ message: 'There is no admin using this username' });
            }
        } catch (error) {
            console.error('Login error:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }, 

    async renewToken(req, res) {
        try {
            const { refreshToken } = req.body;

            if (!refreshToken) {
                return res.status(401).json({ message: 'Refresh token required' });
            }

            const isTokenCorrect = verifyRefreshToken(refreshToken);

            if (isTokenCorrect) {
                const admin = await Admin.findOne({ where: { refresh_token: refreshToken } });

                if (!admin) {
                    return res.status(401).json({ message: "Can't renew token. Login again" });
                }

                const accessToken = generateAccessToken(admin);
                const newRefreshToken = generateRefreshToken(admin);

                res.json({
                    accessToken,
                    refreshToken: newRefreshToken
                });
            } else {
                return res.status(401).json({ message: 'Invalid refresh token' });
            }
        } catch (error) {
            console.error('Refresh token error:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    async logout(req, res) {
        try {
            const { id } = req.body;

            if (!id) {
                return res.status(401).json({ message: 'ID required' });
            }

            const admin = await Admin.findByPk(id);

            admin.refresh_token = null;
            await admin.save();

            res.json({ message: 'Logged out successfully' });
        } catch (error) {
            console.error('Logout error:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    async register(req, res) {
        try {
            const { username, email, password } = req.body;

            if (!username || !email || !password) {
                return res.status(401).json({message: "required all fields."});
            }

            const admin = await Admin.create({
                username,
                email,
                password
            });

            res.status(200).json({ success: true, message: "Admin Register Successfully", data: admin });
        } catch (error) {
            console.error('Register error:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    async getSummary(req, res) {
        try {
            const studentsCount = await Students.count();
            const teachersCount = await Teachers.count();

            return res.json({
                success: true,
                message: "Summery fetch",
                data: {
                    studentsCount,
                    teachersCount
                }
            });
        } catch (error) {
            console.error("Error fetching summery:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    },

    async addEvent(req, res) {
        try {
            const { title, coordinator, event_date } = req.body;

            if (!title || !event_date) {
                return res.status(400).json({ message: "Title and event date are required fields." });
            }

            // Create today's date at midnight UTC
            const today = new Date();
            today.setUTCHours(0, 0, 0, 0);

            // Parse the incoming event date as UTC
            const eventDate = new Date(event_date + "T00:00:00Z");
            if (isNaN(eventDate.getTime())) {
                return res.status(400).json({ message: "Invalid date format." });
            }

            if (eventDate <= today) {
                return res.status(400).json({ message: "Event date must be in the future." });
            }

            const event = await Events.create({
                title,
                coordinator,
                event_date: event_date // Use raw string or ensure DATEONLY type
            });

            res.status(201).json({
                success: true,
                message: "Event added successfully!",
                data: event
            });
        } catch (error) {
            console.error('Event adding error:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    async getEvents(req, res) {
        try {
            const today = new Date();
            today.setHours(0,0,0,0);

            const upcomingEvents = await Events.findAll({
                where: {
                    event_date: {
                        [Op.gte]: today // Greater than or equal to today
                    }
                },
                order: [
                    ['event_date', 'ASC'] // Sort by date in ascending order (earliest first)
                ]
            });

            res.status(200).json({
                success: true,
                message: "Upcoming events retrieved successfully",
                data: upcomingEvents
            });
        } catch (error) {
            console.error('Error fetching events:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    async editEvent(req, res) {
        try {
            const { id } = req.params;
            const { title, coordinator, event_date } = req.body;

            // Check if the event exists
            const existingEvent = await Events.findByPk(id);
            if (!existingEvent) {
                return res.status(404).json({ message: 'Event not found with this id' });
            }

            let eventDate;
            if (event_date) {
                // Create today's date at midnight (to compare date-only)
                const today = new Date();
                today.setHours(0, 0, 0, 0);

                // Parse the incoming event date
                eventDate = new Date(event_date);
                if (isNaN(eventDate.getTime())) {
                    return res.status(400).json({ message: "Invalid date format." });
                }

                // Set time to midnight for comparison
                eventDate.setHours(0, 0, 0, 0);

                if (eventDate <= today) {
                    return res.status(400).json({ message: "Event date must be in the future." });
                }
            }

            // Prepare update object with only provided fields
            const updateData = {};
            if (title) updateData.title = title;
            if (coordinator) updateData.coordinator = coordinator;
            if (event_date) updateData.event_date = eventDate;

            // Check if at least one field is being updated
            if (Object.keys(updateData).length === 0) {
                return res.status(400).json({ message: "No valid fields provided for update." });
            }

            // Perform the update
            const [affectedRows] = await Events.update(updateData, {
                where: { id }
            });

            if (affectedRows === 0) {
                return res.status(500).json({ message: "There is no update anthything" });
            }

            // Fetch the updated event to return in response
            const updatedEvent = await Events.findByPk(id);

            res.status(200).json({
                success: true,
                message: "Event updated successfully",
                data: updatedEvent
            });

        } catch (error) {
            console.error('Error updating event:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    async deleteEvent(req, res) {
        try {
            const { id } = req.params;

            // Check if the event exists
            const existingEvent = await Events.findByPk(id);
            if (!existingEvent) {
                return res.status(404).json({ message: `Event not found with id` });
            }

            await Events.destroy({ where: {id} });

            res.status(200).json({ success: true, message: "Event deleted successfully" });
        } catch (error) {
            console.error("Error deleting event:", error);
            res.status(500).json({ success: false, message: "Failed to delete event" });
        }
    },

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
    },

    async addStudent(req, res) {
        try {
            const {firstName, lastName, dateOfBirth, address, gender, gardian, religion, mobile, thiredOrUpper, teacherChild, registerNo, addmissionDate, classes, leaveDate } = req.body;

            if (!firstName || !lastName || !dateOfBirth || !address || !gender || !gardian || !religion || !mobile  || !registerNo || !addmissionDate || !classes ) {
                return res.status(400).json({ message: "All fields are required." });
            }

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
                mobile,
                thired_or_upper: thiredOrUpper,
                teacher_child: teacherChild,
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

            const students = await Students.findAll({
                where: whereCondition,
                order: [['createdAt', 'DESC']] // Optional: order by creation date
            });

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

            const student = await Students.findOne({ where: { id } });

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
            if (mobile) updateStudent.mobile = mobile;
            if (thiredOrUpper) updateStudent.thired_or_upper = thiredOrUpper;
            if (teacherChild) updateStudent.teacher_child = teacherChild;
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

            if (classes) updateStudent.class = classes;

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

module.exports = adminController;