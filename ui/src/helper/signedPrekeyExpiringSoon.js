async function signedPrekeyExpiringSoon() {
  const res = await fetch("keys/signed-prekey/latest", {
    credentials: "include",
  });
  const spk = await res.json();
  // No signed prekey exists → must create one
  if (!spk) return true;
  const expiresAt = new Date(spk.expires_at);
  //expiresAt = Date object for Feb 10, 2026, 12:00 UTC

  const now = new Date();
  //now = Jan 20, 2026, 12:00 UTC
  // Define rotation buffer
  //This means:
  // bufferMs = 5 days in milliseconds
  // Why buffer exists:
  // We rotate before expiry, not after.
  // This prevents:
  // edge cases
  // offline gaps
  // race conditions
  const ROTATION_BUFFER_DAYS = 5;
  const bufferMs = ROTATION_BUFFER_DAYS * 24 * 60 * 60 * 1000;
  //“Will this signed prekey expire within the next 5 days?”
  return expiresAt.getTime() < now.getTime() + bufferMs;
}
//Let’s test with REAL dates
// Example 1 — NOT expiring soon ❌
// now        = Jan 20
// expiresAt = Feb 10
// buffer    = 5 days

// now + buffer = Jan 25

// Check:

// Feb 10 < Jan 25 ❌ false

// Return value:

// false

// ➡️ Do NOT rotate

// Example 2 — Expiring soon ✅
// now        = Feb 7
// expiresAt = Feb 10
// buffer    = 5 days

// now + buffer = Feb 12

// Check:

// Feb 10 < Feb 12 ✅ true

// Return value:

// true

// ➡️ Rotate signed prekey

// Example 3 — Already expired ✅
// now        = Feb 15
// expiresAt = Feb 10

// Feb 10 < Feb 20 ✅ true

// ➡️ Rotate immediately
