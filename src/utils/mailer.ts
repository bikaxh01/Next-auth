import nodemailer from "nodemailer";
import bcrypt from "bcryptjs";
import user from "@/models/user.model";

interface emailType {
  emailReceiver: String;
  mailType: "VERIFY" | "FORGOT";
  userId: String;
}

// Mail Method
export const sendEmail = async ({
  emailReceiver,
  mailType,
  userId,
}: emailType) => {
 

  try {
    // TODO config mail uses

    const Token = await bcrypt.hash(userId.toString(), 10);

    if (mailType === "VERIFY") {
      await user.findOneAndUpdate(userId, {
        verifyToken: Token,
        verifyTokenExpiry: Date.now() + 360000,
      });
    } else if (mailType === "FORGOT") {
      await user.findOneAndUpdate(userId, {
        forgotPasswordToken: Token,
        verifyTokenExpiry: Date.now() + 3600000,
      });
    }

    const transport = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: "a6ffc36f66242e",
        pass: "23ee5957ebe861",
      },
    });
    const emailModel:any = {
      from: "bikash@example.com", // sender address
      to: emailReceiver, // list of receivers
      subject: mailType === "VERIFY" ? "User Verification" : "Forgot Password", // Subject line

      html: `<p>Click <a href="${
        process.env.DOMAIN
      }/verifyemail?token=${Token}">here</a> to ${
        mailType === "VERIFY" ? "verify your email" : "reset your password"
      }
      or copy and paste the link below in your browser. <br> ${
        process.env.DOMAIN
      }/verifyemail?token=${Token}
      </p>`, // html body
    };

    const res = await transport.sendMail(emailModel);

    return res;
  } catch (error: any) {
    console.log("Error While Sending Mail");

    console.log("Error: ", error);
  }
};
