export async function fetchKeyBundlename(deviceId) {
  const res = await fetch(`http://localhost:3000/bundle/keys/${deviceId}`, {
    method: "GET",
    credentials: "include", // session cookie if needed,
    headers: {
      Accept: "application/json",
    },
  });

if(!res.ok){
    throw new Error("Failed to fetch key bundle")

}
const data = await res.json()
return data
}