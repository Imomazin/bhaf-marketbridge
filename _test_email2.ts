import dotenv from "dotenv";
dotenv.config();
import { sendEmail } from "./lib/email";

async function main() {
  console.log("Token:", process.env.MAILTRAP_API_TOKEN?.slice(0, 5) + "...");
  console.log("Testing mailtrap...");
  const result = await sendEmail({
    to: "fullstack@ambidexters.com",
    subject: "Test Email from BHAF",
    body: "This is a test to verify Mailtrap is working.",
  });
  console.log("Result:", result);
}
main();
