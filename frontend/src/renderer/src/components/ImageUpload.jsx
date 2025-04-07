import React, { useState, useContext } from 'react'
import { AuthContext } from './context/AuthContext'
import { uploadImage } from './services/images'

const ImageUpload = () => {
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState('')
  const { user } = useContext(AuthContext)

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    if (selectedFile) {
      setFile(selectedFile)
      setPreview(URL.createObjectURL(selectedFile))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!file) {
      setError('Please select a file')
      return
    }

    setIsUploading(true)
    setError('')

    try {
      const formData = new FormData()
      formData.append('image', file)
      formData.append('user_id', user.id)

      await uploadImage(formData)
      setFile(null)
      setPreview(null)
      alert('Image uploaded successfully!')
    } catch (err) {
      setError('Failed to upload image')
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="image-upload">
      <h2>Upload Image</h2>
      {error && <div className="error">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Select Image</label>
          <input type="file" accept="image/*" onChange={handleFileChange} required />
        </div>
        {preview && (
          <div className="preview">
            <img src={preview} alt="Preview" style={{ maxWidth: '100%', maxHeight: '300px' }} />
          </div>
        )}
        <button type="submit" disabled={isUploading} className="btn">
          {isUploading ? 'Uploading...' : 'Upload'}
        </button>
      </form>
    </div>
  )
}

export default ImageUpload
