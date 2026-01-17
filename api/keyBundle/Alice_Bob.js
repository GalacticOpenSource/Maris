import express from "express";
import pool from "../Db/db.js";
const key = express.Router();

key.get("/keys/:deviceId", async (req, res) => {
  const { deviceId } = req.params;
console.log("deviceId",deviceId)
  const identity = await pool.query(
    `
        SELECT public_key FROM  identity_keys WHERE device_id = $1
        `,
    [deviceId]
  );

  const signedPrekey = await pool.query(
    `
            SELECT  id, public_key, signature
            FROM signed_prekeys
            WHERE device_id  = $1
            AND expires_at > NOW()
            ORDER BY created_at DESC
            LIMIT 1
            `,
    [deviceId]
  );

  const oneTime = await pool.query(
    `
                SELECT  id, public_key
    FROM one_time_prekeys
    WHERE device_id = $1
    AND used = false
    LIMIT 1
                `,
    [deviceId]
  );
  res.json({identityKey:identity.rows[0]?.public_key,
    signedPrekey :signedPrekey.rows[0],
     oneTimePrekey : oneTime.rows[0] || null
  })
});

export default key;
