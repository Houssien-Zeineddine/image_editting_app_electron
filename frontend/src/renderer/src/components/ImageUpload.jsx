import React, { useState, useContext } from 'react'
import { AuthContext } from './context/AuthContext'

const ImageUpload = () => {
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState('')
  const { user } = useContext(AuthContext)

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0]
    if (selectedFile) {
      setFile(selectedFile)
      setPreview(URL.createObjectURL(selectedFile))
    }
  }

  const handleUpload = async () => {
    if (!file || !window.electronAPI) return

    console.log('in handelUpload before calling savImage')

    try {
      const arrayBuffer = await file.arrayBuffer()
      const fileName = `${Date.now()}-${file.name}`

      await window.electronAPI.saveImage({
        fileName,
        buffer: arrayBuffer
      })

      setFile(null)
      setPreview(null)
      alert('Image uploaded successfully!')
    } catch (error) {
      setError(`Upload failed: ${error.message}`)
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="upload-container">
      <h2>Upload Image</h2>
      <input type="file" onChange={handleFileChange} accept="image/*" disabled={isUploading} />
      {preview && (
        <div className="preview">
          <img src={preview} className="image-preview" alt="Preview" />
        </div>
      )}
      <button
        onClick={handleUpload}
        className="btn"
        disabled={!file || isUploading}
        aria-busy={isUploading}
      >
        {isUploading ? 'Uploading...' : 'Upload'}
      </button>
      {error && <div className="error-message">{error}</div>}
    </div>
  )
}

export default ImageUpload
