import express from "express";

import requestOtp from "./Register/requestOtp.js";
import verifyOTP from "./Register/verifyOTP.js";
const app = express();
const port = 3000;
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:5173");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});

app.use(express.json({ limit: "50kb" }));
app.use("/auth", requestOtp);
app.use("/otp", verifyOTP);
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
