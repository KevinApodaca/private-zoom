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
const peers = {}

navigator.mediaDevices.getUserMedia({
  video: true,
  audio: true
}).then(stream => {
  addVideoStream(myVideo, stream)

  myPeer.on('call', call => {
    call.answer(stream)
    const video = document.createElement('video')
    call.on('stream', userVideoStream => {
      addVideoStream(video, userVideoStream)
    })
  })


  socket.on('user-connected', userId => {
    connectToNewUser(userId, stream)
  })
  /* Listen for user message when clicking the Enter key */
  let text = $('input')
  $('html').keydown((e) => {
    if (e.which == 13 && text.val().length !== 0) {
      socket.emit('message', text.val())
      text.val('')
    }
  })
  socket.on('createMessage', message => {
    $('ul').append(`<li class="message"><b>user</b><br>${message}</li>`)
    scrollToBottom()
  })
})

socket.on('user-disconnected', userId => {
  if (peers[userId]) peers[userId].close()
})

myPeer.on('open', id => {
  socket.emit('join-room', ROOM_ID, id)
})

/* Adding video stream */
function addVideoStream(video, stream) {
  video.srcObject = stream,
  video.addEventListener('loadedmetadata', () => {
    video.play()
  })
  videoGrid.append(video)
}

/* Connecting to new users */
function connectToNewUser(userId, stream) {
  const call = myPeer.call(userId, stream)
  const video = document.createElement('video')
  call.on('stream', userVideoStream => {
    addVideoStream(video, userVideoStream)
  })
  call.on('close', () => {
    video.remove()
  })

  peers[userId] = call
}

/* Function to scroll automatically when too many messages */
const scrollToBottom = () => {
  let currDiv = $('.main__chat_window')
  currDiv.scrollTop(d.prop("'scrollHeight"))
}
