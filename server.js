/* Imports and Initializers */
const chalk = require('chalk')
const express = require('express')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)
const { v4: uuidV4 } = require('uuid')

app.set('view engine', 'ejs')
app.use(express.static('public'))

app.get('/',(req,res) => {
  res.redirect(`/${uuidV4()}`)
})

app.get('/:room', (req, res) => {
  res.render('room', { roomId: req.params.room })
})

/* Socket Connections */
io.on('connection', socket => {
  socket.on('join-room', (roomId, userId) => {
    socket.join(roomId)
    socket.to(roomId).broadcast.emit('user-connected', userId)
    socket.on('message', message => {
      io.to(roomId).emit('createMessage', message)
    })

    socket.on('disconnect', () => {
      socket.to(roomId).broadcast.emit('user-disconnected', userId)
    })
  })
})
//server.listen(process.env.PORT||3000)
const PORT = process.env.PORT || 3000
server.listen(PORT, () => console.log(`Server is listening on port ${PORT}`))
