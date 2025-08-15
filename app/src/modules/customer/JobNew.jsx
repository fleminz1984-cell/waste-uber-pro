import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { db, storage } from '../../services/firebase.js'
import { useSession } from '../../state/store.js'
import { addDoc, collection } from 'firebase/firestore'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'

export default function JobNew(){
  const { user } = useSession()
  const { register, handleSubmit } = useForm()
  const [files, setFiles] = useState([])
  const [busy, setBusy] = useState(false)

  const onSubmit = async (d)=>{
    setBusy(true)
    const photos = []
    for(const f of files){
      const r = ref(storage, `jobs/${user.uid}/${Date.now()}-${f.name}`)
      await uploadBytes(r, f); photos.push(await getDownloadURL(r))
    }
    await addDoc(collection(db,'jobs'), {
      customerId: user.uid,
      type: d.type,
      details: d.details || '',
      pickup: { label: d.pickup },
      dropoff: { label: d.dropoff },
      budget: Number(d.budget || 0),
      status: 'posted',
      photos, createdAt: Date.now()
    })
    location.href = '/c'
  }

  return (
    <div className="max-w-2xl mx-auto card">
      <h2 className="text-xl font-semibold mb-4">Post a job</h2>
      <form className="grid gap-3" onSubmit={handleSubmit(onSubmit)}>
        <label className="label">Job type</label>
        <select className="input" {...register('type')} required>
          <option>Waste Collection</option>
          <option>House Removal</option>
          <option>Man & Van</option>
          <option>Delivery</option>
        </select>
        <label className="label">Pickup address</label>
        <input className="input" {...register('pickup')} required placeholder="Pickup address"/>
        <label className="label">Drop-off address</label>
        <input className="input" {...register('dropoff')} required placeholder="Drop-off address"/>
        <label className="label">Budget</label>
        <input className="input" type="number" step="1" {...register('budget')} placeholder="e.g., 120"/>
        <label className="label">Details</label>
        <textarea className="input" rows="4" {...register('details')} placeholder="Describe the job…"/>
        <label className="label">Photos (optional)</label>
        <input className="input" type="file" multiple onChange={e=>setFiles(Array.from(e.target.files))}/>
        <button className="btn-primary mt-2" type="submit" disabled={busy}>{busy?'Posting…':'Post job'}</button>
      </form>
    </div>
  )
}
