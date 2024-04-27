const { sendEmail } = require('../config/mailerConfig');
require("dotenv").config();

exports.sendNewUserEmail = async (req, res) => {
    try {
      const { emailTo } = req.body;
      const mailOptions = {
        from: process.env.EMAIL_HOST,
        to:emailTo,
        subject: 'Bienvenido!',
        html:`
        <h1>Bienvenido/a</h1>
        <p>¡Gracias por unirte a nuestra comunidad!</p>
        <p>Esperamos que disfrutes de tu tiempo con nosotros.</p>
        `
      };
  
      await sendEmail(mailOptions);

      res.status(200).json({ message: "Email enviado correctamente" });
    } catch (error) {
      console.error("Error enviando email:", error);
      res.status(500).json({ error: "Error al enviar el email" });
    }
  };