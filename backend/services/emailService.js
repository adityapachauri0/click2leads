const nodemailer = require('nodemailer');
const path = require('path');

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: process.env.SMTP_PORT || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    // Verify connection
    this.transporter.verify((error, success) => {
      if (error) {
        console.error('Email service error:', error);
      } else {
        console.log('Email service ready');
      }
    });
  }

  // Base email template
  getEmailTemplate(content) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Click2Leads</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: white; padding: 30px; border: 1px solid #e1e1e1; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; padding: 12px 30px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
          .warning { background: #fff3cd; border: 1px solid #ffc107; color: #856404; padding: 10px; border-radius: 5px; margin: 15px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Click2Leads</h1>
            <p>Digital Marketing Excellence</p>
          </div>
          <div class="content">
            ${content}
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} Click2Leads. All rights reserved.</p>
            <p>Click2Leads Ltd, London, United Kingdom</p>
            <p><a href="${process.env.FRONTEND_URL}/unsubscribe">Unsubscribe</a> | <a href="${process.env.FRONTEND_URL}/privacy">Privacy Policy</a></p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  // Send welcome email
  async sendWelcomeEmail(user, verificationToken) {
    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;
    
    const content = `
      <h2>Welcome to Click2Leads, ${user.name}!</h2>
      <p>Thank you for creating an account with us. We're excited to help you grow your business with our digital marketing solutions.</p>
      <p>Please verify your email address by clicking the button below:</p>
      <div style="text-align: center;">
        <a href="${verificationUrl}" class="button">Verify Email Address</a>
      </div>
      <p>Or copy and paste this link into your browser:</p>
      <p style="word-break: break-all; color: #667eea;">${verificationUrl}</p>
      <div class="warning">
        <strong>Important:</strong> This verification link will expire in 24 hours.
      </div>
      <p>If you didn't create an account with Click2Leads, please ignore this email.</p>
    `;

    const mailOptions = {
      from: `Click2Leads <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
      to: user.email,
      subject: 'Welcome to Click2Leads - Verify Your Email',
      html: this.getEmailTemplate(content)
    };

    return this.sendEmail(mailOptions);
  }

  // Send password reset email
  async sendPasswordResetEmail(user, resetToken) {
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
    
    const content = `
      <h2>Password Reset Request</h2>
      <p>Hi ${user.name},</p>
      <p>We received a request to reset your password. Click the button below to create a new password:</p>
      <div style="text-align: center;">
        <a href="${resetUrl}" class="button">Reset Password</a>
      </div>
      <p>Or copy and paste this link into your browser:</p>
      <p style="word-break: break-all; color: #667eea;">${resetUrl}</p>
      <div class="warning">
        <strong>Important:</strong> This link will expire in 10 minutes for security reasons.
      </div>
      <p>If you didn't request a password reset, please ignore this email and your password will remain unchanged.</p>
      <p>For security reasons, we recommend that you:</p>
      <ul>
        <li>Use a strong, unique password</li>
        <li>Enable two-factor authentication</li>
        <li>Never share your password with anyone</li>
      </ul>
    `;

    const mailOptions = {
      from: `Click2Leads Security <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
      to: user.email,
      subject: 'Password Reset Request - Click2Leads',
      html: this.getEmailTemplate(content)
    };

    return this.sendEmail(mailOptions);
  }

  // Send lead notification to admin
  async sendLeadNotification(lead) {
    const content = `
      <h2>New Lead Received!</h2>
      <p>A new lead has been submitted through the website:</p>
      <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #e1e1e1;"><strong>Name:</strong></td>
          <td style="padding: 10px; border-bottom: 1px solid #e1e1e1;">${lead.name}</td>
        </tr>
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #e1e1e1;"><strong>Email:</strong></td>
          <td style="padding: 10px; border-bottom: 1px solid #e1e1e1;"><a href="mailto:${lead.email}">${lead.email}</a></td>
        </tr>
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #e1e1e1;"><strong>Phone:</strong></td>
          <td style="padding: 10px; border-bottom: 1px solid #e1e1e1;">${lead.phone}</td>
        </tr>
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #e1e1e1;"><strong>Company:</strong></td>
          <td style="padding: 10px; border-bottom: 1px solid #e1e1e1;">${lead.company || 'N/A'}</td>
        </tr>
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #e1e1e1;"><strong>Service:</strong></td>
          <td style="padding: 10px; border-bottom: 1px solid #e1e1e1;">${lead.service}</td>
        </tr>
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #e1e1e1;"><strong>Budget:</strong></td>
          <td style="padding: 10px; border-bottom: 1px solid #e1e1e1;">${lead.budget || 'N/A'}</td>
        </tr>
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #e1e1e1;"><strong>Message:</strong></td>
          <td style="padding: 10px; border-bottom: 1px solid #e1e1e1;">${lead.message || 'N/A'}</td>
        </tr>
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #e1e1e1;"><strong>Source:</strong></td>
          <td style="padding: 10px; border-bottom: 1px solid #e1e1e1;">${lead.source}</td>
        </tr>
      </table>
      <div style="text-align: center;">
        <a href="${process.env.FRONTEND_URL}/dashboard/leads/${lead._id}" class="button">View in Dashboard</a>
      </div>
      <p><strong>Lead Score:</strong> ${lead.score}/100</p>
      <p><strong>Submitted:</strong> ${new Date(lead.createdAt).toLocaleString()}</p>
    `;

    const mailOptions = {
      from: `Click2Leads Leads <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
      to: process.env.ADMIN_EMAIL || process.env.SMTP_USER,
      subject: `New Lead: ${lead.name} - ${lead.service}`,
      html: this.getEmailTemplate(content)
    };

    return this.sendEmail(mailOptions);
  }

  // Send lead confirmation to customer
  async sendLeadConfirmation(lead) {
    const content = `
      <h2>Thank You for Contacting Click2Leads!</h2>
      <p>Dear ${lead.name},</p>
      <p>We've received your inquiry and we're excited to help you grow your business with our ${lead.service} services.</p>
      <p><strong>What happens next?</strong></p>
      <ol>
        <li>Our team will review your requirements within the next 24 hours</li>
        <li>A dedicated account manager will contact you to discuss your needs</li>
        <li>We'll prepare a customized proposal based on your budget and goals</li>
      </ol>
      <p><strong>Your submission details:</strong></p>
      <ul>
        <li>Service Requested: ${lead.service}</li>
        <li>Budget Range: ${lead.budget || 'To be discussed'}</li>
        <li>Submitted: ${new Date(lead.createdAt).toLocaleDateString()}</li>
      </ul>
      <p>In the meantime, feel free to:</p>
      <ul>
        <li><a href="${process.env.FRONTEND_URL}/case-studies">View our case studies</a></li>
        <li><a href="${process.env.FRONTEND_URL}/services">Explore our services</a></li>
        <li><a href="${process.env.FRONTEND_URL}/about">Learn more about us</a></li>
      </ul>
      <p>If you have any urgent questions, please don't hesitate to call us at <strong>+44 20 1234 5678</strong>.</p>
      <p>Best regards,<br>The Click2Leads Team</p>
    `;

    const mailOptions = {
      from: `Click2Leads <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
      to: lead.email,
      subject: 'Thank You for Contacting Click2Leads',
      html: this.getEmailTemplate(content)
    };

    return this.sendEmail(mailOptions);
  }

  // Base send email method
  async sendEmail(mailOptions) {
    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log('Email sent:', info.messageId);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error('Email send error:', error);
      return { success: false, error: error.message };
    }
  }
}

module.exports = new EmailService();