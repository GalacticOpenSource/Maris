import { useEffect } from "react";
import { fetchKeyBundlename } from "../api/Alice_Bob.js";
import { x3dhInitiation } from "../E2E/E2E-PHASE-V-X3DH/x3dhInitiation.js";
import { loadIdentity } from "../E2E/E2E-PHASE-II/loadIdentity.js";
import { initDoubleRatchetAlice } from "../E2E/E2E-PHASE-VI-DoubleRatchet/initDoubleRatchetAlice";
import { useAuth } from "../auth/AuthProvider.jsx";
import { aliceSend } from "../E2E/E2E-PHASE-VII/aliceSend.js";
import { aliceReceive } from "../E2E/E2E-FINAL/aliceReceive.js";
import { loadRatchetState } from "../E2E/PersistFullRatchetState-VII/loadRatchetState.js";
const Home = () => {
  const { storageKey } = useAuth();
  useEffect(() => {
    async function run() {
      const data = await fetchKeyBundlename(
        "c8e4d368-de7a-416a-89db-2d7d1023f2c5"
      );
      console.log(data);
    }
  });
  async function send() {
    const bundle = await fetchKeyBundlename(
      "47c0b7b9-d21a-43e3-afbd-a795252ae259"
    );
    const { identityKey, signedPrekey, oneTimePrekey } = bundle;
    const { privateKey } = await loadIdentity(storageKey);
    const { RK, E_A } = await x3dhInitiation(
      privateKey,
      identityKey,
      signedPrekey.public_key,
      signedPrekey.signature,
      "eXKAGOgqshqb1hJkp45Kjka5qqExc_ev6Qjs6TX4o0I"
      // oneTimePrekey.public_key
    );
    const state = await initDoubleRatchetAlice(RK, E_A);
    const data = await aliceSend(state, "varad", storageKey);
    console.log(data);
  }
  async function receiveMessage() {
    const state = await loadRatchetState(storageKey);
    const data = await aliceReceive(
      state,
      {
  body
: 
{nonce: 'zcwkYEcOZ5dyFFx4dtS_uC8w3C9LmRLP', ciphertext: 'MXuip6MiYMJK8HUY18ApekRoSICpGBo'},
header
: 
{dh: '_KTs9Ml7wgBONTLfkZswaYAQ5-BVr5z9rufY2y3_ywk', n: 3}
      },
      storageKey
    );
    console.log(data);
  }
  async function send2(params) {
    const state = await loadRatchetState(storageKey);
    const data = await aliceSend(state, "varad10", storageKey);
    console.log(data);
  }
  return (
    <div>
      <button onClick={() => send()}>send</button>
      <button onClick={() => receiveMessage()}> receiveMessage</button>
      <button onClick={() => send2()}>send2</button>{" "}
    </div>
  );
};

export default Home;
