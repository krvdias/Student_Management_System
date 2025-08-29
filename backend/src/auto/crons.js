const cron = require("node-cron");
const { checkCurrentTerm } = require("../utils/functions");
const StudentFees = require("../model/StudentFeesModel");
const Students = require('../model/StudentModel');

function startPaymentStatusCronJob() {
    // Runs every day at 1 AM (changed from */3 * * * * for testing)
    cron.schedule('0 1 * * *', async () => {
        try {
            console.log("Auto-checking current term and updating payment statuses for next term...");

            const currentTermInfo = checkCurrentTerm();
            const currentTerm = currentTermInfo.term;
            const termsOrder = ["1st Term", "2nd Term", "3rd Term"];
            const currentTermIndex = termsOrder.indexOf(currentTerm);

            // Fixed term rotation logic
            /*let nextTerm;
            if (currentTermIndex === 2) { // If current term is 3rd Term
                nextTerm = termsOrder[0]; // Next term is 1st Term
            } else {
                nextTerm = termsOrder[currentTermIndex + 1];
            }*/

            // Get all students with their latest payment
            const students = await Students.findAll();
            for (const student of students) {
                const latestPayment = await StudentFees.findOne({
                    where: { student: student.id },
                    order: [['createdAt', 'DESC']]
                });

                // Case 1: No payment record exists at all
                if (!latestPayment) {
                    console.log('No payment record exists at all create record');
                    await StudentFees.create({
                        student: student.id,
                        term: currentTerm.term,
                        status: 'pending'
                    });
                    continue;
                }

                // Case 2: Latest payment is for current term and is paid - skip
                if (latestPayment.term === currentTerm && latestPayment.status === 'paid') {
                    console.log('Latest payment is for current term and is paid - skip');
                    continue;
                }

                // Case 3: Latest payment is for current term but pending - skip
                if (latestPayment.term === currentTerm && latestPayment.status === 'pending') {
                    console.log('Latest payment is for current term but pending - skip');
                    continue;
                }

                // Case 4: Latest payment is for previous term and is paid - create new pending for next term
                if (latestPayment.term !== currentTerm && latestPayment.status === 'paid') {
                    console.log('Latest payment is for previous term and is paid - create new pending for next term');
                    await StudentFees.create({
                        student: student.id,
                        term: currentTerm,
                        status: 'pending'
                    });
                    continue;
                }

                // Case 5: Latest payment is for previous term but pending - update to 'not paid'
                if (latestPayment.term !== currentTerm.term && latestPayment.status === 'pending') {
                    console.log("Latest payment is for previous term but pending - update to 'not paid'")
                    await latestPayment.update({
                        status: 'not paid'
                    });
                }
            }

            console.log("Payment status update completed successfully.");
        } catch (error) {
            console.error('Error in payment status cron job:', error);
        }
    });
}

// Export the function to be called from index.js
module.exports = startPaymentStatusCronJob;