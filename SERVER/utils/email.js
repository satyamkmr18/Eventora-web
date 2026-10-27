const nodeMailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();

const transporter = nodeMailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

const sendBookingEmail = async (useremail, username, eventDetails) => {
    try {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: useremail,
            subject: "Event Booking Confirmation",
            html: `
                <h2> Hi ${Username}!</h2>
                <p>Your booking for the event <strong>${eventtitle}</strong> is succesfully confirmed </p>
                <p> than you for choosing Eventora.</P>
            `
        };
        await transporter.sendMail(mailOptions);
        console.log(`Booking email sent to ${useremail}`);
    } catch (error) {
        console.error(`Error sending booking email to ${useremail}:`, error);
    }
};

exports.sendotpemail = async (email, otp, type) => {
    try {
        const title = type === "account_verification" ? "Account Verification" : "Event Booking";
        const sms = type === "account_verification" 
        ?'please use the following OTP to verify your account on Eventora. This OTP will expire in 5 minutes.'
        : 'please use the following otp to verify and confirm your event booking on Eventora. This OTP will expire in 5 minutes.';

    const mailOptions = {
        from: process.env.EMAIL_USER,   
        to: email,
        subject: "Your OTP for Eventora",
        html: `
            <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px;">
            <h2 style="color: #111"> ${title} </h2>
            <p style="color: #555; font-size: 16px;">${sms}</p>
            <div style="margin: 20px auto; padding: 15px; font-size: 20px; font-weight: bold; background: #f4f4f4; width: max-content; letter-spacing: 5px;">${otp}</div>
            <p><strong>OTP:</strong> ${otp}</p>
            <p style="color: #999; font-size: 12px;">This code expires in 5 minutes. If you did not request this, please ignore this email.</p>
            </div>
        `,

    };
    await transporter.sendMail(mailOptions);
    console.log(`OTP email sent to ${email} for ${type}`);
}
catch (error) {
    console.error(`Error sending OTP email to ${email} for ${type}:`, error);
}

};