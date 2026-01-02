import sodium from "libsodium-wrappers-sumo";
import { hkdfSHA256 } from "../E2E-PHASE-V-X3DH/hkdfSHA256.js";

function concatUint8(...arrays) {
  const len = arrays.reduce((s, a) => s + a.length, 0);
  const out = new Uint8Array(len);
  let offset = 0;
  for (const a of arrays) {
    out.set(a, offset);
    offset += a.length;
  }
  return out;
}

// X3DH → initial RK
// ↓
// Double Ratchet DH step → new RK
// ↓
// Next DH step → new RK
// ↓
// ...

export async function kdfRK(RK, DH) {
  await sodium.ready;

  // RK and DH are already Uint8Array
  const ikm = concatUint8(RK, DH);

  const zeroSalt = new Uint8Array(32);

  const out = await hkdfSHA256(
    ikm,
    zeroSalt,
    "DoubleRatchetRK",
    64   // 32 bytes new RK + 32 bytes CK
  );

  return {
    newRK: out.slice(0, 32),
    CK:    out.slice(32, 64)
  };
}
