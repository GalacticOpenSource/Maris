import sodium from "libsodium-wrappers-sumo";

// runs every ~30 days
export async function generateSignedPrekey(
  identityEd25519PrivateKey,
  storageKey
) {
  await sodium.ready;

  if (!storageKey) {
    throw new Error("Missing storage key");
  }

  /* --------------------------------------------------
     1️⃣ Generate X25519 signed prekey
  -------------------------------------------------- */
  const signedPrekey = sodium.crypto_kx_keypair();

  /* --------------------------------------------------
     2️⃣ Expiration (rotation metadata)
  -------------------------------------------------- */
  const SIGNED_PREKEY_LIFETIME =
    30 * 24 * 60 * 60 * 1000; // 30 days

  const expiresAt = new Date(
    Date.now() + SIGNED_PREKEY_LIFETIME
  ).toISOString();

  /* --------------------------------------------------
     3️⃣ Encrypt private key USING storageKey
  -------------------------------------------------- */
  const nonce = sodium.randombytes_buf(
    sodium.crypto_secretbox_NONCEBYTES
  );

  const cipher = sodium.crypto_secretbox_easy(
    signedPrekey.privateKey,
    nonce,
    storageKey
  );

  /* --------------------------------------------------
     4️⃣ Sign public key using identity (Ed25519)
  -------------------------------------------------- */
  const signature = sodium.crypto_sign_detached(
    signedPrekey.publicKey,
    identityEd25519PrivateKey
  );

  /* --------------------------------------------------
     5️⃣ Store locally (NO salt, NO passphrase)
  -------------------------------------------------- */
  const localData = {
    publicKey: sodium.to_base64(signedPrekey.publicKey),
    cipher: sodium.to_base64(cipher),
    nonce: sodium.to_base64(nonce),
    expiresAt
  };

  localStorage.setItem(
    "signed_prekey",
    JSON.stringify(localData)
  );

  /* --------------------------------------------------
     6️⃣ Upload ONLY public data to server
  -------------------------------------------------- */
  return {
    publicKey: sodium.to_base64(signedPrekey.publicKey),
    signature: sodium.to_base64(signature),
    expiresAt
  };
}
