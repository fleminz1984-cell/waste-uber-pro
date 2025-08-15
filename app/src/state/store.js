import { create } from 'zustand'

export const useSession = create(set => ({
  user: null, role: null, profile: null,
  setSession: (user, role, profile) => set({ user, role, profile }),
  clear: () => set({ user:null, role:null, profile:null })
}))

export const JOB_STATUS = ['posted','quoted','accepted','paid','enroute','picked','delivered','completed','cancelled']
