import sodium from "libsodium-wrappers-sumo";
import { hkdfSHA256 } from "../E2E-PHASE-V-X3DH/hkdfSHA256.js";
import { kdfRK } from "./kdfRK.js";
import { trySkippedKey } from "./Helpers/trySkippedKey.js";
import { decryptWithMK } from "./Helpers/decryptWithMK.js";
import { storeSkippedKey } from "./Helpers/storeSkippedKey.js";
import { persistRatchetState } from "../PersistFullRatchetState-VII/persistRatchetState.js";

async function nextMessageKey(CK) {
  const zeroSalt = new Uint8Array(32);

  const MK = await hkdfSHA256(CK, zeroSalt, "DR message", 32);
  const nextCK = await hkdfSHA256(CK, zeroSalt, "DR chain", 32);

  return { MK, nextCK };
}

export async function bobReceive(state, message, storageKey) {
  await sodium.ready;

  const { header, body } = message;
  const msgNum = header.n;

  // Sender (Alice) DH public key
  const dhPubBase64 = header.dh;
  const senderDh = sodium.from_base64(dhPubBase64);

  const replayKey = `${dhPubBase64}:${msgNum}`;

  /* -------------------------------------------------- */
  /* 1. Replay protection                               */
  /* -------------------------------------------------- */

  if (state.usedMessageKeys.has(replayKey)) {
    throw new Error("Replay detected");
  }

  /* -------------------------------------------------- */
  /* 2. Try skipped message keys first                  */
  /* -------------------------------------------------- */

  const skippedMK = trySkippedKey(state, dhPubBase64, msgNum);
  if (skippedMK) {
    const plaintext = decryptWithMK(skippedMK, body);

    state.usedMessageKeys.add(replayKey);
    state.pendingDH = true; // receiving counts as a turn change
    persistRatchetState(state, storageKey);

    return plaintext;
  }

  /* -------------------------------------------------- */
  /* 3. NEW DH detected → derive RECEIVING chain        */
  /* -------------------------------------------------- */

  const isNewDh =
    !state.DHr || !sodium.memcmp(state.DHr, senderDh);

  if (isNewDh) {
    // DH = DH(local private DH, peer public DH)
    const DH = sodium.crypto_scalarmult(
      state.DHs.privateKey, // Bob current private DH
      senderDh              // Alice public DH
    );

    // Advance root key and derive NEW receiving chain
    const { newRK, CK } = await kdfRK(state.RK, DH);

    state.RK = newRK;
    state.CKr = CK;
    state.Nr = 0;

    // Store peer DH and mark pending send-side ratchet
    state.DHr = senderDh;
    state.pendingDH = true;

    persistRatchetState(state, storageKey);
  }

  /* -------------------------------------------------- */
  /* 4. Handle skipped messages in this chain           */
  /* -------------------------------------------------- */

  if (msgNum < state.Nr) {
    throw new Error("Old or duplicate message");
  }

  while (state.Nr < msgNum) {
    const { MK, nextCK } = await nextMessageKey(state.CKr);
    state.CKr = nextCK;

    storeSkippedKey(state, dhPubBase64, state.Nr, MK);
    state.Nr += 1;
  }

  persistRatchetState(state, storageKey);

  /* -------------------------------------------------- */
  /* 5. Decrypt current message                         */
  /* -------------------------------------------------- */

  const { MK, nextCK } = await nextMessageKey(state.CKr);
  state.CKr = nextCK;
  state.Nr += 1;

  const plaintext = decryptWithMK(MK, body);
  state.usedMessageKeys.add(replayKey);
 state.pendingDH = true; // receiving always triggers next-send DH

  persistRatchetState(state, storageKey);

  return plaintext;
}
