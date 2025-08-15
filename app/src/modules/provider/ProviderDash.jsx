import React, { useEffect, useState } from 'react'
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore'
import { db } from '../../services/firebase.js'
import { Link } from 'react-router-dom'
import { useSession } from '../../state/store.js'

export default function ProviderDash(){
  const { user } = useSession()
  const [openJobs, setOpenJobs] = useState([])
  const [myJobs, setMyJobs] = useState([])

  useEffect(()=>{
    const q = query(collection(db,'jobs'), where('status','==','posted'), orderBy('createdAt','desc'))
    const unsub1 = onSnapshot(q, snap => setOpenJobs(snap.docs.map(d=>({id:d.id,...d.data()}))))
    const q2 = query(collection(db,'jobs'), where('providerId','==',user?.uid||''), orderBy('createdAt','desc'))
    const unsub2 = onSnapshot(q2, snap => setMyJobs(snap.docs.map(d=>({id:d.id,...d.data()}))))
    return ()=>{ unsub1(); unsub2(); }
  },[user])

  return (
    <div className="grid gap-4">
      <h2 className="text-xl font-semibold">Open jobs</h2>
      <div className="grid md:grid-cols-2 gap-4">
        {openJobs.map(j => (
          <Link key={j.id} to={`/job/${j.id}`} className="card">
            <div className="text-sm text-muted">{j.type} • {j.status}</div>
            <div className="font-semibold">{j.pickup?.label} → {j.dropoff?.label}</div>
          </Link>
        ))}
        {openJobs.length===0 && <div className="card">No open jobs in your area (yet).</div>}
      </div>

      <h2 className="text-xl font-semibold">Your jobs</h2>
      <div className="grid md:grid-cols-2 gap-4">
        {myJobs.map(j => (
          <Link key={j.id} to={`/job/${j.id}`} className="card">
            <div className="text-sm text-muted">{j.type} • {j.status}</div>
            <div className="font-semibold">{j.pickup?.label} → {j.dropoff?.label}</div>
          </Link>
        ))}
        {myJobs.length===0 && <div className="card">No accepted jobs yet.</div>}
      </div>
    </div>
  )
}
