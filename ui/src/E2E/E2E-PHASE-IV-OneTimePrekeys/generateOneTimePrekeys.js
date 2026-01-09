import sodium from "libsodium-wrappers-sumo";

const STORAGE_KEY = "one_time_prekeys";

export async function generateOneTimePrekeys(count = 100, storageKey) {
  await sodium.ready;

  if (!storageKey) {
    throw new Error("Missing storage key");
  }

  const encryptedPrekeys = [];

  for (let i = 0; i < count; i++) {
    const kx = sodium.crypto_kx_keypair(); // X25519

    const nonce = sodium.randombytes_buf(
      sodium.crypto_secretbox_NONCEBYTES
    );

    const cipher = sodium.crypto_secretbox_easy(
      kx.privateKey,
      nonce,
      storageKey
    );

    encryptedPrekeys.push({
      publicKey: sodium.to_base64(kx.publicKey),
      cipher: sodium.to_base64(cipher),
      nonce: sodium.to_base64(nonce)
    });
  }

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(encryptedPrekeys)
  );

  // ONLY public keys go to server
  return Object.freeze(
    encryptedPrekeys.map(k => k.publicKey)
  );
}
