import sodium from "libsodium-wrappers-sumo";
import { hkdfSHA256 } from "../E2E-PHASE-V-X3DH/hkdfSHA256.js";
import { dhRatchet } from "./dhRatchet.js";
import { persistRatchetState } from "../PersistFullRatchetState-VII/persistRatchetState.js";


async function nextMessageKey(CK) {
  const zeroSalt = new Uint8Array(32);

  const MK = await hkdfSHA256(CK, zeroSalt, "DR message", 32);
  const nextCK = await hkdfSHA256(CK, zeroSalt, "DR chain", 32);

  return { MK, nextCK };
}

export async function aliceSend(state, plaintext, storageKey) {
  await sodium.ready;

  /* -------------------------------------------------- */
  /* 1. DH ratchet IF pending (this is the key part)   */
  /* -------------------------------------------------- */

  if (state.pendingDH) {
    // Alice generates NEW DH and derives new RK + CKs
    await dhRatchet(state);
  }

  /* -------------------------------------------------- */
  /* 2. Symmetric ratchet (message keys)               */
  /* -------------------------------------------------- */

  const { MK, nextCK } = await nextMessageKey(state.CKs);
  state.CKs = nextCK;

  const msgNum = state.Ns;
  state.Ns += 1;

  const nonce = sodium.randombytes_buf(
    sodium.crypto_secretbox_NONCEBYTES
  );

  const ciphertext = sodium.crypto_secretbox_easy(
    sodium.from_string(plaintext),
    nonce,
    MK
  );

  /* -------------------------------------------------- */
  /* 3. Persist BEFORE sending (crash safety)          */
  /* -------------------------------------------------- */

  persistRatchetState(state, storageKey);

  /* -------------------------------------------------- */
  /* 4. Send message                                  */
  /* -------------------------------------------------- */

  return {
    header: {
      // Alice CURRENT DH public key
      dh: sodium.to_base64(state.DHs.publicKey),
      n: msgNum
    },
    body: {
      nonce: sodium.to_base64(nonce),
      ciphertext: sodium.to_base64(ciphertext)
    }
  };
}
