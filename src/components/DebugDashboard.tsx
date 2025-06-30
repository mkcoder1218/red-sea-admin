import React from 'react'
import { useAppSelector } from '@/store/hooks'

const DebugDashboard: React.FC = () => {
  const { isAuthenticated, user } = useAppSelector((state) => state.auth)

  return (
    <div className="p-8 space-y-4">
      <h1 className="text-4xl font-bold text-white">DEBUG DASHBOARD</h1>
      <div className="bg-white/10 p-4 rounded-lg">
        <h2 className="text-xl font-semibold text-white mb-2">Authentication Status:</h2>
        <p className="text-green-400">✅ Dashboard component is rendering!</p>
        <p className="text-white">Is Authenticated: {isAuthenticated ? '✅ Yes' : '❌ No'}</p>
        <p className="text-white">User: {user ? '✅ Exists' : '❌ Null'}</p>
        {user && (
          <div className="mt-2 text-white">
            <p>Name: {user.first_name} {user.last_name}</p>
            <p>Email: {user.email}</p>
          </div>
        )}
      </div>
      <div className="bg-blue-500/20 p-4 rounded-lg">
        <p className="text-blue-300">If you can see this, the routing and authentication are working correctly!</p>
      </div>
    </div>
  )
}

export default DebugDashboard
