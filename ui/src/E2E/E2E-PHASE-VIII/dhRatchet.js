import sodium from "libsodium-wrappers-sumo";
import { kdfRK } from "./kdfRK.js";

export async function dhRatchet(state) {
  await sodium.ready;
  // console.log(state)
  const DHs_new = sodium.crypto_kx_keypair();
  const publicKey = sodium.from_base64(state.DHr);
  const DH = sodium.crypto_scalarmult(
    DHs_new.privateKey,
    publicKey // peer DH public key
  );
console.log(" DHs_new",sodium.to_base64(DHs_new.privateKey))
  const { newRK, CK } = await kdfRK(state.RK, DH);
  // console.log(newRK)
  state.RK =  newRK;
  state.CKs = CK;
  state.DHs = DHs_new.publicKey; // ✅ full keypair
  state.Ns = 0;
  state.pendingDH = false;
 
  return state;
}
