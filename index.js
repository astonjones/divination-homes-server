require('dotenv').config()
const express = require('express')
const app = express()
const port = 3000

const contactSecret = process.env.CONTACT_SECRET

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.post('/contact', (req, res) => {
    if(req.body.secret != 'notMuchOfASecret'){

    }
    res.send('post worked?')
    // here we want to collect the data

    // send data to notion

    // send data to email or sms -> sms preferred
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})