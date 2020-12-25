const socket = io('/')
/* Setup PeerJS library connections */
const myPeer = new Peer(undefined, {
  host: '/',
  port: '3001'
})
myPeer.on('open', id => {
  socket.emit('join-room', ROOM_ID, id)
})

/* Detect when a new user connects */
socket.on('user-connected', userId => {
  console.log(`Heads up, user ${userId} has connected`)
})
