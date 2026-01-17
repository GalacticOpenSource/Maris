export async function uploadIdentityKey(publicKey) {
  const res = await fetch("http://localhost:3000/keys/identity", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include", // send session cookie
    body:JSON.stringify({ publicKey}),
  });

  if (!res.ok) {
    throw new Error("Failed to upload identity key");
  }
  return await res.json();
}
export async function uploadSignedPreKey(spk) {
  const res = await fetch("http://localhost:3000/keys/signed-prekey", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include", // session cookie
    body:  JSON.stringify({
      publicKey: spk.publicKey,
      signature: spk.signature,
      expiresAt: spk.expiresAt,
    }),
  });
  if (!res.ok) {
    throw new Error("Failed to upload signed prekey");
  }
  return await res.json();
}
export async function uploadOneTimePreKeys(publicKeys) {
  const res = await fetch("http://localhost:3000/keys/one-time-prekeys", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    credentials: "include",
    body: JSON.stringify({
      prekeys: publicKeys
    })
  });

  if (!res.ok) {
    throw new Error("Failed to upload one-time prekeys");
  }

  return await res.json();
}

