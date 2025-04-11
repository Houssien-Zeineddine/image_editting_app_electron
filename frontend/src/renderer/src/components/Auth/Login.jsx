import React, { useState, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
//import { AuthContext } from '../context/AuthContext'
import axiosBaseUrl from '../utils/axios.js'

const Login = () => {
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  })
  const [error, setError] = useState('')
  //const { login } = useContext(AuthContext)
  const navigate = useNavigate()

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const response = await axiosBaseUrl.post('/guest/login', credentials)

      console.log(response)
      if (response.data.error) {
        setError(response.data.user.error)
      } else {
        localStorage.setItem('access_token', response.data.user.access_token)
        navigate('/imagegallery')
      }
    } catch (err) {
      setError('Invalid credentials')
    }
  }

  return (
    <div className="auth-form">
      <h2>Login</h2>
      {error && <div className="error">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email</label>
          <input type="email" name="email" value={credentials.email} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={credentials.password}
            onChange={handleChange}
          />
        </div>
        <button type="submit" className="btn">
          Login
        </button>
      </form>
      <p>
        Don't have an account? <Link to="/register">Register</Link>
      </p>
    </div>
  )
}

export default Login
