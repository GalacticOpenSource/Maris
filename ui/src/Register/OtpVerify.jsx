import { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthProvider";
import { useNavigate } from "react-router-dom";
import "./auth.css";
export default function OtpVerify() {
  const { setIsAuthenticated } = useAuth();
  const [timeLeft, setTimeLeft] = useState(5 * 60); // 5 minutes in seconds
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();
  const { emaildata } = useAuth();
  const deviceId = localStorage.getItem("device_id");
  function getDeviceName() {
    const ua = navigator.userAgent;

    if (ua.includes("Windows")) return "Chrome on Windows";
    if (ua.includes("Mac")) return "Chrome on macOS";
    if (ua.includes("Linux")) return "Chrome on Linux";
    if (ua.includes("Android")) return "Android Device";
    if (ua.includes("iPhone")) return "iPhone";

    return "Unknown Device";
  }

  const deviceName = getDeviceName();

  async function registerOtp(otp) {
    const res = await fetch("http://localhost:3000/otp/user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        otp,
        email: emaildata,
        deviceName,
        deviceId,
      }),
      credentials: "include",
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(`Device registration failed: ${err}`);
    }
    const data = await res.json();
    localStorage.setItem("device_id", data.deviceId);
    // 🔥 THIS triggers App.jsx useEffect
    setIsAuthenticated(true);
    console.log(data);
    navigate("/CreatePassphrase");
  }
  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((t) => t - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const minutes = String(Math.floor(timeLeft / 60)).padStart(2, "0");
  const seconds = String(timeLeft % 60).padStart(2, "0");

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-title">Verify code</h1>
        <p className="auth-text">Enter the 6-digit code sent to your email</p>

        <div className="auth-form">
          <input
            type="text"
            value={otp}
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={6}
            autoComplete="one-time-code"
            placeholder="••••••"
            onChange={(e) => {
              setOtp(e.target.value);
            }}
          />
          <button
            type="button"
            onClick={() => {
              registerOtp(otp);
            }}
            disabled={!otp}
          >
            Continue
          </button>
        </div>

        <p className="auth-note">
          {timeLeft > 0
            ? `Code expires in ${minutes}:${seconds}`
            : "Code expired. Request a new one."}
        </p>
      </div>
    </div>
  );
}
