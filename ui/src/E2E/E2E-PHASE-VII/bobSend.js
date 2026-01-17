import sodium from "libsodium-wrappers-sumo";
import { kdfRK } from "./kdfRK.js";
import { hkdfSHA256 } from "../E2E-PHASE-V-X3DH/hkdfSHA256.js";
import { persistRatchetState } from "../PersistFullRatchetState-VII/persistRatchetState.js";
import { dhRatchet } from "./dhRatchet.js";
// When do we set pendingDH = true?
// On Bob side
// // when Bob receives Alice message with NEW DH
// await bobReceive(...)
// state.pendingDH = true;

// On Alice side
// // when Alice receives Bob message with NEW DH
// await aliceReceive(...)
// state.pendingDH = true;
// This exactly matches the Signal spec.

//imp
// Bob side
// when Bob receives Alice message with NEW DH
// state.pendingDH = true;

// Alice side
// when Alice receives Bob message with NEW DH
// state.pendingDH = true;
async function nextMessageKey(CK) {
  // CK is already Uint8Array
  const zeroSalt = new Uint8Array(32);
// const CK_S = sodium.from_base64(CK)
  const MK = await hkdfSHA256(CK, zeroSalt, "DR message", 32);

  const nextCK = await hkdfSHA256(CK, zeroSalt, "DR chain", 32);

  return { MK, nextCK };
}

export async function bobSend(state, plaintext, storageKey) {
  console.log(state)
  await sodium.ready;
state.pendingDH = true
  /* 1. DH ratchet ONCE per turn */
  // at fist i have to must do So where does pendingDH = true come from?
// ✅ Correct place to set it
// At the end of successful decryption, if this message was from the peer:
// // after decrypting message
// state.pendingDH = true;
// persistRatchetState(state, storageKey);
  if (state.pendingDH) {
    console.log("ok")
    await dhRatchet(state);
  }

  /* 2. Symmetric ratchet */
  const { MK, nextCK } = await nextMessageKey(state.CKs);
  state.CKs = nextCK;

  const msgNum = state.Ns;
  state.Ns += 1;

  const nonce = sodium.randombytes_buf(sodium.crypto_secretbox_NONCEBYTES);

  const ciphertext = sodium.crypto_secretbox_easy(
    sodium.from_string(plaintext),
    nonce,
    MK
  );

  /* 3. Persist BEFORE send */
  persistRatchetState(state, storageKey);

  /* 4. Send */
  return {
    header: {
      dh: sodium.to_base64(state.DHs), // ✅ REQUIRED
      n: msgNum,
    },
    body: {
      nonce: sodium.to_base64(nonce),
      ciphertext: sodium.to_base64(ciphertext),
    },
  };
}
