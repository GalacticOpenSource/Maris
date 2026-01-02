import { useEffect, useState } from "react";
import "./auth.css";

export default function OtpVerify() {
  const [timeLeft, setTimeLeft] = useState(5 * 60); // 5 minutes in seconds
const [otp,setOtp] = useState("")

  async function  registerOtp(otp) {
  const res =  await fetch("http://localhost:3000/otp/user/",{
        method:"POST",
        headers:{ "Content-Type": "application/json"},
        body: JSON.stringify({otp,email:"bmr74242@gmail.com"})
    })
    if(!res.ok){
        const err = await res.json()
   throw new Error(`Device registration failed: ${err}`);
    }
    const data = await res.json()
    console.log(data)
    return data
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
        <p className="auth-text">
          Enter the 6-digit code sent to your email
        </p>

        <div className="auth-form">
          <input
            type="text"
            value={otp}
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={6}
            autoComplete="one-time-code"
            placeholder="••••••"
            onChange={(e)=>{
              setOtp(e.target.value)
            }}
          />
    <button type="button" onClick={()=>{
            registerOtp(otp)
          }} disabled={!otp}>
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
