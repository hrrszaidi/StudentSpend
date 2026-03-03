import { useRouter } from 'next/router';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { onIdTokenChanged } from 'firebase/auth';
import {auth} from '@/backend/Firebase'
import { getDocument } from '@/backend/Database';

const Context = createContext();

export const StateContext = ({ children }) => {

  // Variables to Carry Across Multiple Pages
  const [user, setUser] = useState(undefined)
  const [userName, setUserName] = useState('') // New state for user name

  const router = useRouter()
  const { asPath } = useRouter()

  // AUTHENTICATION REMEMBER ME USEEFFECT
   useEffect(() => {
     const unsubscribe = onIdTokenChanged(auth, (user) => {
       if(user){
         console.log('Token or user state changed:', user)
         user.getIdToken().then((token) => {
           console.log('New ID token:', token)
         })
         setUser(user)
         getDocument("users", user.uid)
           .then((data) => {
             if (data && data.fullName) {
               setUserName(data.fullName)
             }
           })
           .catch((error) => {
             console.error('Error fetching user data:', error)
           })
       } else {
         setUser(null) //there is no user signed in
         setUserName('') // Clear user name on logout
       }
     });
     return () => unsubscribe();
   }, []);




return(
    <Context.Provider
    value={{
        user,
        setUser,
        userName
    }}
    >
      {children}
    </Context.Provider>
    )
}

export const useStateContext = () => useContext(Context);