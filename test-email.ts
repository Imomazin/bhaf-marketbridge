import { sendEmail } from "./lib/email";
import { config } from "dotenv";
config();
sendEmail({
  to: "test@example.com",
  subject: "Test email",
  body: "This is a test email."
}).then(console.log).catch(console.error);
