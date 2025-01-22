import config from "@/config.env";
import { google } from "googleapis";
import nodemailer from "nodemailer";

const oauth2Client = new google.auth.OAuth2({
  clientId: config.AUTH_GOOGLE_ID,
  clientSecret: config.AUTH_GOOGLE_SECRET,
  redirectUri: "https://developers.google.com/oauthplayground",
});

oauth2Client.setCredentials({
  refresh_token: config.GOOGLE_REFRESH_TOKEN,
});

const token = await oauth2Client.getAccessToken();

let transporter = nodemailer.createTransport({
  // @ts-ignore
  service: "gmail",
  auth: {
    type: "OAuth2",
    user: config.GOOGLE_USER,
    clientId: config.AUTH_GOOGLE_ID,
    clientSecret: config.AUTH_GOOGLE_SECRET,
    refreshToken: config.GOOGLE_REFRESH_TOKEN,
    accessToken: token.token,
  },
});

type Args = {
  to: string;
  subject: string;
  html: string;
};

class EmailService {
  static async sendEmail(args: Args) {
    const { html, subject, to } = args;
    await transporter.sendMail({
      to,
      subject,
      html,
    });
  }
}

export default EmailService;
