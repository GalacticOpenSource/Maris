import express from "express";
import cookieParser from "cookie-parser";
import { hashToken } from "./Register/verifyOTP.js";
import requestOtp from "./Register/requestOtp.js";
import verifyOTP from "./Register/verifyOTP.js";
import router from "./routes/keys.js";
import pool from "./Db/db.js";
const app = express();
const port = 3000;
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:5173");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Credentials", "true"); // 🔥 REQUIRED

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});

app.use(express.json({ limit: "50kb" }));
app.use(cookieParser());
export async function auth(req, res, next) {
  const token = req.cookies.session;
  console.log(token);
  if (!token) return res.sendStatus(401);

  const { rows } = await pool.query(
    `
SELECT s.user_id, s.device_id, d.revoked
FROM sessions s
JOIN devices d ON d.id = s.device_id
WHERE s.token_hash = $1
AND  s.expires_at > NOW()
    `,
    [token]
  );
  console.log("rows", rows);
  if (!rows.length) return res.sendStatus(401);
  if (rows[0].revoked) return res.sendStatus(401);
  console.log("hi");
  req.userId = rows[0].user_id;
  req.deviceId = rows[0].device_id;
  next();
}
/* ---------- PUBLIC ROUTES (NO AUTH) ---------- */
app.use("/auth", requestOtp); // request OTP
app.use("/otp", verifyOTP); // verify OTP
app.use("/keys", router); // keys

app.get("/", (req, res) => {
  res.send("Hello World!");
});

/* ---------- AUTH MIDDLEWARE ---------- */
app.use(auth);
/* ---------- PROTECTED ROUTES ---------- */
// app.use("/devices", devicesRouter);
// app.use("/messages", messagesRouter);
app.get("/hi", (req, res) => {
  res.send("<h1>Hello</h1>");
});
app.post("/auth/logout", async (req, res) => {
  const tokenHash = hashToken(req.cookies.session);
  await pool.query(
    `
    DELETE FROM sessions WHERE  token_hash = $1`,
    [tokenHash]
  );
  res.clearCookie("session");
  res.json({ success: true });
});
app.post("/devices/:id/revoke", async (req, res) => {
  // POST /devices/d2/revoke
  const { id } = req.params;
  await pool.query(
    `
    UPDATE devices
    SET revoked = true
    WHERE id = $1
    AND user_id = $2
    `,
    [id, req.userId]
  );
  res.json({ success: true });
});
app.get("/devices", async (req, res) => {
  const { rows } = await pool.query(
    `
    SELECT  id, device_name, revoked, created_at
    FROM devices
    WHERE  user_id = $1
  ORDER BY created_at DESC
    `,
    [req.userId]
  );
  res.json({devices:rows})
});
app.get("/me",async (req,res) => {
    res.json({
    userId: req.userId,
    deviceId: req.deviceId
  });
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
