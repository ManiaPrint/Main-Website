import express from "express";
import cors from "cors";
import nodemailer from "nodemailer";

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// set up transporter (use Outlook SMTP)
const transporter = nodemailer.createTransport({
  host: "smtp.office365.com",
  port: 587,
  secure: false,
  auth: {
  user: process.env.OUTLOOK_USER,
  pass: process.env.OUTLOOK_PASS
}


// contact form eedpoint
app.post("/send-email", async (req, res) => {
  try {
    const { from_name, reply_to, subject, message, material } = req.body;

    const mailOptions = {
      from: `"${from_name}" <mania_print@outlook.com>`,
      to: "mania_print@outlook.com",
      replyTo: reply_to,
      subject: subject || "New message from Mania Print site",
      text: `From: ${from_name} (${reply_to})
Material: ${material || "N/A"}

${message}`
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Failed to send email" });
  }
});
app.use(cors({ origin: "*" }));
app.listen(3001, () => console.log("Server running on http://localhost:3001"));