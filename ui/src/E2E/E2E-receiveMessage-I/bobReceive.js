import sodium from "libsodium-wrappers-sumo";
import { hkdfSHA256 } from "../E2E-PHASE-V-X3DH/hkdfSHA256.js";
import { trySkippedKey } from "./Helpers/trySkippedKey.js";
import { decryptWithMK } from "./Helpers/decryptWithMK.js";
import { dhRatchet } from "./Helpers/dhRatchet.js";
import { storeSkippedKey } from "./Helpers/storeSkippedKey.js";
import { persistRatchetState } from "../PersistFullRatchetState-VII/persistRatchetState.js";

//most imp read
// Same logic when anything changes
// State change	 Persist means
// Advance CK	 Store new CK
// DH ratchet	Store new RK, DHs, CKs/CKr
// Increment Nr/Ns	Store new counters
// Add skipped key	Store it
// Remove skipped key	Remove it
// state shoild be
// {
//   RK,
//   CKs,
//   CKr,
//   DHs,          // Bob current DH keypair (X25519) or null
//   DHr,          // Alice current DH public key (Uint8Array)
//   Ns,
//   Nr,
//   skippedKeys: Map(),     // `${dhPub}:${n}` -> MK
//   usedMessageKeys: Set() // `${dhPub}:${n}`
// }

//imp
// // app startup
// const storageKey = await loadStorageKeyFromPassword(); // Argon2 / pwhash
// let state = loadRatchetState(storageKey);

// if (!state) {
//   // only if NO previous session exists
//   state = await initDoubleRatchetBob(RK, E_A_pub);
//   persistRatchetState(state, storageKey);
// }

// Convert state → JSON-safe object

async function nextMessageKey(CK) {
  const zeroSalt = new Uint8Array(32);
const CK_S = sodium.from_base64(CK)
  const MK = await hkdfSHA256(CK_S, zeroSalt, "DR message");
  const nextCK = await hkdfSHA256(CK_S, zeroSalt, "DR chain");

  return { MK, nextCK };
}
export async function bobReceive(state, message, storageKey) {
  await sodium.ready;

  const { header, body } = message;
  const msgNum = header.n;
  //dhPub is ALWAYS the SENDER’S CURRENT DH PUBLIC KEY (X25519)
  const dhPubBase64 = header.dh;
const senderDh = sodium.from_base64(dhPubBase64);

  const replayKey = `${dhPubBase64}:${msgNum}`;

  /* 1. Replay protection */
  if (state.usedMessageKeys.has(replayKey)) {
    throw new Error("Replay detected");
  }

  /* 2. Try skipped message keys first */
  const skippedMK = trySkippedKey(state, dhPubBase64, msgNum);
  if (skippedMK) {
    const plaintext = decryptWithMK(skippedMK, body);
    state.usedMessageKeys.add(replayKey);
    //ALL persistRatchetState WHENEVER:
    // You delete a message key
    // You store a message key
    // You advance CKs or CKr
    // You change RK
    // You generate a new DH key
    // You update replay cache

    //Ultra-simple checklist (use this while coding)

    // After a function runs, ask:
    // Did I change any of these?
    // RK
    // CKs / CKr
    // DHs / DHr
    // skippedKeys (add OR delete)
    // usedMessageKeys
    // Ns / Nr
    // If YES → call persistRatchetState
    // If NO → don’t
    persistRatchetState(state, storageKey); // ← consume skipped key

    return plaintext;
  }

  //   //First message from Alice
  // state.DHr = null
  // senderDh = A1
  // → !state.DHr === true
  // → NEW DH

  // Second message, same DH
  // state.DHr = A1
  // senderDh = A1
  // memcmp(A1, A1) === true
  // !true === false
  // → NOT new DH

  // Alice ratchets and sends new DH
  // state.DHr = A1
  // senderDh = A2
  // memcmp(A1, A2) === false
  // !false === true
  // → NEW DH
  // Perfect.

  /* 3. DH ratchet if DH key changed */
  // imp Bob → first receive → isNewDh === false
  if (!state.DHr || !sodium.memcmp(sodium.from_base64(state.DHr), senderDh)) {
 // C-I :" Bob receives Alice’s FIRST message// Alice sends her first message using Alice_DH0.
 //  //!state.DHr   // false (Bob already has Alice_DH0)//     memcmp(state.DHr, senderDh) // true (same key)
// So:
// Copy code
// !false || !true  → false
// ✅ isNewDh === false
// This is also correct.
// Bob should NOT DH-ratchet yet.
// He only sets pendingDH = true when he sees a new Alice DH ". 

// at fist i have to must do So where does pendingDH = true come from?
// ✅ Correct place to set it
// At the end of successful decryption, if this message was from the peer:
// // after decrypting message
// state.pendingDH = true;
// persistRatchetState(state, storageKey);

    // New DH from Alice → mark pending ratchet
    state.DHr = senderDh;
    state.pendingDH = true; //  pendingDH: boolean,    // ← REQUIRED

    persistRatchetState(state, storageKey);
  }

  /* 4. Handle skipped messages */
  if (msgNum < state.Nr) {
    throw new Error("Old or duplicate message");
  }

  while (state.Nr < msgNum) {
    const { MK, nextCK } = await nextMessageKey(state.CKr);
    state.CKr = nextCK;

    storeSkippedKey(state, dhPubBase64, state.Nr, MK);
    state.Nr += 1;
  }

  persistRatchetState(state, storageKey); // ← stored skipped keys

  /* 5. Decrypt current message */
  const { MK, nextCK } = await nextMessageKey(state.CKr);
  state.CKr = nextCK;
  state.Nr += 1;

  const plaintext = decryptWithMK(MK, body);
  state.usedMessageKeys.add(replayKey);

  persistRatchetState(state, storageKey); // ← CKr advanced, message consumed

  return plaintext;
}
