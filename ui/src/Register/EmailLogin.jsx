import { useState } from "react";
import "./auth.css";

export default function EmailLogin() {
  const [email, setEmail] = useState("");
  console.log(email);
  async function  registerDevice(email) {
  const res =  await fetch("http://localhost:3000/auth/user",{
        method:"POST",
        headers:{ "Content-Type": "application/json"},
        body: JSON.stringify({email}),
        credentials: "include"
    })
    if(!res.ok){
        const err = await res.json()
   throw new Error(`Device registration failed: ${err}`);
    }
    const data = await res.json()
    console.log(data)
    return data
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-title">Sign in</h1>
        <p className="auth-text">We’ll send a one-time code to your email</p>

        <div className="auth-form">
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            autoComplete="email"
          />

          <button type="button" onClick={()=>{
            registerDevice(email)
          }} disabled={!email}>
            Continue
          </button>
        </div>

        <p className="auth-note">
          No passwords. Your account is protected by cryptography.
        </p>
      </div>
    </div>
  );
}
