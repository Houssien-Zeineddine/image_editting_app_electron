import React, { useState, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'

const Register = () => {
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: ''
  })
  // const [error, setError] = useState('')
  // const navigate = useNavigate()
  const { registerCheck, error } = useContext(AuthContext)

  //setting the data entered  by user
  const handleChange = (e) => {
    setUserData({
      ...userData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    registerCheck(userData)
    // if (userData.password !== userData.password_confirmation) {
    //   setError('Passwords do not match')
    //   return
    // }
    // try {
    //   const response = await axiosBaseUrl.post('/guest/register', userData)
    // } catch (err) {
    //   setError('Registration failed')
    // }
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
