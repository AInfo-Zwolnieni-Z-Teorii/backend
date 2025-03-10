const createTransporter = require("./emailConfig");

/**
 * Sends a notification email to the admin when a user submits a contact form
 * @async
 * @param {string} userEmail - The email address of the user who submitted the form
 * @param {string} userContent - The content of the message submitted by the user
 * @returns {Object} Information about the sent email
 * @throws {Error} If there's an error creating the transporter or sending the email
 */
const sendAdminSystemEmail = async (userEmail, userContent) => {
	// Create transporter
	const transporter = await createTransporter();

	// Constants
	const adminEmail = process.env.EMAIL_USER;
	const ainfoLogo = process.env.EMAIL_AINFO_LOGO;

	// Sending email
	const info = await transporter.sendMail({
		from: `"AInfo - Wiadomości Systemowe" <${adminEmail}>`,
		to: adminEmail,
		replyTo: `"AInfo - Kontakt" <${userEmail}>`,
		subject: `Nowe pytanie z formularza kontaktowego - ${new Date().toLocaleString()}`,
		html: `
          <html>
            <body style="font-family: Arial, sans-serif; line-height: 1.6;">
                <h2>Przesłano nowe pytanie z formularza kontaktowego</h2>
                
                <p><strong>Adres e-mail nadawcy:</strong> ${userEmail}</p>
                
                <p><strong>Treść pytania:</strong></p>

                <blockquote style="background-color: #f9f9f9; padding: 10px; border-left: 5px solid #ccc;">
                    ${userContent}
                </blockquote>

                <hr />
                <p>Serdecznie pozdrawiamy,<br />
                <a href="https://ainfo.blog">Zespół AInfo</a></p>
                <a href="https://ainfo.blog"><img src="${ainfoLogo}" alt="AInfo Logo" style="width: 100px; height: 100px;"></a>
            </body>
        </html>

        `,
	});

	// Return info
	return info;
};

module.exports = sendAdminSystemEmail;
