import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { doc, getDoc, collection, addDoc, query, where, onSnapshot, updateDoc } from 'firebase/firestore'
import { db } from '../../services/firebase.js'
import { useSession } from '../../state/store.js'

export default function JobView(){
  const { id } = useParams()
  const { user, role } = useSession()
  const [job, setJob] = useState(null)
  const [quotes, setQuotes] = useState([])
  const [price, setPrice] = useState('')

  useEffect(()=>{
    const ref = doc(db,'jobs',id)
    getDoc(ref).then(s=> setJob({id:s.id, ...s.data()}))
    const q = query(collection(db,'quotes'), where('jobId','==',id))
    const unsub = onSnapshot(q, snap => setQuotes(snap.docs.map(d=>({id:d.id,...d.data()}))))
    return () => unsub()
  },[id])

  const offer = async ()=>{
    await addDoc(collection(db,'quotes'), {
      jobId: id, providerId: user.uid, price: Number(price), createdAt: Date.now(), status: 'offered'
    })
    setPrice('')
  }

  const accept = async (qid)=>{
    const qref = doc(db,'quotes',qid)
    await updateDoc(qref, { status: 'accepted' })
    const jref = doc(db,'jobs',id)
    await updateDoc(jref, { status: 'accepted', providerId: quotes.find(q=>q.id===qid).providerId })
  }

  const setStatus = async (status)=>{ await updateDoc(doc(db,'jobs',id), { status }) }

  const payNow = async ()=>{
    const res = await fetch(import.meta.env.VITE_FUNCTIONS_URL + '/createCheckoutSession', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ jobId: id })
    })
    const { url } = await res.json(); location.href = url
  }

  if(!job) return <div className="card">Loading…</div>

  return (
    <div className="grid md:grid-cols-3 gap-4">
      <div className="card md:col-span-2">
        <div className="text-sm text-muted">{job.type} • {job.status}</div>
        <h2 className="text-xl font-semibold">{job.pickup?.label} → {job.dropoff?.label}</h2>
        <p className="mt-2 whitespace-pre-wrap">{job.details}</p>
        {job.photos?.length>0 && (
          <div className="mt-3 grid grid-cols-3 gap-2">
            {job.photos.map((p,i)=>(<img key={i} className="rounded-xl" src={p} alt="photo"/>))}
          </div>
        )}
      </div>

      <div className="grid gap-4">
        {role==='provider' && job.status==='posted' && (
          <div className="card">
            <h3 className="font-semibold mb-2">Send a quote</h3>
            <div className="flex gap-2">
              <input className="input" value={price} onChange={e=>setPrice(e.target.value)} placeholder="Price"/>
              <button className="btn" onClick={offer}>Offer</button>
            </div>
          </div>
        )}

        {role==='customer' && job.status==='posted' && quotes.length>0 && (
          <div className="card">
            <h3 className="font-semibold mb-2">Quotes</h3>
            <div className="grid gap-2">
              {quotes.map(q=> (
                <div key={q.id} className="flex items-center justify-between border border-zinc-800 rounded-xl px-3 py-2">
                  <div>£{q.price} — {q.status}</div>
                  <button className="btn" onClick={()=>accept(q.id)}>Accept</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {role==='customer' && job.status==='accepted' && (
          <div className="card">
            <h3 className="font-semibold mb-2">Payment</h3>
            <button className="btn-primary" onClick={payNow}>Pay now</button>
          </div>
        )}

        {(role==='customer' || role==='provider') && ['paid','enroute','picked','delivered','completed'].includes(job.status) && (
          <div className="card">
            <h3 className="font-semibold mb-2">Status</h3>
            <div className="flex gap-2 flex-wrap">
              {['enroute','picked','delivered','completed'].map(s=> (
                <button key={s} className="btn" onClick={()=>setStatus(s)}>{s}</button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
