const socket = io("/")
socket.emit('join-room', ROOM_ID, 10)

/* Detect when a new user connects */
socket.on('user-connected', userId => {
  console.log(`Heads up, user ${userId} has connected`)
})
