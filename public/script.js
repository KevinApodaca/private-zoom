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

let myVideoStream
navigator.mediaDevices.getUserMedia({
  video: true,
  audio: true
}).then(stream => {
  myVideoStream = stream
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
  let d = $('.main__chat_window')
  d.scrollTop(d.prop('scrollHeight'))
}

/* Function to toggle microphone */
const toggleMute = () => {
  const toggled = myVideoStream.getAudioTracks()[0].enabled
  if (toggled) {
    myVideoStream.getAudioTracks()[0].enabled = false
    toggleUnmuteButton()
  } else {
    toggleMuteButton()
    myVideoStream.getAudioTracks()[0].enabled = true
  }
}

const toggleMuteButton = () => {
  const html = `
  <i class="fas fa-microphone"></i>
  <span>Mute</span>
  `
  document.querySelector('.main__mute_button').innerHTML = html
}
const toggleUnmuteButton = () => {
  const html = `
  <i class="unmute fas fa-microphone-slash"></i>
  <span>Unmute</span>
  `
  document.querySelector('.main__mute_button').innerHTML = html
}

/* Function to toggle camera */
const toggleVideo = () => {
  let toggled = myVideoStream.getVideoTracks()[0].enabled
  if (toggled) {
    myVideoStream.getVideoTracks()[0].enabled = false
    toggleVideoOn()
  } else {
    toggleVideoOff()
    myVideoStream.getVideoTracks()[0].enabled = true
  }
}

const toggleVideoOff = () => {
  const html = `
  <i class="fas fa-video"></i>
  <span>Stop Video</span>
  `
  document.querySelector('.main__video_button').innerHTML = html
}
const toggleVideoOn = () => {
  const html = `
  <i class="hide_video fas fa-video-slash"></i>
  <span>Play Video</span>
  `
  document.querySelector('.main__video_button').innerHTML = html
}
