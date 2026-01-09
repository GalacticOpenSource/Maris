import sodium from "libsodium-wrappers-sumo";

const STORAGE_META_KEY = "storage_key_meta";

export async function loadOrDeriveStorageKey(passphrase) {
  await sodium.ready;

  if (!passphrase) return null;

  const metaRaw = localStorage.getItem(STORAGE_META_KEY);

  // First-time device
  if (!metaRaw) {
    const salt = sodium.randombytes_buf(16);

    const storageKey = sodium.crypto_pwhash(
      sodium.crypto_secretbox_KEYBYTES,
      sodium.from_string(passphrase),
      salt,
      sodium.crypto_pwhash_OPSLIMIT_INTERACTIVE,
      sodium.crypto_pwhash_MEMLIMIT_INTERACTIVE,
      sodium.crypto_pwhash_ALG_DEFAULT
    );

    localStorage.setItem(
      STORAGE_META_KEY,
      JSON.stringify({ salt: sodium.to_base64(salt) })
    );
console.log(storageKey);
    return storageKey;
  }

  // Returning device
  const { salt } = JSON.parse(metaRaw);

  return sodium.crypto_pwhash(
    sodium.crypto_secretbox_KEYBYTES,
    sodium.from_string(passphrase),
    sodium.from_base64(salt),
    sodium.crypto_pwhash_OPSLIMIT_INTERACTIVE,
    sodium.crypto_pwhash_MEMLIMIT_INTERACTIVE,
    sodium.crypto_pwhash_ALG_DEFAULT
  );
}
