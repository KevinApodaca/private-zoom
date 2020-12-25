/* Imports and Initializers */
const chalk = require('chalk')
const express = require('express')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)
const {v4} = require('uuid')

app.set('view engine', 'ejs')
app.use(express.static('public'))

app.get('/',(req,res) => {
  res.redirect(`/${roomId}`)
})

app.get('/:room', (req, res) => {
  res.render('room', { roomId: req.params.room })
})
server.listen(3000)
