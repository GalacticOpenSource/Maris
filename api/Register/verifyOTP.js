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
function generateSessionToken() {
  return crypto.randomBytes(32).toString("hex"); // 256-bit
}
export function hashToken(token) {
  return crypto.createHash("sha256").update(token).digest("hex");
}
verifyOTP.post("/user", async (req, res) => {
  const { otp, email } = req.body;
  console.log(otp, email);
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
  //create or fetch user

  let user;
  const userRes = await pool.query(
    `
  SELECT * FROM  users WHERE email = $1`,
    [email]
  );
  if (userRes.rows.length === 0) {
    const created = await pool.query(
      `
      INSERT INTO users (email, email_verified)
      VALUES ($1,true)
      RETURNING id
      `,
      [email]
    );
    user = created.rows[0];
  } else {
    user = userRes.rows[0];
  }
  await pool.query(
    `
    UPDATE users SET email_verified = true WHERE id =$1`,
    [user.id]
  );
  // registerDevice
  // after OTP is verified and user exists
  let deviceId = req.body.deviceId;
  // CASE 1: First time on this device → create device
  // CASE 1: First time on this device → create device
  if (!deviceId) {
    const result = await pool.query(
      `
     INSERT INTO devices (user_id, device_name)
    VALUES ($1, $2)
    RETURNING id
    `,
      [user.id, req.body.deviceName || "Unknown device"]
    );
    deviceId = result.rows[0].id;
  }
  // CASE 2: Existing device → validate it
  else {
    const { rows } = await pool.query(
      `
    SELECT id FROM devices
    WHERE id = $1 
    AND user_id = $2
      AND revoked = false
    `,
      [deviceId, user.id]
    );
    if (!rows.length) {
      return res.status(401).json({ error: "Invalid device" });
    }
  }

  // 👉 issue session

  const token = generateSessionToken();
  const tokenHash = hashToken(token);
  console.log(tokenHash);
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
  await pool.query(
    `
INSERT INTO sessions (user_id, device_id, token_hash, expires_at)
    VALUES ($1, $2, $3, $4)
      `,
    [user.id, deviceId, tokenHash, expiresAt]
  );

  res.cookie("session", tokenHash, {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
  });

  res.json({ success: true ,
     deviceId // client saves this
  });
});
//in production
// res.cookie("session", token, {
//   httpOnly: true,
//   secure: true,
//   sameSite: "none", // 🔥 REQUIRED
// });

// Since you are on HTTP + localhost:

// 👉 DO THIS ⬇️

// Backend cookie
// res.cookie("session", token, {
//   httpOnly: true,
//   secure: false,
//   sameSite: "lax"
// });
export default verifyOTP;
