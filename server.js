const express = require('express')
const bodyParser = require('body-parser')
const { getAvailableHandlers } = require('./utils/utils')
const { wrapHandler } = require('./utils/wrapHandler')

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
 *      > GET /titleFirstResult
 *  - One param within URL:
 *      > GET /titleFirstResult/tomato
 *  - One or more params with querystring:
 *      > GET /titleFirstResult?searchTerm=tomato
 *  - POST request with a JSON body
 *      > POST /titleFirstResult with { "searchTerm": "tomato" }
 */

// --------------- Register all handlers ---------------
getAvailableHandlers()
  .then(dirContent => {
    dirContent.forEach(handlerName => {
      console.log(`Registering: ${handlerName}`)
      app.all([`/${handlerName}`, `/${handlerName}/:param`], bodyParser.json(), (req, res) => {
        processRequest(req, res)
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

async function processRequest(req, res) {

  const start = Date.now()

  console.log('-----')
  console.log('NEW REQUEST:', req.url)

  console.log('req.params', req.params)
  console.log('req.query', req.query)
  console.log('req.body', req.body)

  const params = Object.assign({}, { urlParam: req.params && req.params.param }, req.query, req.body)
  console.log('Built args:', params)

  const handlerName = getHandlerNameFromUrl(req.url)
  console.log('handlerName', handlerName)
  const handler = importHandler(handlerName)

  try {
    console.log('Calling handler...')
    const answer = await wrapHandler(handler, params)
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

// Test without having to call an endpoint
// processRequest({
//   url: '/titleFirstResult', query: { searchTerm: 'etoile' }
// }, {
//   send() {
//     console.log('send!')
//   }
// })
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
