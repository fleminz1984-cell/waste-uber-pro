import React from 'react'
import { useForm } from 'react-hook-form'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../../services/firebase.js'
import { useNavigate } from 'react-router-dom'

export default function SignIn(){
  const { register, handleSubmit } = useForm()
  const nav = useNavigate()
  const onSubmit = async (d)=>{ await signInWithEmailAndPassword(auth, d.email, d.password); nav('/') }
  return (
    <div className="max-w-md mx-auto card">
      <h2 className="text-xl font-semibold mb-4">Sign in</h2>
      <form className="grid gap-3" onSubmit={handleSubmit(onSubmit)}>
        <label className="label">Email</label>
        <input className="input" {...register('email')} type="email" required/>
        <label className="label">Password</label>
        <input className="input" {...register('password')} type="password" required/>
        <button className="btn-primary mt-2" type="submit">Sign in</button>
      </form>
    </div>
  )
}
