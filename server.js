const fs = require('fs')
const express = require('express')

const app = express()

app.all('*', processRequest)

async function processRequest(req, res) {

  console.log('-----')
  console.log('NEW REQUEST:', req.url)
  const handlerName = req.url.substring(1)

  // Checking handler
  console.log('Checking handler:', handlerName)
  const handler = findHandler(handlerName)
  if (!handler) {
    // Todo: Send list of available handlers
    fs.readdir('./handlers', (err, dirContent) => {
      if (err) {
        console.error(`Could not read the content of the 'handlers' directory...`)
        res.send({
          errorMessage: `Could not find handlers/${handlerName}.js, you sure you're calling the right endpoint?`
        })
        return
      }
      console.log(dirContent)
      res.send({
        errorMessage: `Could not find 'handlers/${handlerName}.js', available handlers: ${dirContent.join(', ')}`
      })
    })
    return
  }
  console.log('Handler valid')

  try {
    console.log('Calling handler...')
    const answer = await handler.handleRequest()
    console.log('answer:', answer)
    res.send({
      answer
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
