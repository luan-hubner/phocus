const faceapi = require('face-api.js')

async function isValid (image) {
  const detections = await faceapi.detectAllFaces(image)
}

module.exports = {
  isValid
}