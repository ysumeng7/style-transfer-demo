export default async function preprocessing(blob) {
  const image = await new Promise(resolve => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.src = blob
  })
  const canvas = document.createElement('canvas')

  let w = image.width, h = image.height

  if (w * h > 512 * 512) {
    // resize according to shortest side
    let p = Math.max(w, h)
    let r = 512 / p
    w = (w * r) >> 0
    h = (h * r) >> 0
  }

  canvas.width  = w
  canvas.height = h

  const context = canvas.getContext('2d')
  context.drawImage(image, 0, 0, w, h)

  return canvas.toDataURL('image/png')
}