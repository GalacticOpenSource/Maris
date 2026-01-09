import sodium from "libsodium-wrappers-sumo";

const STORAGE_KEY = "one_time_prekeys";

export async function loadOneTimePrekeyByPublicKey(
  targetPublicKey,
  storageKey
) {
  await sodium.ready;

  if (!storageKey) {
    throw new Error("Missing storage key");
  }

  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;

  const stored = JSON.parse(raw);

  for (let i = 0; i < stored.length; i++) {
    const entry = stored[i];

    if (entry.publicKey !== targetPublicKey) continue;

    const cipher = sodium.from_base64(entry.cipher);
    const nonce = sodium.from_base64(entry.nonce);

    let privateKey;
    try {
      privateKey = sodium.crypto_secretbox_open_easy(
        cipher,
        nonce,
        storageKey
      );
    } catch {
      throw new Error("Prekey decryption failed");
    }

    // 🔥 ONE-TIME USE: delete immediately
    stored.splice(i, 1);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));

    return Object.freeze({
      publicKey: entry.publicKey,
      privateKey
    });
  }

  return null; // not found
}
