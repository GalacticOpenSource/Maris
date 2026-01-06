import React, { createContext, useContext, useEffect, useState } from 'react'
import SplashScreen from '../pages/SplashScreen';
const AuthContext =  createContext(null)
export function   AuthProvider({ children }) {
    const [isAuthenticated, setIsAuthenticated]= useState(false)
   const [loading, setLoading] = useState(true);
   // Check session on app load / refresh
   useEffect(()=>{
    async function checkSession() {
        try{
            const res = fetch("/me",{
          credentials: "include"
        })
          if(res.ok){
            setIsAuthenticated(true)
        }
         else {
          setIsAuthenticated(false);
        }
        }finally{
            setLoading(false)
        }
      
    }
    checkSession()
   },[])
 return (
  <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
    {loading ? <SplashScreen /> : children}
  </AuthContext.Provider>
);

}
export function useAuth(){
    return useContext(AuthContext)
}
export default AuthContext