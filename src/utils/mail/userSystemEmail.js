const createTransporter = require("./emailConfig");

/**
 * Sends a confirmation email to a user who submitted a contact form
 * @async
 * @param {string} userEmail - The email address of the user who submitted the form
 * @param {string} userContent - The content of the message submitted by the user
 * @returns {Object} Information about the sent email
 * @throws {Error} If there's an error creating the transporter or sending the email
 */
const sendUserSystemEmail = async (userEmail, userContent) => {
	// Create transporter
	const transporter = await createTransporter();

	// Constants
	const adminEmail = process.env.EMAIL_USER;
	const ainfoLogo = process.env.EMAIL_AINFO_LOGO;

	// Sending email
	const info = await transporter.sendMail({
		from: `"AInfo - Kontakt" <${adminEmail}>`,
		to: userEmail,
		replyTo: `"AInfo - Kontakt" <${adminEmail}>`,
		subject: "Potwierdzenie przesłania pytania",
		html: `
          <html>
            <body style="font-family: Arial, sans-serif; line-height: 1.6;">
                <h2>Potwierdzenie otrzymania pytania</h2>
                <p>Dzień dobry,</p>
                <p>Chcielibyśmy potwierdzić, że otrzymaliśmy Twoje pytanie przesłane przez formularz na stronie <strong><a href="https://ainfo.blog">www.ainfo.blog</a></strong>.</p>

                <p><strong>Adres e-mail nadawcy:</strong> ${userEmail}<br />
                &#8593; Na ten adres zostanie wysłana odpowiedź na Twoje pytanie.</p>
                
                <p><strong>Treść pytania:</strong></p>

                <blockquote style="background-color: #f9f9f9; padding: 10px; border-left: 5px solid #ccc;">
                ${userContent}
                </blockquote>

                <p>Dziękujemy za kontakt! Wkrótce skontaktujemy się z Tobą, aby odpowiedzieć na Twoje pytanie.</p>

                <p>Jeżeli to nie ty zadałeś to pytanie, zignoruj tą wiadomość.</p>

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

module.exports = sendUserSystemEmail;
