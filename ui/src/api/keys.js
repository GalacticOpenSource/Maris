export async function uploadIdentityKey(publicKey) {
  const res = await fetch("/keys/identity", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include", // send session cookie
    body: publicKey,
  });

  if (!res.ok) {
    throw new Error("Failed to upload identity key");
  }
  return await res.json();
}
export async function uploadSignedPreKey(spk) {
  const res = await fetch("/keys/signed-prekey", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include", // session cookie
    body: {
      publicKey: spk.publicKey,
      signature: spk.signature,
      expiresAt: spk.expiresAt,
    },
  });
  if(!res.ok){
        throw new Error("Failed to upload signed prekey");
  }
  return await res.json()
}
