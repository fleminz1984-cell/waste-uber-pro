import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore'
import { db } from '../../services/firebase.js'
import { useSession } from '../../state/store.js'

export default function CustomerDash(){
  const { user } = useSession()
  const [jobs, setJobs] = useState([])

  useEffect(()=>{
    if(!user) return
    const q = query(collection(db,'jobs'), where('customerId','==',user.uid), orderBy('createdAt','desc'))
    const unsub = onSnapshot(q, snap => setJobs(snap.docs.map(d=>({id:d.id,...d.data()}))))
    return () => unsub()
  },[user])

  return (
    <div className="grid gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Your jobs</h2>
        <Link className="btn-primary" to="/c/job/new">Post a job</Link>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        {jobs.map(j => (
          <Link key={j.id} to={`/job/${j.id}`} className="card">
            <div className="text-sm text-muted">{j.type} • {j.status}</div>
            <div className="font-semibold">{j.pickup?.label} → {j.dropoff?.label}</div>
            <div className="text-sm">{new Date(j.createdAt).toLocaleString()}</div>
          </Link>
        ))}
        {jobs.length===0 && <div className="card">No jobs yet.</div>}
      </div>
    </div>
  )
}
