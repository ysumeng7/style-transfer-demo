export default async function preprocessing(blob) {
  const image = await new Promise(resolve => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.src = blob
  })
  const canvas = document.createElement('canvas')

  let w = image.width, h = image.height

  if (w * h > 4194303) {
    alert('Image file too large')
    return null
  } else if (w * h > 1048575) {
    // half the image
    w = (w / 2) >> 0
    h = (h / 2) >> 0
  }

  canvas.width  = w
  canvas.height = h

  const context = canvas.getContext('2d')
  context.drawImage(image, 0, 0, w, h)

  return canvas.toDataURL('image/png')
}