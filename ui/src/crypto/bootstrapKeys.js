import { createIdentity } from "../E2E/E2E-PHASE-I/identity";
import { uploadIdentityKey } from "../api/keys";
import { loadIdentity } from "../E2E/E2E-PHASE-II/loadIdentity";
import { uploadSignedPreKey } from "../api/keys";
import { generateSignedPrekey } from "../E2E/E2E-PHASE-III-30DAYS-REPEAT/generateSignedPrekey";
export async function bootstrapKeys() {
  // 1️⃣ Identity key (ONCE per device)
  if (!localStorage.getItem("identity_key_encrypted")) {
    const { publicKey } = createIdentity("varad");
    await uploadIdentityKey(publicKey);
  }
  // 2️⃣ Signed prekey (rotate)
  if (signedPrekeyExpiringSoon()) {
    const {privateKey} = loadIdentity("varad")
    const spk = generateSignedPrekey(privateKey,"varad")
    await uploadSignedPreKey(spk)
  }
}
