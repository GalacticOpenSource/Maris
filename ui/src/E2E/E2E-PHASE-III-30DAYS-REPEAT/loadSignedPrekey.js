import sodium from "libsodium-wrappers-sumo";

export async function loadSignedPrekey(storageKey) {
  await sodium.ready;

  if (!storageKey) {
    throw new Error("Missing storage key");
  }

  const raw = localStorage.getItem("signed_prekey");
  if (!raw) return null;

  const stored = JSON.parse(raw);

  /* --------------------------------------------------
     🔒 Expiration check (rotation enforcement)
  -------------------------------------------------- */
  if (Date.now() > Date.parse(stored.expiresAt)) {
    return null; // force regeneration
  }

  const nonce = sodium.from_base64(stored.nonce);
  const cipher = sodium.from_base64(stored.cipher);
  const publicKey = sodium.from_base64(stored.publicKey);

  /* --------------------------------------------------
     🔓 Decrypt private key using storageKey
  -------------------------------------------------- */
  let privateKey;
  try {
    privateKey = sodium.crypto_secretbox_open_easy(
      cipher,
      nonce,
      storageKey
    );
  } catch {
    throw new Error("Invalid passphrase or corrupted signed prekey");
  }

  if (!privateKey) {
    throw new Error("Invalid passphrase or corrupted signed prekey");
  }

  return {
    publicKey,
    privateKey
  };
}
