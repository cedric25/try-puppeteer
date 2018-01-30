const express = require('express')
const { getAvailableHandlers } = require('./utils/utils')

const app = express()

app.get('/list', (req, res) => {
  getAvailableHandlers()
    .then(answer => {
      res.send({
        answer
      })
    })
    .catch(err => {
      res.send({
        errorMessage: err
      })
    })
})

app.all('*', (req, res) => {
  processRequest(req, res)
    .catch(err => {
      console.log('Something went wrong...', err)
      res.send(`Something went wrong... ${err.toString()}`)
    })
})

async function processRequest(req, res) {

  const start = Date.now()

  console.log('-----')
  console.log('NEW REQUEST:', req.url)
  const handlerName = req.url.substring(1)

  // Checking handler
  console.log('Checking handler:', handlerName)
  const handler = findHandler(handlerName)
  if (!handler) {
    getAvailableHandlers()
      .then(dirContent => {
        res.send({
          errorMessage: `Could not find 'handlers/${handlerName}.js'`,
          availableHandlers: dirContent,
        })
      })
      .catch(err => {
        console.error(`Could not read the content of the 'handlers' directory...`, err)
        res.send({
          errorMessage: `Could not find handlers/${handlerName}.js, you sure you're calling the right endpoint?`
        })
      })
    return
  }
  console.log('Handler valid')

  try {
    console.log('Calling handler...')
    const answer = await handler.handleRequest()
    console.log('answer:', answer)
    const totalTime = Date.now() - start
    res.send({
      answer,
      totalSeconds: Math.round( totalTime / 1000 * 10 ) / 10
    })
  } catch (err) {
    console.error(err)
    res.send(err)
  }
}

// processRequest({ url: '/applicationStatus' })
//   .then(() => 'ok')

function findHandler(handlerName) {
  try {
    return require(`./handlers/${handlerName}`)
  } catch (err) {
    return null
  }
}

const port = process.env.PORT || 3000
app.listen(port)
console.log(`Server listening on port ${port}...`)
