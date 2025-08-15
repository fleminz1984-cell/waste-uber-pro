import React from 'react'
import { Link } from 'react-router-dom'

export default function Home(){
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="card">
        <h2 className="text-xl font-semibold mb-2">Book a removal or waste collection</h2>
        <p className="text-muted mb-4">Independent carriers near you. Instant quotes. Track like Uber.</p>
        <Link className="btn-primary" to="/signup">Get started</Link>
      </div>
      <div className="card">
        <h2 className="text-xl font-semibold mb-2">Become a provider</h2>
        <p className="text-muted mb-4">Find jobs in your area. Quote, accept, and get paid.</p>
        <Link className="btn" to="/signup">Join now</Link>
      </div>
    </div>
  )
}
