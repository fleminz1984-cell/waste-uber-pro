import React from 'react'
import { Link } from 'react-router-dom'
import { useSession } from '../../state/store.js'
import { signOut } from 'firebase/auth'
import { auth } from '../../services/firebase.js'

export default function Nav(){
  const { user, clear } = useSession()
  return (
    <header className="sticky top-0 z-40 border-b border-zinc-800 bg-bg/80 backdrop-blur">
      <div className="mx-auto max-w-6xl flex items-center justify-between px-4 py-3">
        <Link to="/" className="font-bold">🗑️ The Waste Game</Link>
        <nav className="flex items-center gap-3">
          <Link className="badge" to="/c">Customer</Link>
          <Link className="badge" to="/p">Provider</Link>
          <Link className="badge" to="/wallet">Wallet</Link>
          {user ? (
            <button className="btn" onClick={()=>{ signOut(auth); clear(); }}>Sign out</button>
          ) : (
            <>
              <Link className="btn" to="/signin">Sign in</Link>
              <Link className="btn-primary" to="/signup">Sign up</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
