const express = require('express')

const app = express()

app.all('*', processRequest)

async function processRequest(req, res) {

  console.log('req.url', req.url)
  const handlerName = req.url.substring(1)
  console.log('handlerName', handlerName)

  try {
    const handler = findHandler(handlerName)
    // const handler = require(`./handlers/applicationStatus`)
    console.log('Calling handler...')
    const answer = await handler.handle()
    // console.log('answer:', answer)
    res.send({
      answer
    })
  } catch (err) {
    console.error(err)
    res.send({
      message: `Could not find handlers/${handlerName}.js, you sure to call the right endpoint?`,
      error: err
    })
  }
}

// processRequest({ url: '/applicationStatus' })
//   .then(() => 'ok')

function findHandler(handlerName) {
  try {
    return require(`./handlers/${handlerName}`)
  } catch (err) {
    throw err
  }
}

const port = process.env.PORT || 3000
app.listen(port)
console.log(`Server listening on port ${port}...`)
