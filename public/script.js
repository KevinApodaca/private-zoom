const socket = io('/')
const videoGrid = document.getElementById('video-grid')
/* Setup PeerJS library connections */
const myPeer = new Peer(undefined, {
  host: '/',
  port: '3001'
})

/* Render our own video and mute ourselves, but not for others. */
const myVideo = document.createElement('video')
myVideo.muted = true

navigator.mediaDevices.getUserMedia({
  video: true,
  audio: true
}).then(stream => {
  addVideoStream(myVideo, stream)
})
myPeer.on('open', id => {
  socket.emit('join-room', ROOM_ID, id)
})

/* Detect when a new user connects */
socket.on('user-connected', userId => {
  console.log(`Heads up, user ${userId} has connected`)
})


/* Adding video stream */
function addVideoStream(video, stream) {
  video.srcObject = stream,
  video.addEventListener('loadedmetadata', () => {
    video.play()
  })
  videoGrid.append(video)
}
