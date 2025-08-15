import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Nav from './layout/Nav.jsx'
import Home from './marketing/Home.jsx'
import SignUp from './auth/SignUp.jsx'
import SignIn from './auth/SignIn.jsx'
import AuthGate from './auth/AuthGate.jsx'
import RoleGate from './auth/RoleGate.jsx'
import CustomerDash from './customer/CustomerDash.jsx'
import JobNew from './customer/JobNew.jsx'
import JobView from './shared/JobView.jsx'
import ProviderDash from './provider/ProviderDash.jsx'
import Wallet from './shared/Wallet.jsx'

export default function App(){
  return (
    <div className="min-h-screen">
      <Nav/>
      <main className="mx-auto max-w-6xl px-4 py-6">
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/signup" element={<SignUp/>} />
          <Route path="/signin" element={<SignIn/>} />
          <Route path="/wallet" element={<AuthGate><Wallet/></AuthGate>} />

          <Route path="/c" element={<AuthGate><RoleGate role="customer"><CustomerDash/></RoleGate></AuthGate>} />
          <Route path="/c/job/new" element={<AuthGate><RoleGate role="customer"><JobNew/></RoleGate></AuthGate>} />
          <Route path="/job/:id" element={<AuthGate><JobView/></AuthGate>} />

          <Route path="/p" element={<AuthGate><RoleGate role="provider"><ProviderDash/></RoleGate></AuthGate>} />
          <Route path="*" element={<Navigate to="/" replace/>} />
        </Routes>
      </main>
    </div>
  )
}
