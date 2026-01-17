import sodium from "libsodium-wrappers-sumo";
import { kdfRK } from "./kdfRK.js";

export async function dhRatchet(state) {
  await sodium.ready;

  /* ---------------------------------- */
  /* 1. Generate NEW DH keypair         */
  /* ---------------------------------- */

  const DHs_new = sodium.crypto_kx_keypair();

  /* ---------------------------------- */
  /* 2. Perform DH with peer            */
  /* ---------------------------------- */

  const DH = sodium.crypto_scalarmult(
    DHs_new.privateKey,
    state.DHr            // ← already Uint8Array
  );

  /* ---------------------------------- */
  /* 3. Derive new RK + CKs             */
  /* ---------------------------------- */

  const { newRK, CK } = await kdfRK(state.RK, DH);

  state.RK = newRK;
  state.CKs = CK;

  /* ---------------------------------- */
  /* 4. Update ratchet state            */
  /* ---------------------------------- */

  state.DHs = DHs_new;   // full keypair
  state.Ns = 0;
  state.pendingDH = false;
}
