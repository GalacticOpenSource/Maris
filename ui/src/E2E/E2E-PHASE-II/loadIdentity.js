import sodium from "libsodium-wrappers-sumo";

const STORAGE_KEY = "identity_key_encrypted";

export async function loadIdentity(storageKey) {
  await sodium.ready;

  if (!storageKey) {
    throw new Error("Missing storage key");
  }

  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;

  const stored = JSON.parse(raw);

  const nonce = sodium.from_base64(stored.nonce);
  const cipher = sodium.from_base64(stored.cipher);
  const publicKey = sodium.from_base64(stored.publicKey);

  // Sanity check (detect corruption)
  if (publicKey.length !== sodium.crypto_sign_PUBLICKEYBYTES) {
    throw new Error("Corrupted identity public key");
  }

  let privateKey;
  try {
    privateKey = sodium.crypto_secretbox_open_easy(
      cipher,
      nonce,
      storageKey
    );
  } catch {
    throw new Error("Invalid passphrase or corrupted identity");
  }

  if (!privateKey) {
    throw new Error("Invalid passphrase or corrupted identity");
  }

  return Object.freeze({
    publicKey,
    privateKey
  });
}
