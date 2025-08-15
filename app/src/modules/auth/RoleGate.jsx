import React from 'react'
import { useSession } from '../../state/store.js'
import { Navigate } from 'react-router-dom'

export default function RoleGate({ role, children }){
  const { role: myRole } = useSession()
  if(!myRole) return <div className="card">Loading…</div>
  if(myRole !== role) return <Navigate to="/" replace/>
  return children
}
