const express = require('express')
const { getAvailableHandlers } = require('./utils/utils')

const app = express()

// --------------- Home endpoint ---------------
app.get('/', (req, res) => {
  console.log(`--> '/' called`)
  getAvailableHandlers()
    .then(answer => {
      res.send({
        message: 'Hello',
        availableHandlers: answer,
      })
    })
    .catch(err => {
      console.log(err)
      res.send('Hello')
    })
})

// --------------- /list endpoint ---------------
app.get('/list', (req, res) => {
  console.log(`--> '/list' called`)
  getAvailableHandlers()
    .then(answer => {
      res.send({
        answer
      })
    })
    .catch(err => {
      console.log(err)
      res.send({
        errorMessage: err
      })
    })
})

/**
 * Examples of requests:
 *  - No param:
 *      > /titleFirstResult
 *  - One param within URL:
 *      > /titleFirstResult/tomato
 *  - One or more params with querystring:
 *      > /titleFirstResult?searchTerm=tomato
 */

// --------------- Register all handlers ---------------
getAvailableHandlers()
  .then(dirContent => {
    dirContent.forEach(handlerName => {
      console.log(`Registering: ${handlerName}`)
      app.all([`/${handlerName}`, `/${handlerName}/:param`], (req, res) => {

        const params = Object.assign({}, { urlParam: req.params.param }, req.query)

        processRequest(req, res, params)
          .catch(err => {
            console.log('Something went wrong...', err)
            res.send(`Something went wrong... ${err.toString()}`)
          })
      })
    })

    // All other routes...
    app.use((req, res) => {
      const handlerName = getHandlerNameFromUrl(req.url)
      res.send({
        errorMessage: `Could not find 'handlers/${handlerName}.js'`,
        availableHandlers: dirContent,
      })
    })
  })
  .catch(err => {
    console('Error at reading /handlers directory content...', err)
  })

async function processRequest(req, res, params) {

  const start = Date.now()

  console.log('-----')
  console.log('NEW REQUEST:', req.url)
  const handlerName = getHandlerNameFromUrl(req.url)
  console.log('handlerName', handlerName)
  const handler = importHandler(handlerName)

  try {
    console.log('Calling handler...')
    const answer = await handler.handleRequest(params)
    console.log('answer:', answer)
    const totalTime = Date.now() - start
    res.send({
      answer,
      totalSeconds: Math.round( totalTime / 1000 * 10 ) / 10
    })
  } catch (err) {
    console.error(err)
    res.send(err.toString())
  }
}

function getHandlerNameFromUrl(url) {
  const handlerRegexMatch = /\/([a-zA-Z0-9]*)/.exec(url)
  return handlerRegexMatch && handlerRegexMatch[1]
}

// processRequest({ url: '/applicationStatus' })
//   .then(() => 'ok')

function importHandler(handlerName) {
  try {
    return require(`./handlers/${handlerName}`)
  } catch (err) {
    return null
  }
}

const port = process.env.PORT || 3000
app.listen(port)
console.log(`Server listening on port ${port}...`)
