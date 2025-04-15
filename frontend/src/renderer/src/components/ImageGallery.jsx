import React, { useState, useEffect } from 'react'

const ImageGallery = () => {
  const [images, setImages] = useState([])
  const [selectedImage, setSelectedImage] = useState(null)
  const [appPath, setAppPath] = useState('')
  const [viewingImage, setViewingImage] = useState(null)

  useEffect(() => {
    loadImages()
  }, [])

  useEffect(() => {
    if (window.electronAPI && window.electronAPI.getAppPath) {
      window.electronAPI.getAppPath().then((path) => {
        setAppPath(path)
      })
    }
  }, [])

  const loadImages = async () => {
    if (!window.electronAPI) return
    const images = await window.electronAPI.loadImages()
    setImages(images)
  }

  const handleDelete = async (fileName) => {
    if (!window.electronAPI) return
    await window.electronAPI.deleteImage(fileName)
    loadImages()
  }

  const handleEdit = (image) => {
    setSelectedImage(image)
  }

  const handleSaveEditedImage = async (editedImageData) => {
    if (!window.electronAPI) return

    try {
      // This will depend on how your new library provides the edited image
      await window.electronAPI.saveImage({
        fileName: `edited-${Date.now()}.png`,
        buffer: editedImageData
      })

      loadImages()
      setSelectedImage(null)
    } catch (error) {
      console.error('Save failed:', error)
    }
  }

  return (
    <div className="gallery">
      <h2>Image Gallery</h2>
      <div className="grid">
        {images.map((img, index) => (
          <div key={index} className="thumbnail">
            <img
              src={`app://${img.path}`}
              alt={img.name}
              onError={(e) => {
                console.error('Image load failed:', {
                  src: e.target.src,
                  storedPath: img.path,
                  calculatedPath: appPath ? `${appPath}/${img.path}` : 'Unknown'
                })
              }}
            />
            <div className="controls">
              <button onClick={() => handleEdit(img)} className="btn">
                Edit
              </button>
              <button onClick={() => setViewingImage(img)} className="btn view-btn">
                View
              </button>
              {viewingImage && (
                <div className="view-modal" onClick={() => setViewingImage(null)}>
                  <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                    <button className="close-btn" onClick={() => setViewingImage(null)}>
                      &times;
                    </button>
                    <img
                      src={`app://${viewingImage.path}`}
                      alt={viewingImage.name}
                      className="image-viewed"
                    />
                    <div className="image-info">
                      <p>Name: {viewingImage.name}</p>
                    </div>
                  </div>
                </div>
              )}
              <button onClick={() => handleDelete(img.name)} className="btn delete-btn">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedImage && (
        <div className="edit-modal">
          <div className="edit-tools">
            {/* You'll add your new library's editing controls here */}
            <button onClick={() => setSelectedImage(null)} className="btn">
              Cancel
            </button>
          </div>

          {/* This is where your new image editor component will go */}
          <div id="editor-container">
            {/* Your new library will render here */}
            <p>Image editor will appear here</p>
            <img src={`app://${selectedImage.path}`} alt="Selected for editing" />
          </div>
        </div>
      )}
    </div>
  )
}

export default ImageGallery
