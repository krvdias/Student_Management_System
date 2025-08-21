const Students = require('./StudentModel');
const Teachers = require('./TeacherModel');
const Class = require('./ClassModel');
const Subjects = require('./SubjectModel');
const Marks = require('./MarksModel');
const GPA = require('./GPAModel');
const Avarage = require('./AvarageModel');
const Fees = require('./FeesModel');
const StudentFees = require('./StudentFeesModel');

//Define Associations
Students.belongsTo(Class, { foreignKey: "class", as: "classStudent"});
Fees.belongsTo(Class, { foreignKey: 'class', as: 'classFees'});
Marks.belongsTo(Students, { foreignKey: 'student', as: 'studentMark'});
Marks.belongsTo(Subjects, { foreignKey: 'subject', as: 'subjectMark'});
GPA.belongsTo(Students, { foreignKey: 'student', as: 'studentGPA'});
Avarage.belongsTo(Students, { foreignKey: 'student', as: 'studentAvarage'});
Class.belongsTo(Teachers, { foreignKey: 'teacher', as: 'classTeacher'});
StudentFees.belongsTo(Students, { foreignKey: 'student', as: 'studentTFees'});
//StudentFees.belongsTo(Fees, { foreignKey: 'fees', as: 'feesAmount'});

Class.hasMany(Students, { foreignKey: "class", as: "studentClass"});
Students.hasMany(Marks, { foreignKey: "student", as: "markStudent"});
Subjects.hasMany(Marks, { foreignKey: "subject", as: "markSubject"});
Students.hasMany(GPA, { foreignKey: "student", as: "gpaStudent"});
Students.hasMany(Avarage, { foreignKey: "student", as: "avarageStudent"});
//Fees.hasMany(StudentFees, { foreignKey: "fees", as: "amountFees"});

Class.hasOne(Fees, { foreignKey: "class", as: "feesClass"});
Teachers.hasOne(Class, { foreignKey: "teacher", as: "teacherClass"});
Students.hasOne(StudentFees, { foreignKey: "student", as: "feesTStudent"});

module.exports = {Students, Teachers, Class, Subjects, Marks, GPA, Avarage, Fees, StudentFees};