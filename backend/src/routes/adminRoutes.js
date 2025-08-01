const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/login', adminController.login);
router.post('/refreshToken', adminController.renewToken);
router.post('/logout', authMiddleware.verifyAdminUser, adminController.logout);
router.post('/register', adminController.register);

router.get('/summary', authMiddleware.verifyAdminUser, adminController.getSummary);

router.post('/addEvent', authMiddleware.verifyAdminUser, adminController.addEvent);
router.get('/getEvents', authMiddleware.verifyAdminUser, adminController.getEvents);
router.put('/editEvent/:id', authMiddleware.verifyAdminUser, adminController.editEvent);
router.delete('/deleteEvent/:id', authMiddleware.verifyAdminUser, adminController.deleteEvent);

router.post('/addStudent', authMiddleware.verifyAdminUser, adminController.addStudent);
router.post('/fetchStudents', authMiddleware.verifyAdminUser, adminController.fetchStudents);
router.get('/getStudent/:id', authMiddleware.verifyAdminUser, adminController.getStudent);
router.put('/editStudent/:id', authMiddleware.verifyAdminUser, adminController.editStudent);
router.delete('/deleteStudent/:id', authMiddleware.verifyAdminUser, adminController.deleteStudent);

router.post('/addClass', authMiddleware.verifyAdminUser, adminController.addClass);
router.get('/getClasses', authMiddleware.verifyAdminUser, adminController.getClass);
router.put('/editClass/:id', authMiddleware.verifyAdminUser, adminController.editClass);
router.delete('/deleteClass/:id', authMiddleware.verifyAdminUser, adminController.deleteClass);

module.exports = router;