import express from "express";
import crypto from "crypto";
import pool from "../Db/db.js";
const requestOtp = express.Router();

function genrateOTP() {
  return crypto.randomInt(100000, 999999).toString();
}
function hashOtp(otp) {
  return crypto.createHash("sha256").update(otp).digest("hex");
}



requestOtp.post("/user", async (req, res) => {
  const { email } = req.body;
  const otp = genrateOTP();
  console.log(otp)
  const otpHash = hashOtp(otp);
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000);
  await pool.query(
    `
    INSERT INTO email_otps(email, otp_hash, expires_at)
    VALUES ($1,$2,$3)`,
    [email, otpHash, expiresAt]
  );
    // send email (plaintext OTP)
  // await sendEmail(email, `Your OTP is ${otp}`); //here will be need a email server
  res.json({ success: true });
});

export default requestOtp;
