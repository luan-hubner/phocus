const express = require('express')
var Busboy = require('busboy');

const { validator } = require('./src/controllers/validatorController')

const app = express()

app.use(express.json())

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Conitent-Type, X-Requested-With, Authorization',
  );

  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, PATCH');
    return res.status(200).send({});
  }

  next();
});

app.post('/validation', (req, res) => {
  console.log(req)
  const busBoy = new Busboy({ headers: req.headers })

  busBoy.on('error', e => {
    console.error('Failed to read file', e)
    
    res.status(500).json({
      statusCode: 500,
      body: `Internal server error`
    })
    
  })

  busBoy.on('finish', e => {
    if (e === undefined) {
      res.status(400).json({
        statusCode: 400,
        body: `Image wasn't provided`
      })
    }
  })

  busBoy.on('file', async (_, file, filename) => {
    const isValid = await validator(file)

    if (!isValid) {
      res.status(400).json({
        statusCode: 400,
        body: `Image is invalid`
      })
    } else {
      res.status(200).json({
        statusCode: 200,
        body: `Image is valid`
      })
    }
  })

  req.pipe(busBoy)
})

const PORT = process.env.PORT || 3333

app.listen(PORT, () => console.log(`Server running at port ${PORT}`))