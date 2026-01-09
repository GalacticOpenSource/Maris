import { createIdentity } from "../E2E/E2E-PHASE-I/identity";
import { uploadIdentityKey } from "../api/keys";
import { loadIdentity } from "../E2E/E2E-PHASE-II/loadIdentity";
import { uploadSignedPreKey } from "../api/keys";
import { generateSignedPrekey } from "../E2E/E2E-PHASE-III-30DAYS-REPEAT/generateSignedPrekey";
import { signedPrekeyExpiringSoon } from "../helper/signedPrekeyExpiringSoon";
import { oneTimePrekeysLow } from "../helper/oneTimePrekeysLow";
import { generateOneTimePrekeys } from "../E2E/E2E-PHASE-IV-OneTimePrekeys/generateOneTimePrekeys";
import { uploadOneTimePreKeys } from "../api/keys";
export async function bootstrapKeys(storageKey) {
  console.log("running ok ");
  // 1️⃣ Identity key (ONCE per device)
  if (!localStorage.getItem("identity_key_encrypted")) {
    console.log("runnig ok odne");
    const { publicKey } = await createIdentity(storageKey);
    await uploadIdentityKey(publicKey);
  }
  // 2️⃣ Signed prekey (rotate)
  if (await signedPrekeyExpiringSoon()) {
    const { privateKey } = await loadIdentity(storageKey);
    const spk = await generateSignedPrekey(privateKey, storageKey);
    await uploadSignedPreKey(spk);
  }
    // 3️⃣ One-time prekeys (batch)
  if (await oneTimePrekeysLow()) {
    const publicKeys = await generateOneTimePrekeys(101, storageKey);
    await uploadOneTimePreKeys(publicKeys);
  }
}
