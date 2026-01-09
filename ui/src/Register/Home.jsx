import React from 'react';
import { useEffect } from 'react';
import { bootstrapKeys } from '../crypto/bootstrapKeys';
import { useAuth } from '../auth/AuthProvider';
const Home = () => {
      const { isAuthenticated, storageKey } = useAuth();
      console.log(isAuthenticated);
      console.log(storageKey);
      useEffect(() => {
    
        console.log("running 1");
        if (!isAuthenticated) return;
        console.log("running 2");
        if (!storageKey) return;
    console.log("running 3");
    console.log(storageKey);
        bootstrapKeys(storageKey);
      }, [isAuthenticated, storageKey]);
    return (
        <div>
            hi
        </div>
    );
}

export default Home;
