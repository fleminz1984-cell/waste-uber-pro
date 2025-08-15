import React from 'react'
import { useForm } from 'react-hook-form'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { auth, db } from '../../services/firebase.js'
import { setDoc, doc } from 'firebase/firestore'
import { useNavigate } from 'react-router-dom'

export default function SignUp(){
  const { register, handleSubmit } = useForm()
  const nav = useNavigate()
  const onSubmit = async (d)=>{
    const cred = await createUserWithEmailAndPassword(auth, d.email, d.password)
    await setDoc(doc(db,'users',cred.user.uid), { email:d.email, name:d.name||'', role:d.role, createdAt:Date.now() })
    nav(d.role==='provider'?'/p':'/c')
  }
  return (
    <div className="max-w-lg mx-auto card">
      <h2 className="text-xl font-semibold mb-4">Create account</h2>
      <form className="grid gap-3" onSubmit={handleSubmit(onSubmit)}>
        <label className="label">Name</label>
        <input className="input" {...register('name')} required/>
        <label className="label">Email</label>
        <input className="input" {...register('email')} type="email" required/>
        <label className="label">Password</label>
        <input className="input" {...register('password')} type="password" required/>
        <label className="label">Role</label>
        <select className="input" {...register('role')} required>
          <option value="customer">Customer</option>
          <option value="provider">Provider</option>
        </select>
        <button className="btn-primary mt-2" type="submit">Sign up</button>
      </form>
    </div>
  )
}
