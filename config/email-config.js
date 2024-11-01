const nodemailer = require("nodemailer");
const constantVariables = require("./constant-variables");

function isValidEmail(email) {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);
}

const transporter = nodemailer.createTransport({
    host: constantVariables.EMAIL_HOST,
    port: constantVariables.EMAIL_PORT,
    secure: true,
    auth: {
        user: constantVariables.EMAIL,
        pass: constantVariables.APP_PASSWORD,
    },
});

const mailOptions = (email, subject, content) => {
    const senderEmail = constantVariables.EMAIL;

    if (!senderEmail) {
        throw new ErrorCreator(
            StatusCodes.INTERNAL_SERVER_ERROR,
            "Sender email is not defined in the environment variables."
        );
    }

    return {
        from: {
            name: "CatalogueWala",
            address: senderEmail,
        },
        to: email,
        subject: subject,
        html: content,
    };
};

module.exports = { isValidEmail, transporter, mailOptions };