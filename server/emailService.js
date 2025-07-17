// server/emailService.js
const nodemailer = a("nodemailer");

// ATENÇÃO: Use "Variáveis de Ambiente" para isso em produção!
// Para desenvolvimento, pode colocar aqui, mas não envie para o GitHub.
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com", // Servidor SMTP do Gmail
    port: 465,
    secure: true, 
    auth: {
        user: "manoelaps2022@gmail.com",
        pass: "aryl sfjn tojr bzdv",
    },
});

export const sendPasswordResetCode = async (email, code) => {
    const mailOptions = {
        from: '"MedResiduos" <manoelaps2022@gmail.com>',
        to: email,
        subject: "Seu Código de Redefinição de Senha",
        html: `
            <div style="font-family: sans-serif; text-align: center;">
                <h2>Redefinição de Senha</h2>
                <p>Você solicitou uma redefinição de senha para sua conta no MedResiduos.</p>
                <p>Use o código abaixo para criar uma nova senha:</p>
                <div style="font-size: 24px; font-weight: bold; letter-spacing: 5px; margin: 20px; padding: 10px; background-color: #f0f0f0; border-radius: 5px;">
                    ${code}
                </div>
                <p>Se você não solicitou isso, por favor, ignore este email.</p>
            </div>
        `,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log("Email de redefinição enviado para:", email);
        return true;
    } catch (error) {
        console.error("Erro ao enviar email:", error);
        return false;
    }
};