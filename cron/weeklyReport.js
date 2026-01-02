// cron/weeklyReport.js
import cron from 'node-cron';
import User from '../models/User.js';
import Expense from '../models/Expense.js';
import { sendWeeklyReport } from '../utils/emailService.js'; // Adjust path if needed
import { format, subDays } from 'date-fns';

const setupCronJobs = () => {
  // Schedule: Runs every Sunday at 9:00 AM
  // Cron format: "Minute Hour DayMonth Month DayWeek"
  // "0 9 * * 0" = At 09:00 on Sunday.
  cron.schedule('0 9 * * 0', async () => {
    console.log('⏰ Running Weekly Expense Report Job...');

    try {
      const users = await User.find({});
      const endDate = new Date();
      const startDate = subDays(endDate, 7);

      for (const user of users) {
        // 1. Find expenses for this user in the last 7 days
        const expenses = await Expense.find({
          user: user._id, // Ensure this matches your Schema (user vs userId)
          date: { $gte: startDate, $lte: endDate }
        });

        if (expenses.length > 0) {
          // 2. Calculate Total
          const totalSpent = expenses.reduce((sum, exp) => sum + exp.price, 0);

          // 3. Send Email
          await sendWeeklyReport(
            user.email,
            user.name,
            expenses,
            totalSpent,
            format(startDate, 'MMM d'),
            format(endDate, 'MMM d')
          );
        }
      }
      console.log('✅ Weekly reports processing finished.');
    } catch (error) {
      console.error('❌ Error in weekly report job:', error);
    }
  });
};

export default setupCronJobs;