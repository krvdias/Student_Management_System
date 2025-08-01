const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');
const dashboardController = require('../controllers/dashboardController');
const eventController = require('../controllers/eventController');
const studentController = require('../controllers/studentController');
const classController = require('../controllers/classController');
const teacherController = require('../controllers/teacherController');
const markController = require('../controllers/markController');
const subjectController = require('../controllers/subjectController');

//Auth routes
router.post('/login', authController.login);
router.post('/refreshToken', authController.renewToken);
router.post('/logout', authMiddleware.verifyAdminUser, authController.logout);
router.post('/register', authController.register);

//Dashboard summery routes
router.get('/summary', authMiddleware.verifyAdminUser, dashboardController.getSummary);

//Event routes
router.post('/addEvent', authMiddleware.verifyAdminUser, eventController.addEvent);
router.get('/getEvents', authMiddleware.verifyAdminUser, eventController.getEvents);
router.put('/editEvent/:id', authMiddleware.verifyAdminUser, eventController.editEvent);
router.delete('/deleteEvent/:id', authMiddleware.verifyAdminUser, eventController.deleteEvent);

//Student routes
router.post('/addStudent', authMiddleware.verifyAdminUser, studentController.addStudent);
router.post('/fetchStudents', authMiddleware.verifyAdminUser, studentController.fetchStudents);
router.get('/getStudent/:id', authMiddleware.verifyAdminUser, studentController.getStudent);
router.put('/editStudent/:id', authMiddleware.verifyAdminUser, studentController.editStudent);
router.delete('/deleteStudent/:id', authMiddleware.verifyAdminUser, studentController.deleteStudent);

//Class routes
router.post('/addClass', authMiddleware.verifyAdminUser, classController.addClass);
router.post('/searchClass', authMiddleware.verifyAdminUser, classController.searchClass);
router.get('/getClasses', authMiddleware.verifyAdminUser, classController.getClass);
router.put('/editClass/:id', authMiddleware.verifyAdminUser, classController.editClass);
router.delete('/deleteClass/:id', authMiddleware.verifyAdminUser, classController.deleteClass);

//Teacher routes
router.post('/addTeacher', authMiddleware.verifyAdminUser, teacherController.addTeacher);
router.post('/searchTeachers', authMiddleware.verifyAdminUser, teacherController.searchTeacher);
router.put('/editTeacher/:id', authMiddleware.verifyAdminUser, teacherController.editTeacher);
router.delete('/deleteTeacher/:id', authMiddleware.verifyAdminUser, teacherController.deleteTeacher);

//Marks routes
router.post('/addMark', authMiddleware.verifyAdminUser, markController.addMark);
router.post('/addStudentMark/:id', authMiddleware.verifyAdminUser, markController.addStudentMark);
router.post('/markSummery', authMiddleware.verifyAdminUser, markController.fetchMarks);
router.post('/getMarks', authMiddleware.verifyAdminUser, markController.getLatestMarks);
router.post('/getAllMarks', authMiddleware.verifyAdminUser, markController.getAllMarks);
router.put('/editMark/:id', authMiddleware.verifyAdminUser, markController.editMark);
router.delete('/deleteMark/:id', authMiddleware.verifyAdminUser, markController.deleteMark);

//Subject routes
router.post('/addSubject', authMiddleware.verifyAdminUser, subjectController.addSubject);
router.post('/searchSubject', authMiddleware.verifyAdminUser, subjectController.searchSubject);
router.get('/getSubjects', authMiddleware.verifyAdminUser, subjectController.getSubjects);
router.put('/editsubject/:id', authMiddleware.verifyAdminUser, subjectController.editSubject);
router.delete('/deleteSubject/:id', authMiddleware.verifyAdminUser, subjectController.deleteSubject);

module.exports = router;