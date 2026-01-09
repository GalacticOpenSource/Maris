import sodium from "libsodium-wrappers-sumo";

const STORAGE_KEY = "identity_key_encrypted";

export async function createIdentity(storageKey) {
  await sodium.ready;

  if (!storageKey) {
    throw new Error("Missing storage key");
  }

  // Prevent accidental identity reset
  if (localStorage.getItem(STORAGE_KEY)) {
    throw new Error("Identity already exists");
  }

  /* --------------------------------------------------
     1️⃣ Generate Ed25519 identity keypair
  -------------------------------------------------- */
  const id = sodium.crypto_sign_keypair();

  /* --------------------------------------------------
     2️⃣ Encrypt private key USING storageKey
  -------------------------------------------------- */
  const nonce = sodium.randombytes_buf(
    sodium.crypto_secretbox_NONCEBYTES
  );

  const cipher = sodium.crypto_secretbox_easy(
    id.privateKey,
    nonce,
    storageKey
  );

  /* --------------------------------------------------
     3️⃣ Store ONLY encrypted data
  -------------------------------------------------- */
  const data = {
    publicKey: sodium.to_base64(id.publicKey),
    cipher: sodium.to_base64(cipher),
    nonce: sodium.to_base64(nonce),
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));

  return data;
}
