import React, { useState, useRef, useEffect } from 'react'
import ReactCrop from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'
import { fabric } from 'fabric/dist/fabric.min.js'

const ImageEditor = ({ image, onSave, onClose }) => {
  const [mode, setMode] = useState('crop')
  const [crop, setCrop] = useState()
  const [completedCrop, setCompletedCrop] = useState(null)
  const imgRef = useRef(null)
  const canvasRef = useRef(null)
  const fabricCanvas = useRef(null)

  useEffect(() => {
    if (mode === 'advanced' && canvasRef.current && !fabricCanvas.current) {
      fabricCanvas.current = new fabric.Canvas(canvasRef.current, {
        backgroundColor: '#f0f0f0'
      })

      fabric.Image.fromURL(
        image,
        (img) => {
          img.scaleToWidth(800)
          img.scaleToHeight(600)
          fabricCanvas.current.add(img)
          fabricCanvas.current.renderAll()
        },
        {
          crossOrigin: 'anonymous'
        }
      )
    }

    return () => {
      if (fabricCanvas.current) {
        fabricCanvas.current.dispose()
        fabricCanvas.current = null
      }
    }
  }, [mode, image])

  const handleCropComplete = (crop) => {
    setCompletedCrop(crop)
  }

  const handleSave = async () => {
    if (mode === 'crop' && completedCrop && imgRef.current) {
      const croppedImageBlob = await getCroppedImg(imgRef.current, completedCrop)
      onSave(croppedImageBlob)
    } else if (mode === 'advanced' && fabricCanvas.current) {
      const dataURL = fabricCanvas.current.toDataURL({
        format: 'png',
        quality: 1
      })
      const blob = await (await fetch(dataURL)).blob()
      onSave(blob)
    }
  }

  const addText = () => {
    if (!fabricCanvas.current) return
    const text = new fabric.Textbox('Edit me', {
      left: 100,
      top: 100,
      width: 150,
      fontSize: 20,
      fill: '#000000'
    })
    fabricCanvas.current.add(text)
    fabricCanvas.current.setActiveObject(text)
    fabricCanvas.current.renderAll()
  }

  const addRectangle = () => {
    if (!fabricCanvas.current) return
    const rect = new fabric.Rect({
      left: 100,
      top: 100,
      fill: 'red',
      width: 100,
      height: 100
    })
    fabricCanvas.current.add(rect)
    fabricCanvas.current.renderAll()
  }

  return (
    <div className="editor-modal">
      <div className="editor-toolbar">
        <button onClick={() => setMode('crop')} className="btn">
          Crop Mode
        </button>
        <button onClick={() => setMode('advanced')} className="btn">
          Advanced Mode
        </button>
        {mode === 'advanced' && (
          <>
            <button onClick={addText} className="btn">
              Add Text
            </button>
            <button onClick={addRectangle} className="btn">
              Add Rectangle
            </button>
          </>
        )}
        <button onClick={handleSave} className="btn">
          Save
        </button>
        <button onClick={onClose} className="btn">
          Close
        </button>
      </div>

      <div className="editor-content">
        {mode === 'crop' ? (
          <ReactCrop crop={crop} onChange={setCrop} onComplete={handleCropComplete}>
            <img ref={imgRef} src={image} alt="Crop me" style={{ maxWidth: '100%' }} />
          </ReactCrop>
        ) : (
          <canvas ref={canvasRef} width={800} height={600} style={{ border: '1px solid #ccc' }} />
        )}
      </div>
    </div>
  )
}

async function getCroppedImg(image, crop) {
  const canvas = document.createElement('canvas')
  const scaleX = image.naturalWidth / image.width
  const scaleY = image.naturalHeight / image.height
  canvas.width = crop.width
  canvas.height = crop.height
  const ctx = canvas.getContext('2d')

  ctx.drawImage(
    image,
    crop.x * scaleX,
    crop.y * scaleY,
    crop.width * scaleX,
    crop.height * scaleY,
    0,
    0,
    crop.width,
    crop.height
  )

  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      resolve(blob)
    }, 'image/png')
  })
}

export default ImageEditor
