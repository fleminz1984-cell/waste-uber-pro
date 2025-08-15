import React, { useEffect } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { auth, db } from '../../services/firebase.js'
import { useSession } from '../../state/store.js'
import { doc, getDoc } from 'firebase/firestore'

export default function AuthGate({ children }){
  const { setSession } = useSession()
  useEffect(()=>{
    const unsub = onAuthStateChanged(auth, async u => {
      if(!u){ setSession(null,null,null); return }
      const profRef = doc(db,'users',u.uid)
      const profSnap = await getDoc(profRef)
      setSession(u, profSnap.exists() ? profSnap.data().role : null, profSnap.data()||null)
    })
    return ()=>unsub()
  },[])
  return <>{children}</>
}
