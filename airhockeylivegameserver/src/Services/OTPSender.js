import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: "ankursoni2974@gmail.com",
    pass: "qjst cggs finu eucy",
  },
});

export const OTPSender = async (email, subject, content) => {
  const info = await transporter.sendMail({
    from: "Neon Pong",
    to: email,
    subject: subject,
    text: content,
  });

  console.log("Message sent:", info.messageId);
};
