import React, { createContext, useState } from 'react'

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [error, setError] = useState('')

  return (
    <AuthContext.Provider value={{ user, setUser, error, setError }}>
      {children}
    </AuthContext.Provider>
  )
}
