import React, { createContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
/* import {
  login as authLogin,
  register as authRegister,
  logout as authLogout,
  checkAuth
} from '../services/auth' */

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const userData = await checkAuth()
        setUser(userData)
      } catch (error) {
        setUser(null)
      } finally {
        setLoading(false)
      }
    }
    verifyAuth()
  }, [])

  const login = async (credentials) => {
    const userData = await authLogin(credentials)
    setUser(userData)
    navigate('/')
  }

  const register = async (userData) => {
    await authRegister(userData)
    navigate('/login')
  }

  const logout = async () => {
    await authLogout()
    setUser(null)
    navigate('/login')
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  )
}
