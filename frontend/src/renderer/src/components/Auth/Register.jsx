import React, { useState, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import axiosBaseUrl from '../utils/axios'

const Register = () => {
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: ''
  })

  const { error } = useContext(AuthContext)
  const navigate = useNavigate()

  //setting the data entered  by user
  const handleChange = (e) => {
    setUserData({
      ...userData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (userData.password !== userData.password_confirmation) {
      setError('Passwords do not match')
      return
    }

    try {
      const response = await axiosBaseUrl.post('guest/register', userData)
      navigate('/')
      console.log(response.data)
    } catch (err) {
      setError('Error occurred during registration')
    }
  }

  return (
    <div className="auth-form">
      <h2>Register</h2>
      {error && <div className="error">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Name</label>
          <input type="text" name="name" value={userData.name} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input type="text" name="email" value={userData.email} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={userData.password}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Confirm Password</label>
          <input
            type="password"
            name="password_confirmation"
            value={userData.password_confirmation}
            onChange={handleChange}
          />
        </div>
        <button type="submit" className="btn">
          Register
        </button>
      </form>
      <p>
        Already have an account? <Link to="/">Login</Link>
      </p>
    </div>
  )
}

export default Register
