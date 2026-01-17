import sodium from "libsodium-wrappers-sumo";
export function serializeRatchetState(state) {
  return JSON.stringify({
    RK: sodium.to_base64(state.RK),
    CKs: sodium.to_base64(state.CKs),
    CKr: sodium.to_base64(state.CKr),

    DHs: {
      publicKey: sodium.to_base64(state.DHs.publicKey),
      privateKey: sodium.to_base64(state.DHs.privateKey)
    },

    DHr: state.DHr ? sodium.to_base64(state.DHr) : null,

    Ns: state.Ns,
    Nr: state.Nr,

    skippedKeys: Array.from(state.skippedKeys.entries()).map(
      ([k, v]) => [k, sodium.to_base64(v)]
    ),

    usedMessageKeys: Array.from(state.usedMessageKeys)
  });
}
