
import "./auth.css";
export default function RegisterDevice() {
  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-title">Secure this device</h1>
        <p className="auth-text">
          This device is not yet registered.
          Cryptographic keys will be generated locally.
        </p>

        <form className="auth-form">
          <input
            type="text"
            placeholder="Device name (e.g. My Laptop)"
            required
          />

          <button type="submit">Register device</button>
        </form>

        <p className="auth-note">
          Private keys never leave this device
        </p>
      </div>
    </div>
  );
}
