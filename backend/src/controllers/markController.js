const Marks = require('../model/MarksModel');
const GPA = require('../model/GPAModel');
const Avarage = require('../model/AvarageModel');
const Students = require('../model/StudentModel');
const Class = require('../model/ClassModel');
const Subject = require('../model/SubjectModel');
const { gradeGenerator, GPACalculator, avarageCalculator, GPACalculatorUpdate, avarageCalculatUpdate } = require('../utils/functions');
const { Op, Sequelize } = require('sequelize');

const markController = {

    async addMark(req, res) {
        try {
            const {registerNo, term, subject, marks} = req.body;

            if (!registerNo || !term || !subject || !marks) {
                return res.status(400).json({ message: "All fields are required." });
            }

            const existingStudent = await Students.findOne({ where: {register_no: registerNo} });
            if (!existingStudent) {
                return res.status(404).json({ message: `There is no any student in the register number` });
            }

            const existingSubject = await Subject.findByPk(subject);
            if (!existingSubject) {
                return res.status(404).json({ message: `There is no any subject in this id` });
            }

            const currentYear = new Date().getFullYear();

            const existingMarks = await Marks.findOne({
                where: {
                    student: existingStudent.id,
                    year: currentYear,
                    term: term,
                    subject: subject
                }
            });
            if (existingMarks) {
                return res.status(409).json({ message: `student, year, term and subject already exist` });
            }

            const existingClass = await Class.findOne({ where: { id: existingStudent.class }});

            // grade generating according to marks
            const grade = gradeGenerator(marks);
            const subjectCount = existingClass.subject_count;

            // Find or create GPA record
            let [gpaRecord, gpaCreated] = await GPA.findOrCreate({
                where: {
                    student: existingStudent.id,
                    year: currentYear,
                    term: term
                },
                defaults: {
                    student: existingStudent.id,
                    year: currentYear,
                    term: term,
                    count: 0 // Initialize with 0 if creating new record
                }
            });

            //new GPA generating
            const newGPA = GPACalculator(marks, subjectCount, gpaRecord.count || 0);
            
            // Find or create Average record
            let [averageRecord, averageCreated] = await Avarage.findOrCreate({
                where: {
                    student: existingStudent.id,
                    year: currentYear,
                    term: term
                },
                defaults: {
                    student: existingStudent.id,
                    year: currentYear,
                    term: term,
                    count: 0 // Initialize with 0 if creating new record
                }
            });

            //new avarage generating
            const newAverage = avarageCalculator(marks, subjectCount, averageRecord.count || 0);

            const addMarks = await Marks.create({
                year: currentYear,
                term: term,
                marks,
                grade: grade,
                subject,
                student: existingStudent.id
            });

            await GPA.update(
                { count: newGPA },
                { where: { id: gpaRecord.id } }
            );

            await Avarage.update(
                { count: newAverage },
                { where: { id: averageRecord.id } }
            );

            return res.status(201).json({
                success: true,
                message: "Marks added successfully",
                marks: addMarks,
                gpa: newGPA,
                average: newAverage
            });
        } catch (error) {
            console.error("Error adding marks:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    },

    async addStudentMark(req, res) {
        try {
            const { id } = req.params;
            const {term, subject, marks} = req.body;

            if (!term || !subject || !marks) {
                return res.status(400).json({ message: "All fields are required." });
            }

            const existingStudent = await Students.findByPk(id);
            if (!existingStudent) {
                return res.status(404).json({ message: `There is no any student in this id` });
            }

            const existingSubject = await Subject.findByPk(subject);
            if (!existingSubject) {
                return res.status(404).json({ message: `There is no any subject in this id` });
            }

            const existingClass = await Class.findOne({ where: { id: existingStudent.class }});

            // grade generating according to marks
            const grade = gradeGenerator(marks);
            const currentYear = new Date().getFullYear();
            const subjectCount = existingClass.subject_count;

            const existingMarks = await Marks.findOne({
                where: {
                    student: id,
                    year: currentYear,
                    term: term,
                    subject: subject
                }
            });
            if (existingMarks) {
                return res.status(409).json({ message: `student, year, term and subject already exist` });
            }

            const existingSubjectCount = await Marks.count({
                where: {
                    student: id,
                    year: currentYear,
                    term: term
                }
            });
            if (existingSubjectCount >= subjectCount) {
                return res.status(409).json({ message: `This students class this ${currentYear} year ${term} subject count exeeded. Please check class subject count` });
            }

            // Find or create GPA record
            let [gpaRecord, gpaCreated] = await GPA.findOrCreate({
                where: {
                    student: existingStudent.id,
                    year: currentYear,
                    term: term
                },
                defaults: {
                    student: existingStudent.id,
                    year: currentYear,
                    term: term,
                    count: 0 // Initialize with 0 if creating new record
                }
            });

            //new GPA generating
            const newGPA = GPACalculator(marks, subjectCount, gpaRecord.count || 0);
            
            // Find or create Average record
            let [averageRecord, averageCreated] = await Avarage.findOrCreate({
                where: {
                    student: existingStudent.id,
                    year: currentYear,
                    term: term
                },
                defaults: {
                    student: existingStudent.id,
                    year: currentYear,
                    term: term,
                    count: 0 // Initialize with 0 if creating new record
                }
            });

            //new avarage generating
            const newAverage = avarageCalculator(marks, subjectCount, averageRecord.count || 0);

            const addMarks = await Marks.create({
                year: currentYear,
                term: term,
                marks,
                grade: grade,
                subject,
                student: existingStudent.id
            });

            await GPA.update(
                { count: newGPA },
                { where: { id: gpaRecord.id } }
            );

            await Avarage.update(
                { count: newAverage },
                { where: { id: averageRecord.id } }
            );

            return res.status(201).json({
                success: true,
                message: "Marks added successfully",
                marks: addMarks,
                gpa: newGPA,
                average: newAverage
            });
        } catch (error) {
            console.error("Error adding marks:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    },

    async fetchMarks(req, res) {
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
                attributes: ['id', 'first_name', 'last_name', 'register_no', 'leave_date'],
                include: [{
                    model: Class,
                    as: 'classStudent',  
                    attributes: ['id', 'name'] 
                }],
                order: [['createdAt', 'DESC']] // Optional: order by creation date
            });

            // Get latest GPA and average for each student
            const studentsWithPerformance = await Promise.all(
                students.map(async student => {
                    // Get latest GPA
                    const latestGPA = await GPA.findOne({
                        where: { student: student.id },
                        attributes: ['count', 'year', 'term'],
                        order: [['year', 'DESC'], ['createdAt', 'DESC']],
                        raw: true
                    });

                    // Get latest average (for the same year as GPA if exists)
                    const latestAverage = latestGPA ? await Avarage.findOne({
                        where: { 
                            student: student.id,
                            year: latestGPA.year,
                            term: latestGPA.term
                        },
                        attributes: ['count', 'year', 'term'],
                        order: [['term', 'DESC'], ['createdAt', 'DESC']],
                        raw: true
                    }) : null;

                    return {
                        ...student.get({ plain: true }),
                        performance: {
                            gpa: latestGPA ? {
                                value: latestGPA.count,
                                year: latestGPA.year,
                                term: latestGPA.term
                            } : null,
                            average: latestAverage ? {
                                value: latestAverage.count,
                                year: latestGPA.year, // Same year as GPA
                                term: latestAverage.term
                            } : null
                        }
                    };
                })
            );

            // Separate students with and without leave_date
            const activeStudents = studentsWithPerformance.filter(student => !student.leave_date);
            const inactiveStudents = studentsWithPerformance.filter(student => student.leave_date);

            // Combine with inactive students at the end
            students = [...activeStudents, ...inactiveStudents];

            res.status(200).json({
                success: true,
                message: searchTerm ? "Students fetched with search term" : "All students fetched",
                data: students
            });
        } catch (error) {
            console.error("Error fetching student marks:", error);
            res.status(500).json({
                success: false,
                message: "Internal server error",
                error: error.message
            });
        }
    },

    async getLatestMarks(req, res) {
        try {
            const { searchTerm , id } = req.body;

            // Verify student exists
            const student = await Students.findByPk(id);
            if (!student) {
                return res.status(404).json({
                    success: false,
                    message: "Student not found"
                });
            }

            // Get the latest academic year from marks
            const latestYearRecord = await Marks.findOne({
                where: { student: id },
                attributes: [
                    [Sequelize.fn('MAX', Sequelize.col('year')), 'latestYear']
                ],
                raw: true
            });

            if (!latestYearRecord || !latestYearRecord.latestYear) {
                return res.status(200).json({
                    success: true,
                    message: "No marks found for this student",
                    data: []
                });
            }

            const latestYear = latestYearRecord.latestYear;

            // Build the marks query
            let marksWhere = {
                student: id,
                year: latestYear
            };

            let subjectInclude = {
                model: Subject,
                as: 'subjectMark',
                attributes: ['id', 'name'],
                required: true
            };

            // Add subject filter if search term exists
            if (searchTerm && searchTerm.trim() !== "") {
                subjectInclude.where = {
                    name: { [Op.like]: `%${searchTerm}%` }
                };
            }

            // Get the latest marks for each subject in the latest year
            const latestMarks = await Marks.findAll({
                where: marksWhere,
                include: [subjectInclude],
                order: [
                    ['term', 'DESC'], // Get latest term first
                    ['createdAt', 'DESC'] // Get most recent record first
                ]
            });

            // Process to get unique latest marks per subject
            const uniqueSubjectMarks = {};
            latestMarks.forEach(mark => {
                const subjectId = mark.subject;
                if (!uniqueSubjectMarks[subjectId]) {
                    uniqueSubjectMarks[subjectId] = {
                        id: mark.id,
                        marks: mark.marks,
                        grade: mark.grade,
                        term: mark.term,
                        year: mark.year,
                        subject: mark.subjectMark,
                        createdAt: mark.createdAt
                    };
                }
            });

            // Convert to array and sort by subject name
            const result = Object.values(uniqueSubjectMarks).sort((a, b) => 
                a.subject.name.localeCompare(b.subject.name)
            );

            res.status(200).json({
                success: true,
                message: searchTerm 
                    ? `Filtered marks for ${latestYear}` 
                    : `Latest marks for ${latestYear}`,
                academicYear: latestYear,
                data: result
            });

        } catch (error) {
            console.error("Error fetching latest marks:", error);
            res.status(500).json({
                success: false,
                message: "Internal server error",
                error: error.message
            });
        }
    },

    async getAllMarks(req, res) {
        try {
            const { searchTerm , id } = req.body;

            // Verify student exists
            const student = await Students.findByPk(id);
            if (!student) {
                return res.status(404).json({
                    success: false,
                    message: "Student not found"
                });
            }

            // Get the latest academic year from marks
            const YearRecord = await Marks.findOne({
                where: { student: id }
            });

            if (!YearRecord) {
                return res.status(200).json({
                    success: true,
                    message: "No marks found for this student",
                    data: []
                });
            }

            // Build the marks query
            let marksWhere = {
                student: id
            };

            let subjectInclude = {
                model: Subject,
                as: 'subjectMark',
                attributes: ['id', 'name'],
                required: true
            };

            // Add subject filter if search term exists
            if (searchTerm && searchTerm.trim() !== "") {
                subjectInclude.where = {
                    name: { [Op.like]: `%${searchTerm}%` }
                };
            }

            // Get the latest marks for each subject in the latest year
            const latestMarks = await Marks.findAll({
                where: marksWhere,
                include: [subjectInclude],
                order: [
                    ['term', 'DESC'], // Get latest term first
                    ['createdAt', 'DESC'] // Get most recent record first
                ]
            });

            // Process to get unique latest marks per subject
            const uniqueSubjectMarks = {};
            latestMarks.forEach(mark => {
                const subjectId = mark.subject;
                if (!uniqueSubjectMarks[subjectId]) {
                    uniqueSubjectMarks[subjectId] = {
                        id: mark.id,
                        marks: mark.marks,
                        grade: mark.grade,
                        term: mark.term,
                        year: mark.year,
                        subject: mark.subjectMark,
                        createdAt: mark.createdAt
                    };
                }
            });

            // Convert to array and sort by subject name
            const result = Object.values(uniqueSubjectMarks).sort((a, b) => 
                a.subject.name.localeCompare(b.subject.name)
            );

            res.status(200).json({
                success: true,
                message: searchTerm 
                    ? `Filtered marks` 
                    : `All marks`,
                data: result
            });

        } catch (error) {
            console.error("Error fetching marks:", error);
            res.status(500).json({
                success: false,
                message: "Internal server error",
                error: error.message
            });
        }
    },

    async editMark(req, res) {
        try {
            const { id } = req.params;
            const { registerNo, term, subject, marks } = req.body;

            const existingMark = await Marks.findByPk(id);
            if (!existingMark) {
                return res.status(404).json({ message: 'Mark not found with this id' });
            }

            const updateMark = {};
            let existingStudent;

            if (registerNo) {
                existingStudent = await Students.findOne({ where: { register_no: registerNo } });
                if (!existingStudent) {
                    return res.status(404).json({ message: `There is no student with this register number` });
                }
                updateMark.student = existingStudent.id;
            } else {
                // Get the existing student if registerNo not provided
                existingStudent = await Students.findByPk(existingMark.student);
            }

            if (term) updateMark.term = term;

            if (subject) {
                const existingSubject = await Subject.findByPk(subject);
                if (!existingSubject) {
                    return res.status(404).json({ message: `There is no subject with this id` });
                }
                updateMark.subject = subject;
            }

            if (marks) {
                const grade = gradeGenerator(marks);
                const existingClass = await Class.findOne({ where: { id: existingStudent.class } });
                if (!existingClass) {
                    return res.status(404).json({ message: `Class not found for this student` });
                }
                
                const subjectCount = existingClass.subject_count;
                const currentTerm = term || existingMark.term;

                // Get or create GPA record
                let [gpaRecord] = await GPA.findOrCreate({
                    where: {
                        student: existingStudent.id,
                        year: existingMark.year,
                        term: currentTerm
                    },
                    defaults: {
                        student: existingStudent.id,
                        year: existingMark.year,
                        term: currentTerm,
                        count: 0
                    }
                });

                // Get or create Average record
                let [averageRecord] = await Avarage.findOrCreate({
                    where: {
                        student: existingStudent.id,
                        year: existingMark.year,
                        term: currentTerm
                    },
                    defaults: {
                        student: existingStudent.id,
                        year: existingMark.year,
                        term: currentTerm,
                        count: 0
                    }
                });

                // Update GPA and Average
                const updateGPA = GPACalculatorUpdate(marks, existingMark.marks, subjectCount, gpaRecord.count);
                const updateAverage = avarageCalculatUpdate(marks, existingMark.marks, subjectCount, averageRecord.count);

                updateMark.marks = marks;
                updateMark.grade = grade;
                
                await GPA.update(
                    { count: updateGPA },
                    { where: { id: gpaRecord.id } }
                );

                await Avarage.update(
                    { count: updateAverage },
                    { where: { id: averageRecord.id } }
                );
            }

            if (Object.keys(updateMark).length === 0) {
                return res.status(400).json({ message: "No valid fields provided for update." });
            }

            const [affectedRows] = await Marks.update(updateMark, {
                where: { id }
            });

            if (affectedRows === 0) {
                return res.status(500).json({ message: "There is no update anthything" });
            }

            const updatedMark = await Marks.findByPk(id); 

            return res.status(201).json({
                success: true,
                message: "Marks update successfully",
                marks: updatedMark,
            });
        } catch (error) {
            console.error("Error adding marks:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    },

    async deleteMark(req, res) {
        try {
            const { id } = req.params;

            // Validate mark exists
            const existingMark = await Marks.findByPk(id);
            if (!existingMark) {
                return res.status(404).json({ 
                    success: false,
                    message: 'Mark not found with this id' 
                });
            }

            // Get student information
            const existingStudent = await Students.findByPk(existingMark.student);
            if (!existingStudent) {
                return res.status(404).json({ 
                    success: false,
                    message: 'Student not found' 
                });
            }

            // Get class information
            const existingClass = await Class.findOne({ 
                where: { id: existingStudent.class }
            });
            if (!existingClass) {
                return res.status(404).json({ 
                    success: false,
                    message: 'Class not found' 
                });
            }

            const subjectCount = existingClass.subject_count;

            // Handle GPA update
            const gpaRecord = await GPA.findOne({
                where: {
                    student: existingMark.student,
                    year: existingMark.year,
                    term: existingMark.term
                }
            });

            if (gpaRecord) {
                const newGPA = GPACalculatorUpdate(0, existingMark.marks, subjectCount, gpaRecord.count);
                await GPA.update(
                    { count: newGPA },
                    { where: { id: gpaRecord.id } }
                );
            }

            // Handle Average update
            const averageRecord = await Avarage.findOne({
                where: {
                    student: existingMark.student,
                    year: existingMark.year,
                    term: existingMark.term
                }
            });

            if (averageRecord) {
                const newAverage = avarageCalculatUpdate(0, existingMark.marks, subjectCount, averageRecord.count);
                await Avarage.update(
                    { count: newAverage },
                    { where: { id: averageRecord.id } }
                );
            }

            // Delete the mark
            await Marks.destroy({ where: { id } });

            res.status(200).json({
                success: true,
                message: "Mark deleted successfully",
                deletedMarkId: id
            });

        } catch (error) {
            console.error("Error deleting mark:", error);
            res.status(500).json({ 
                success: false,
                message: "Failed to delete mark",
                error: error.message 
            });
        }
    }
}

module.exports = markController;