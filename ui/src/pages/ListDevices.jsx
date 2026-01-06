import { useEffect, useState } from "react";
import "./auth.css";

export default function ListDevices() {
  const [devices, setDevices] = useState([]);
  const [confirmDevice, setConfirmDevice] = useState(null);
  const [loadingId, setLoadingId] = useState(null);

  // Fetch devices on load
  useEffect(() => {
    async function fetchDevices() {
      const res = await fetch("http://localhost:3000/devices", {
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("Failed to fetch devices");
      }

      const data = await res.json();
      setDevices(data.devices);
    }

    fetchDevices();
  }, []);

  // Call revoke API
  async function revokeDevice(deviceId) {
    setLoadingId(deviceId);

    const res = await fetch(
      `http://localhost:3000/devices/${deviceId}/revoke`,
      {
        method: "POST",
        credentials: "include",
      }
    );

    if (!res.ok) {
      setLoadingId(null);
      throw new Error("Failed to revoke device");
    }

    // Update UI
    setDevices((prev) =>
      prev.map((d) =>
        d.id === deviceId ? { ...d, revoked: true } : d
      )
    );

    setLoadingId(null);
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-title">Your devices</h1>
        <p className="auth-text">
          Devices currently signed in to your account
        </p>

        <div className="device-list">
          {devices.map((device) => (
            <div key={device.id} className="device-row">
              <div className="device-info">
                <div className="device-name">
                  {device.device_name}
                </div>

                <div
                  className={`device-status ${
                    device.revoked ? "revoked" : "active"
                  }`}
                >
                  {device.revoked
                    ? "Revoked"
                    : `Active from ${device.created_at}`}
                </div>
              </div>

              {!device.revoked && (
                <button
                  className="device-revoke-btn"
                  disabled={loadingId === device.id}
                  onClick={() => setConfirmDevice(device)}
                >
                  {loadingId === device.id ? "Revoking…" : "Revoke"}
                </button>
              )}
            </div>
          ))}
        </div>

        <p className="auth-note">
          Revoking a device permanently blocks it from signing in again
        </p>
      </div>

      {/* ===== CONFIRMATION MODAL ===== */}
      {confirmDevice && (
        <div className="modal-overlay">
          <div className="modal-card">
            <h2 className="modal-title">Revoke device?</h2>

            <p className="modal-text">
              <strong>{confirmDevice.device_name}</strong> will be
              permanently blocked.
            </p>

            <p className="modal-warning">
              This device will never be able to sign in again.
              This action cannot be undone.
            </p>

            <div className="modal-actions">
              <button
                className="modal-cancel"
                onClick={() => setConfirmDevice(null)}
              >
                Cancel
              </button>

              <button
                className="modal-danger"
                onClick={async () => {
                  await revokeDevice(confirmDevice.id);
                  setConfirmDevice(null);
                }}
              >
                Revoke device
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
