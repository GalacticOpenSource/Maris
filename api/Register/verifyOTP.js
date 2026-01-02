import express from "express";
import crypto from "crypto";
import pool from "../Db/db.js";
const verifyOTP = express.Router();
function genrateOTP() {
  return crypto.randomInt(100000, 999999).toString();
}
function hashOtp(otp) {
  return crypto.createHash("sha256").update(otp).digest("hex");
}
verifyOTP.post("/user", async (req, res) => {
  const { otp, email } = req.body;
  console.log(otp,email)
  if (!email || !otp) {
    return res.status(400).json({ error: "Email and OTP required" });
  }

  const otpHash = hashOtp(otp);
  const { rows } = await pool.query(
    `SELECT * FROM email_otps
WHERE email = $1
AND used = false
AND  expires_at > NOW()
ORDER BY created_at DESC
LIMIT 1
`,
    [email]
  );
  if (!rows.length) {
    return res.status(400).json({ error: "OTP expired or invalid" });
  }
  const record = rows[0];
  if (record.attempts >= 5) {
    return res.status(429).json({ error: "Too many attempts" });
  }
  if (record.otp_hash !== otpHash) {
    await pool.query(
      `UPDATE email_otps SET attempts = attempt + 1 WHERE id = $1`,
      [record.id]
    );
    return res.status(400).json({ error: "Invalid OTP" });
  }
  if (record.otp_hash === otpHash) {
    await pool.query(`UPDATE email_otps SET used = true WHERE id = $1 `, [
      record.id,
    ]);
  }
    // 👉 issue session
  res.json({success:true})
});
export default verifyOTP