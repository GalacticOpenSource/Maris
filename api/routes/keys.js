import express from "express";
import { auth } from "..";
import pool from "../Db/db";
const router = express.Router();
router.post("/identity", auth, async (req, res) => {
  const { publicKey } = req.body;

  await pool.query(
    `
    INSERT INTO identity_keys (device_id, public_key)
    VALUES ($1, $2)
    ON CONFLICT (device_id) DO NOTHING
    `,
    [req.deviceId, publicKey]
  );

  res.json({ success: true });
});

router.get("/signed-prekey/latest", auth, async (req, res) => {
  const { rows } = await pool.query(
    `
        SELECT public_key, expires_at
        FROM signed_prekeys
        WHERE  device_id = $1
        ORDER BY created_at DESC
        LIMIT 1
        `,
    [req.deviceId]
  );
  if (!rows.length) {
    return res.json(null);
  }
  res.json(rows[0]);
});
router.post("/signed-prekey", auth, async (req, res) => {
  const { publicKey, signature, expiresAt } = req.body;
  if (!publicKey || !signature || !expiresAt) {
    return res.status(400).json({ error: "Invalid signed prekey" });
  }
  await pool.query(
    `
    INSERT INTO signed_prekeys
     (device_id, public_key, signature, expires_at)
     VALUES ($1,$2,$3,$4)
    `,
    [req.deviceId, publicKey, signature, expiresAt]
  );
  res.json({ success: true });
});
export default router;
