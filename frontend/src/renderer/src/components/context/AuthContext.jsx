import React, { createContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axiosBaseUrl from '../utils/axios'

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  //const [loading, setLoading] = useState(false) //track loading state while fetching user data
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const login = async (credentials) => {
    try {
      const response = await axiosBaseUrl.post('/guest/login', credentials)

      console.log(response)

      if (response.data.error) {
        setError(response.data.user.error)
      } else {
        localStorage.setItem('access_token', response.data.user.access_token)
        setUser(response.data.user)
        // navigate('/imagegallery')
      }
    } catch {
      setError('Invalid credentials')
    }
  }

  const registerCheck = async (userData) => {
    //the below condition is now handled in the backend
    // if (userData.password !== userData.password_confirmation) {
    //   setError('Passwords do not match')
    //   return
    // }

    try {
      const response = await axiosBaseUrl.post('guest/register', userData)
    } catch (err) {
      // if (response) {
      //   console.log('Validation Error:', response.data.user.error)
      // } else {
      setError('Error occurred during registration')
    }
  }

  const logout = () => {
    localStorage.removeItem('access_token')
    setUser(null)
    navigate('/')
  }
  // const [user, setUser] = useState(null)
  // const [loading, setLoading] = useState(true)
  // const navigate = useNavigate()

  // useEffect(() => {
  //   const verifyAuth = async () => {
  //     try {
  //       const userData = await checkAuth()
  //       setUser(userData)
  //     } catch (error) {
  //       setUser(null)
  //     } finally {
  //       setLoading(false)
  //     }
  //   }
  //   verifyAuth()
  // }, [])

  // const login = async (credentials) => {
  //   const userData = await authLogin(credentials)
  //   setUser(userData)
  //   navigate('/')
  // }

  // const register = async (userData) => {
  //   await authRegister(userData)
  //   navigate('/login')
  // }

  // const logout = async () => {
  //   await authLogout()
  //   setUser(null)
  //   navigate('/login')
  // }

  return (
    <AuthContext.Provider value={{ user, /* loading, */ login, error, registerCheck, logout }}>
      {/* !loading && */ children}
    </AuthContext.Provider>
  )
}
