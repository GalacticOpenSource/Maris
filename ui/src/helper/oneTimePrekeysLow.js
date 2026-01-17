export async function oneTimePrekeysLow(){

    const res = await fetch("http://localhost:3000/keys/one-time-prekeys/status",{
          credentials: "include"
    })

    if(!res.ok){
          // fail safe: generate keys if unsure
    return true;
    }
    const {unused} = await res.json()
      const MIN_PREKEYS = 20;

  return unused < MIN_PREKEYS;
}