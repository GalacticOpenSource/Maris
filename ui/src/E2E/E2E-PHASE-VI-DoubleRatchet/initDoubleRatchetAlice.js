import sodium from "libsodium-wrappers-sumo";
import { hkdfSHA256 } from "../E2E-PHASE-V-X3DH/hkdfSHA256";

async function deriveCK(RK, info) {
  const zeroSalt = new Uint8Array(32);
  return hkdfSHA256(RK, zeroSalt, info);
}

export async function initDoubleRatchetAlice(RK, E_A) {
  await sodium.ready;

  const CKs = await deriveCK(RK, "DR Alice send");
  const CKr = await deriveCK(RK, "DR Alice recv");

  return {
    /* Root + chains */
    RK,
    CKs,
    CKr,

    /* DH ratchet keys */
    DHs: E_A, // Alice current DH keypair (X25519)
    DHr: null, // Bob DH public key (unknown yet)

    /* Message counters */
    Ns: 0,
    Nr: 0,

    /* Control flags */
    pendingDH: false,

    /* Skipped / replay protection */
    skippedKeys: new Map(),
    usedMessageKeys: new Set(),
  };
}
