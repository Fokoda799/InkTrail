import { VERIFICATION_EMAIL_TEMPLATE } from "./emailTemplates.js";
import { mailtrapClient, sender } from "./mailtrap.config.js";

export const sendVierificationEmail = async (email, token) => {
    const recipient = [{email}];

    try {
        const response = mailtrapClient.send({
            from: sender,
            to: recipient,
            subject: "Verify Your Email Address",
            html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", token),
            category: "Email Verification",
        });

        console.log("Email sent!", response);
    } catch (err) {
        console.error("Error sending email:", err);
        throw new Error(`Error sending email: ${err.message}`);
    }
}

export const sendWelcomeEmail = async (email, username) => {
    const recipients = [{email}];

    try {
        const response = mailtrapClient.send({
            from: sender,
            to: recipients,
            template_uuid: "b87d2d0f-439f-41b7-974a-986c6331477f",
            template_variables: {
                "name": username,
            },
        })

        console.log("Email sent!", response);
    } catch (err) {
        console.error("Error sending email:", err);
        throw new Error(`Error sending email: ${err.message}`);
    }
}