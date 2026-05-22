'use client'
import { useEffect, useState } from 'react'
import { getUser, clearAuth } from '@/lib/auth'
import { useRouter } from 'next/navigation'

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    const u = getUser()
    if (!u) { router.push('/auth/login'); return }
    setUser(u)
  }, [router])

  const logout = () => {
    clearAuth()
    router.push('/auth/login')
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl border p-8">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Bonjour, {user.firstName} 👋
            </h1>
            <p className="text-gray-500 text-sm mt-1">{user.email}</p>
          </div>
          <button onClick={logout}
            className="text-sm text-red-500 hover:underline">
            Déconnexion
          </button>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-blue-50 rounded-xl p-4">
            <p className="text-sm text-blue-600 font-medium">Solde disponible</p>
            <p className="text-2xl font-bold text-blue-800 mt-1">
              {user.balance?.toLocaleString()} FCFA
            </p>
          </div>
          <div className="bg-green-50 rounded-xl p-4">
            <p className="text-sm text-green-600 font-medium">Statut KYC</p>
            <p className="text-2xl font-bold text-green-800 mt-1">{user.kycStatus}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
