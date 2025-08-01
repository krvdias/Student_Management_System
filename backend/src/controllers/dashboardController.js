const Students = require('../model/StudentModel');
const Teachers = require('../model/TeacherModel');

const dashboardController = {

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
    }
}

module.exports = dashboardController;