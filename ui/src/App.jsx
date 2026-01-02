import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import { createIdentity } from "./E2E/E2E-PHASE-I/identity.js";
import { loadIdentity } from "./E2E/E2E-PHASE-II/loadIdentity.JS";
import { generateSignedPrekey } from "./E2E/E2E-PHASE-III-30DAYS-REPEAT/generateSignedPrekey.js";
import { loadSignedPrekey } from "./E2E/E2E-PHASE-III-30DAYS-REPEAT/loadSignedPrekey.js";
import { generateOneTimePrekeys } from "./E2E/E2E-PHASE-IV-OneTimePrekeys/generateOneTimePrekeys.js";
import { loadOneTimePrekeys } from "./E2E/E2E-PHASE-IV-OneTimePrekeys/loadOneTimePrekeys.js";
import { x3dhInitiation } from "./E2E/E2E-PHASE-V-X3DH/x3dhInitiation.js";
import { x3dhResponder } from "./E2E/E2E-PHASE-V-X3DH/x3dhResponder.js";
import sodium from "libsodium-wrappers-sumo";
import { aliceSend } from "./E2E/E2E-SendMessage-I/aliceSend.js";
import { initDoubleRatchetAlice } from "./E2E/E2E-PHASE-VI-DoubleRatchet/initDoubleRatchetAlice.js";
import { persistRatchetState } from "./E2E/PersistFullRatchetState-VII/persistRatchetState.js";
import { bobReceive } from "./E2E/E2E-receiveMessage-I/bobReceive.js";
import { initDoubleRatchetBob } from "./E2E/E2E-PHASE-VI-DoubleRatchet/initDoubleRatchetBob.js";
import { bobSend } from "./E2E/E2E-PHASE-VIII/bobSend.js";
import EmailLogin from "./Register/EmailLogin.jsx";
import RegisterDevice from "./Register/RegisterDevice.jsx";
import OtpVerify from "./Register/OtpVerify.jsx";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);
  const [data, setData] = useState(null);
  // after app start

  //   1) Ratchet state  → cryptographic safety
  // 2) Outbox queue   → delivery tracking

  //   async function loadOrInitSession(storageKey) {
  //   const saved = loadRatchetState(storageKey);

  //   if (saved) {
  //     // 🔁 CRASH RECOVERY PATH
  //     console.log("Ratchet state restored");
  //     return saved;
  //   }

  //   // ❗ Only if NO state exists
  //   console.log("No ratchet state, running X3DH");
  //   const { RK, E_A } = await runX3DH();
  //   const state = await initDoubleRatchetAlice(RK, E_A);
  //let state = await initDoubleRatchetAlice(...);
  //   persistRatchetState(state, storageKey);
  //   return state;
  // }
  //
  //send msg
  // async function sendMessage(state, text, storageKey) {
  //   const msg = await aliceSend(state, text);

  //   // 🔐 Persist FIRST
  // persistRatchetState(state, storageKey); //Persistence is a side effect
  //  // 2️⃣ Save message to outbox (delivery safety)
  //saveToOutbox(msg);
  //   // 🌐 Then send
  //   sendToServer(msg);
  // }
  //

  //
  // Alice state already initialized via X3DH + initDoubleRatchetAlice

  // const msg1 = await aliceSend(state, "Hello Bob");
  // persistRatchetState(state, storageKey);
  // sendToServer(msg1);

  // const msg2 = await aliceSend(state, "How are you?");
  // persistRatchetState(state, storageKey);
  // sendToServer(msg2);

  // const msg3 = await aliceSend(state, "Are you there?");
  // persistRatchetState(state, storageKey);
  // sendToServer(msg3);
  //N-PsN5B0H3HSqbdkyWpMlhWXAWHXI3mUjrZDFJ_WOBE
  // useEffect(() => {
  //   async function createUser() {
  //     const d1 = await x3dhResponder(
  //       "o3ary9lVhfSNegl7-2D1nPycth-HO5XOk7mv4Gz9pW6lPjc_z3zmu8Srd2or_Cx6k308ok42BbDs4CfTxRWTrQ",
  //       "hub_zpCuX1JKY0eHA4b2FSOvpqdQzGUZyMGLUhEB1lY",
  //       "Q6vaaOtSf8CtwNN0RLWIWdO8e0bNtiH_PyqC3F2WIQQ",
  //       "ZcgrVa1MFDpRQsVrZwHKpELolsIJZB46YZc5v8Gxunk",
  //       "xH51ILb3hDb0amf6l3pIHgrjpCm5_dPLMgCwwhP7ezs"
  //     );
  //     const state = await initDoubleRatchetBob(d1.RK, d1.header.ephPub);
  //     const msg = await bobReceive(
  //       state,
  //       {
  //         body: {
  //           nonce: "_GLfr2zQiIxjLEqXmPKy5DDus7AO_ko-",
  //           ciphertext: "r0or-Z1kWvmnld04woZpsChjEqU2",
  //         },
  //         header: { dh: "xH51ILb3hDb0amf6l3pIHgrjpCm5_dPLMgCwwhP7ezs", n: 0 },
  //       },
  //       "varad"
  //     );
  //     state.pendingDH = true;
  //     const msg2 = await bobSend(state, "varad", "varad");
  //     return msg2;
  //   }
  //   console.log(createUser());
  // }, []);

  // imp
  //   On app restart:
  // state = loadRatchetState(storageKey);
  // const outbox = loadOutbox();

  // Now you simply do:
  // for (const msg of outbox.unsentMessages()) {
  //   sendToServer(msg);
  // }
  // 6️⃣ How do you know a message WAS delivered?
  // The server sends an acknowledgement:
  // {
  //   "type": "ack",
  //   "mid": "abc123"
  // }
  // When Alice receives this:
  // removeFromOutbox(mid);
  // That’s it.
  return <>
  <OtpVerify/>
  </>;
}

export default App;
