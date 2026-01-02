// utils/emailService.js
import nodemailer from 'nodemailer';
import dotenv from 'dotenv'

dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER  , // Your Gmail address
    pass: process.env.EMAIL_PASS  // Your Gmail App Password (NOT your login password)
  }
});

export const sendWeeklyReport = async (userEmail, userName, expenses, totalSpent, startDate, endDate) => {
  
  // Create a list of expenses for the email body
  const expenseRows = expenses.map(exp => `
    <tr>
      <td style="padding: 8px; border-bottom: 1px solid #ddd;">${exp.item_name}</td>
      <td style="padding: 8px; border-bottom: 1px solid #ddd;">${exp.category}</td>
      <td style="padding: 8px; border-bottom: 1px solid #ddd;">₹${exp.price.toFixed(2)}</td>
    </tr>
  `).join('');

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
      <h2 style="color: #4F46E5;">📊 Weekly Expense Summary</h2>
      <p>Hi ${userName},</p>
      <p>Here is your spending summary from <strong>${startDate}</strong> to <strong>${endDate}</strong>.</p>
      
      <div style="background-color: #F3F4F6; padding: 15px; border-radius: 8px; text-align: center; margin: 20px 0;">
        <h3 style="margin: 0; color: #374151;">Total Spent</h3>
        <h1 style="margin: 5px 0; color: #DC2626;">₹${totalSpent.toFixed(2)}</h1>
      </div>

      <table style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr style="background-color: #f8f9fa;">
            <th style="padding: 8px; text-align: left;">Item</th>
            <th style="padding: 8px; text-align: left;">Category</th>
            <th style="padding: 8px; text-align: left;">Amount</th>
          </tr>
        </thead>
        <tbody>
          ${expenseRows}
        </tbody>
      </table>

      <p style="margin-top: 20px; font-size: 12px; color: #666;">
        Keep tracking to stay on budget! <br>
        - ExpenseTracker Pro Team
      </p>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: '"ExpenseTracker Pro" <' + process.env.EMAIL_USER + '>',
      to: userEmail,
      subject: `Your Weekly Expense Report (₹${totalSpent})`,
      html: htmlContent
    });
    console.log(`📧 Email sent to ${userEmail}`);
  } catch (error) {
    console.error(`❌ Failed to send email to ${userEmail}:`, error);
  }
};