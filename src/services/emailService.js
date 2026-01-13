import nodemailer from 'nodemailer';
export const emailSend = async (to,subject,html)=>{
    const transport=nodemailer.createTransport({
        service:"gmail",
        auth:{
            user:process.env.EMAIL,
            pass:process.env.EMAIL_PASSWORD
        }
    });

    await transport.sendMail({
        from:process.env.EMAIL,
        to,
        subject,
        html
    });
};