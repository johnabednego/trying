import React, { Component } from 'react'
import io from 'socket.io-client'
import { NavBar } from '../components/NavBar';
import profile from '../components/assets/profile-lg.jpg'
import { IconButton, Badge, Input, Button } from '@material-ui/core'
import VideocamIcon from '@material-ui/icons/Videocam'
import VideocamOffIcon from '@material-ui/icons/VideocamOff'
import MicIcon from '@material-ui/icons/Mic'
import MicOffIcon from '@material-ui/icons/MicOff'
import ScreenShareIcon from '@material-ui/icons/ScreenShare'
import StopScreenShareIcon from '@material-ui/icons/StopScreenShare'
import CallEndIcon from '@material-ui/icons/CallEnd'
import ChatIcon from '@material-ui/icons/Chat'
import EmojiEmotionsOutlined from '@material-ui/icons/EmojiEmotionsOutlined'
import Send from '@material-ui/icons/Send'
import Clear from '@material-ui/icons/Clear'
import { VideoText } from "../components/VideoText"
import EmojiPicker from 'emoji-picker-react';

import { message } from 'antd'
// import 'antd/dist/antd.css'

import Modal from 'react-bootstrap/Modal'
import 'bootstrap/dist/css/bootstrap.css'
import "./Video.css"

 const server_url =  "https://health-direct-global.onrender.com/"
// const server_url = "server-production-aea1.up.railway.app"

var connections = {}
const peerConnectionConfig = {
	'iceServers': [
		// { 'urls': 'stun:stun.services.mozilla.com' },
		{ 'urls': 'stun:stun.l.google.com:19302' },
	]
}
var socket = null
var socketId = null
var elms = 0

class Video extends Component {
	constructor(props) {
		super(props)

		this.localVideoref = React.createRef()

		this.videoAvailable = false
		this.audioAvailable = false

		this.state = {
			video: false,
			audio: false,
			screen: false,
			showModal: false,
			screenAvailable: false,
			messages: [],
			message: "",
			newmessages: 0,
			askForUsername: true,
			username: "",
			showEmojis: false,
		}
		connections = {}

		this.getPermissions()
	}

	getPermissions = async () => {
		try {
			await navigator.mediaDevices.getUserMedia({ video: true })
				.then(() => this.videoAvailable = true)
				.catch(() => this.videoAvailable = false)

			await navigator.mediaDevices.getUserMedia({ audio: true })
				.then(() => this.audioAvailable = true)
				.catch(() => this.audioAvailable = false)

			if (navigator.mediaDevices.getDisplayMedia) {
				this.setState({ screenAvailable: true })
			} else {
				this.setState({ screenAvailable: false })
			}

			if (this.videoAvailable || this.audioAvailable) {
				navigator.mediaDevices.getUserMedia({ video: this.videoAvailable, audio: this.audioAvailable })
					.then((stream) => {
						window.localStream = stream
						this.localVideoref.current.srcObject = stream
					})
					.then((stream) => { })
					.catch((e) => console.log(e))
			}
		} catch (e) { console.log(e) }
	}

	getMedia = () => {
		this.setState({
			video: this.videoAvailable,
			audio: this.audioAvailable
		}, () => {
			this.getUserMedia()
			this.connectToSocketServer()
		})
	}

	getUserMedia = () => {
		if ((this.state.video && this.videoAvailable) || (this.state.audio && this.audioAvailable)) {
			navigator.mediaDevices.getUserMedia({ video: this.state.video, audio: this.state.audio })
				.then((stream) => this.getUserMediaSuccess(stream))
				.then((stream) => { })
				.catch((e) => console.log(e))
		} else {
			try {
				let tracks = this.localVideoref.current.srcObject.getTracks()
				tracks.forEach(track => track.stop())
			} catch (e) { }
		}
	}

	getUserMediaSuccess = (stream) => {
		try {
			window.localStream.getTracks().forEach(track => track.stop())
		} catch (e) { console.log(e) }

		window.localStream = stream
		this.localVideoref.current.srcObject = stream

		for (let id in connections) {
			if (id === socketId) continue

			connections[id].addStream(window.localStream)

			connections[id].createOffer().then((description) => {
				connections[id].setLocalDescription(description)
					.then(() => {
						socket.emit('signal', id, JSON.stringify({ 'sdp': connections[id].localDescription }))
					})
					.catch(e => console.log(e))
			})
		}

		stream.getTracks().forEach(track => track.onended = () => {
			this.setState({
				video: false,
				audio: false,
			}, () => {
				try {
					let tracks = this.localVideoref.current.srcObject.getTracks()
					tracks.forEach(track => track.stop())
				} catch (e) { console.log(e) }

				let blackSilence = (...args) => new MediaStream([this.black(...args), this.silence()])
				window.localStream = blackSilence()
				this.localVideoref.current.srcObject = window.localStream

				for (let id in connections) {
					connections[id].addStream(window.localStream)

					connections[id].createOffer().then((description) => {
						connections[id].setLocalDescription(description)
							.then(() => {
								socket.emit('signal', id, JSON.stringify({ 'sdp': connections[id].localDescription }))
							})
							.catch(e => console.log(e))
					})
				}
			})
		})
	}

	getDislayMedia = () => {
		if (this.state.screen) {
			if (navigator.mediaDevices.getDisplayMedia) {
				navigator.mediaDevices.getDisplayMedia({ video: true, audio: true })
					.then(this.getDislayMediaSuccess)
					.then((stream) => { })
					.catch((e) => console.log(e))
			}
		}
	}

	getDislayMediaSuccess = (stream) => {
		try {
			window.localStream.getTracks().forEach(track => track.stop())
		} catch (e) { console.log(e) }

		window.localStream = stream
		this.localVideoref.current.srcObject = stream

		for (let id in connections) {
			if (id === socketId) continue

			connections[id].addStream(window.localStream)

			connections[id].createOffer().then((description) => {
				connections[id].setLocalDescription(description)
					.then(() => {
						socket.emit('signal', id, JSON.stringify({ 'sdp': connections[id].localDescription }))
					})
					.catch(e => console.log(e))
			})
		}

		stream.getTracks().forEach(track => track.onended = () => {
			this.setState({
				screen: false,
			}, () => {
				try {
					let tracks = this.localVideoref.current.srcObject.getTracks()
					tracks.forEach(track => track.stop())
				} catch (e) { console.log(e) }

				let blackSilence = (...args) => new MediaStream([this.black(...args), this.silence()])
				window.localStream = blackSilence()
				this.localVideoref.current.srcObject = window.localStream

				this.getUserMedia()
			})
		})
	}

	gotMessageFromServer = (fromId, message) => {
		var signal = JSON.parse(message)

		if (fromId !== socketId) {
			if (signal.sdp) {
				connections[fromId].setRemoteDescription(new RTCSessionDescription(signal.sdp)).then(() => {
					if (signal.sdp.type === 'offer') {
						connections[fromId].createAnswer().then((description) => {
							connections[fromId].setLocalDescription(description).then(() => {
								socket.emit('signal', fromId, JSON.stringify({ 'sdp': connections[fromId].localDescription }))
							}).catch(e => console.log(e))
						}).catch(e => console.log(e))
					}
				}).catch(e => console.log(e))
			}

			if (signal.ice) {
				connections[fromId].addIceCandidate(new RTCIceCandidate(signal.ice)).catch(e => console.log(e))
			}
		}
	}

	changeCssVideos = (main) => {
		let widthMain = main.offsetWidth
		let minWidth = "30%"
		if ((widthMain * 30 / 100) < 300) {
			minWidth = "300px"
		}
		let minHeight = "40%"

		let height = "33vh"
		// let width = ""
		if (elms === 0 || elms === 1) {
			// width = "45%"
			height = "100%"
		} else if (elms === 2) {
			// width = "45%"
			height = "63vh"
		} else if (elms === 3 || elms === 4) {
			// width = "35%"
			height = "53vh"
		} else if (elms === 5 || elms === 6) {
			height = "43vh"
			// width = String(100 / elms) + "%"
		}
		// else {
		// 	// width = String(100 / elms) + "%"
		// }

		let videos = main.querySelectorAll("div")
		for (let a = 0; a < videos.length; ++a) {
			videos[a].style.minWidth = minWidth
			videos[a].style.minHeight = minHeight
			// videos[a].style.setProperty("width", width)
			videos[a].style.setProperty("height", height)
		}

		return { minWidth, minHeight, height }
	}

	changeCssSpan = (main) => {
		let marginTop;
		if (elms === 2) {
			marginTop = "-61vh"
		}
		else if (elms === 3 || elms === 4) {
			marginTop = "-51vh"
		}
		else if (elms === 5 || elms === 6) {
			marginTop = "-41vh"
		}
		else if (elms > 6) {
			marginTop = "-31vh"
		}
		let spans = main.querySelectorAll("span")
		for (let a = 0; a < spans.length; ++a) {
			spans[a].style.marginTop = marginTop;
			spans[a].style.setProperty("marginTop", marginTop)
		}
		return { marginTop }
	}
	connectToSocketServer = () => {
		socket = io.connect(server_url, { secure: true })

		socket.on('signal', this.gotMessageFromServer)

		socket.on('connect', () => {
			socket.emit('join-call', window.location.href, this.state.username)
			socketId = socket.id
			socket.on('chat-message', this.addMessage)

			socket.on('user-left', (id) => {
				let video = document.querySelector(`[data-socket="${id}"]`)
				let userId = document.querySelector(`[userId="${id}"]`)
				if (userId !== null) {
					if (video !== null) {
						video.parentNode.removeChild(video)
					}
					elms--
					userId.parentNode.removeChild(userId)
					if (elms > 1) {
						let main = document.getElementById('main')
						this.changeCssSpan(main)
						this.changeCssVideos(main)
					}

				}

			})

			socket.on('user-joined', (id, clients, users) => {
				clients.forEach((socketListId) => {
					connections[socketListId] = new RTCPeerConnection(peerConnectionConfig)
					// Wait for their ice candidate       
					connections[socketListId].onicecandidate = function (event) {
						if (event.candidate != null) {
							socket.emit('signal', socketListId, JSON.stringify({ 'ice': event.candidate }))
						}
					}

					// Wait for their video stream
					connections[socketListId].onaddstream = (event) => {
						// TODO mute button, full screen button
						var searchVidep = document.querySelector(`[data-socket="${socketListId}"]`)
						if (searchVidep !== null) { // if i don't do this check it make an empyt square
							searchVidep.srcObject = event.stream
						} else {
							elms = clients.length
							let main = document.getElementById('main')
							let cssMesure = this.changeCssVideos(main)
							let spanMeasure = this.changeCssSpan(main)

							let div = document.createElement("div")
							let video = document.createElement('video')
							let span = document.createElement("span")

							let css = {
								minWidth: cssMesure.minWidth, minHeight: cssMesure.minHeight, maxHeight: "100%", margin: "10px",
								borderStyle: "solid", borderColor: "#bdbdbd", objectFit: "fill", padding: "0px"
							}
							for (let i in css) div.style[i] = css[i]
							div.className = "rounded-lg border-solid border-2 border-[#bdbdbd] bg-black bg-cover w-[80%] sm:w-[50%] lg:w-[45%] xl:w-[40%] h-[50vh] sm:h-[55vh]"

							div.style.setProperty("width", cssMesure.width)
							div.style.setProperty("height", cssMesure.height)
							video.setAttribute('data-socket', socketListId)
							div.setAttribute("userId", socketListId)

							//video
							let videoCss = {
								padding: "0px", objectFit: "fill",
								width: "100%", height: "100%"
							}
							for (let i in videoCss) video.style[i] = videoCss[i]
							video.className = "rounded-lg"
							video.srcObject = event.stream
							video.autoplay = true
							video.playsinline = true

							//Span
							span.className = 'cursor-pointer flex items-center justify-center align-top py-2 absolute z-10  h-fit bg-[#666666] rounded-[44px] -mt-[48vh] sm:-mt-[51vh]  '
							let spanCss = {
								width: "fit-content", height: "fit-content",
								paddingLeft: "6px", paddingRight: "12px",
								borderLeft: "ridge", marginTop: spanMeasure.marginTop
							}
							for (let i in spanCss) span.style[i] = spanCss[i]
							let inner_span = document.createElement("h1")
							inner_span.className = "w-[25px] h-[25px] rounded-full"

							//profile
							let profileImage = document.createElement("img")
							profileImage.className = "w-[25px] h-[25px] rounded-full box-border object-cover"
							profileImage.src = profile
							profileImage.alt = "profile"
							inner_span.appendChild(profileImage)

							//username
							let userName = document.createElement("h1")
							userName.className = " ml-2 mt-1 font-medium text-white text-[14px]"
							userName.innerHTML = users[socketListId]

							span.appendChild(inner_span)
							span.appendChild(userName)

							div.appendChild(video)
							div.appendChild(span)

							main.appendChild(div)
						}
					}

					// Add the local video stream
					if (window.localStream !== undefined && window.localStream !== null) {
						connections[socketListId].addStream(window.localStream)
					} else {
						let blackSilence = (...args) => new MediaStream([this.black(...args), this.silence()])
						window.localStream = blackSilence()
						connections[socketListId].addStream(window.localStream)
					}
				})

				if (id === socketId) {
					for (let id2 in connections) {
						if (id2 === socketId) continue

						try {
							connections[id2].addStream(window.localStream)
						} catch (e) { }

						connections[id2].createOffer().then((description) => {
							connections[id2].setLocalDescription(description)
								.then(() => {
									socket.emit('signal', id2, JSON.stringify({ 'sdp': connections[id2].localDescription }))
								})
								.catch(e => console.log(e))
						})
					}
				}
			})
		})
	}

	silence = () => {
		let ctx = new AudioContext()
		let oscillator = ctx.createOscillator()
		let dst = oscillator.connect(ctx.createMediaStreamDestination())
		oscillator.start()
		ctx.resume()
		return Object.assign(dst.stream.getAudioTracks()[0], { enabled: false })
	}
	black = ({ width = 640, height = 480 } = {}) => {
		let canvas = Object.assign(document.createElement("canvas"), { width, height })
		canvas.getContext('2d').fillRect(0, 0, width, height)
		let stream = canvas.captureStream()
		return Object.assign(stream.getVideoTracks()[0], { enabled: false })
	}

	handleVideo = () => this.setState({ video: !this.state.video }, () => this.getUserMedia())
	handleAudio = () => this.setState({ audio: !this.state.audio }, () => this.getUserMedia())
	handleScreen = () => this.setState({ screen: !this.state.screen }, () => this.getDislayMedia())

	handleEndCall = () => {
		try {
			let tracks = this.localVideoref.current.srcObject.getTracks()
			tracks.forEach(track => track.stop())
		} catch (e) { }
		window.location.href = "/"
	}

	openChat = () => this.setState({ showModal: true, newmessages: 0 })
	closeChat = () => this.setState({ showModal: false })
	handleMessage = (e) => this.setState({ message: e.target.value })

	addMessage = (data, sender, socketIdSender) => {
		this.setState(prevState => ({
			messages: [...prevState.messages, { "sender": sender, "data": data }],
		}))
		if (socketIdSender !== socketId) {
			this.setState({ newmessages: this.state.newmessages + 1 })
		}
	}

	handleUsername = (e) => this.setState({ username: e.target.value })

	sendMessage = () => {
		if (this.state.message !== "") {
			socket.emit('chat-message', this.state.message, this.state.username)
			this.setState({ message: "", sender: this.state.username })
		}
	}

	copyUrl = () => {
		let text = window.location.href
		if (!navigator.clipboard) {
			let textArea = document.createElement("textarea")
			textArea.value = text
			document.body.appendChild(textArea)
			textArea.focus()
			textArea.select()
			try {
				document.execCommand('copy')
				message.success("Link copied to clipboard!")
			} catch (err) {
				message.error("Failed to copy")
			}
			document.body.removeChild(textArea)
			return
		}
		navigator.clipboard.writeText(text).then(function () {
			message.success("Link copied to clipboard!")
		}, () => {
			message.error("Failed to copy")
		})
	}

	connect = () => {
		if (this.state.username === "") {
			alert("Username Can not be Empty")
		} else {

			this.setState({ askForUsername: false }, () => this.getMedia())
		}
	}

	handleEmoji = () => this.setState({ showEmojis: !this.state.showEmojis })
	onEmojiClick = (emojiData, event) => {
		this.setState({ message: this.state.message + emojiData.emoji })
	};

	// isChrome = function () {
	// 	let userAgent = (navigator && (navigator.userAgent || '')).toLowerCase()
	// 	let vendor = (navigator && (navigator.vendor || '')).toLowerCase()
	// 	let matchChrome = /google inc/.test(vendor) ? userAgent.match(/(?:chrome|crios)\/(\d+)/) : null
	// 	// let matchFirefox = userAgent.match(/(?:firefox|fxios)\/(\d+)/)
	// 	// return matchChrome !== null || matchFirefox !== null
	// 	return matchChrome !== null
	// }

	render() {
		// if (this.isChrome() === false) {
		// 	return (
		// 		<div style={{
		// 			background: "white", width: "30%", height: "auto", padding: "20px", minWidth: "400px",
		// 			textAlign: "center", margin: "auto", marginTop: "50px", justifyContent: "center"
		// 		}}>
		// 			<h1>Sorry, this works only with Google Chrome</h1>
		// 		</div>
		// 	)
		// }

		if (this.state.message !== "") {
			let messageInput = document.getElementById("messageInput");
			messageInput.addEventListener("keypress", function (event) {
				if (event.key === "Enter") {
					event.preventDefault();
					document.getElementById("messageButton").click();
				}
			});
		}
		return (
			<div className='h-screen '>
				{this.state.askForUsername === true ?
					<div>
						<NavBar name={this.state.username} />
						<div className='px-[5%]'>
							<div className=' drop-shadow-lg w-full sm:m-auto sm:w-[30%] sm:px-0 sm:min-w-[400px]' style={{
								background: "white", height: "auto", padding: "20px",
								textAlign: "center", marginTop: "50px", justifyContent: "center"
							}}>
								<p style={{ margin: 0, fontWeight: "bold", paddingRight: "50px" }}>Set your username</p>
								<Input placeholder="Username" onChange={e => this.handleUsername(e)} />
								<Button variant="contained" onClick={this.connect} style={{ margin: "20px", backgroundColor: "#5593f7", color: "white" }}>Connect</Button>
							</div>
						</div>
						<div className=' relative z-0 flex items-center justify-center pt-[40px] '>
							<video className='rounded-lg w-[80%] h-[70%] sm:w-[50%] sm:h-[50%] md:w-[40%] md:h-[40%] lg:w-[30%] lg:h-[30%] ' id="my-video" ref={this.localVideoref} autoPlay muted style={{
								borderStyle: "solid", borderColor: "#bdbdbd", objectFit: "fill", 
							}}></video>
							<div className=' -mt-[40%] sm:-mt-[25%] lg:-mt-[18%] cursor-pointer flex items-center justify-center align-top py-2 absolute z-10  h-fit bg-[#666666] rounded-[44px] ' style={{ width: "fit-content", paddingLeft: "6px", paddingRight: "12px", borderLeft: "ridge" }} >
								<div className='w-[25px] h-[25px] rounded-full'>
									<img src={profile} alt="profile" className=' w-[25px] h-[25px] rounded-full box-border object-cover ' />
								</div>
								<h1 className=' ml-2 mt-1 font-medium text-white text-[20px] '>{this.state.username}</h1>
							</div>
						</div>
					</div>
					:
					<div className='h-screen'>
						<NavBar name={this.state.username} />
						<div className="py-2 btn-down " style={{ backgroundColor: "whitesmoke", color: "whitesmoke", textAlign: "center" }}>
							<IconButton style={{ marginLeft: "20px", color: "white", backgroundColor: "#5593f7" }} onClick={this.handleVideo}>
								{(this.state.video === true) ? <VideocamIcon /> : <VideocamOffIcon />}
							</IconButton>

							<IconButton style={{ marginLeft: "20px", color: "white", backgroundColor: "#f44336" }} onClick={this.handleEndCall}>
								<CallEndIcon />
							</IconButton>

							<IconButton style={{ marginLeft: "20px", color: "white", backgroundColor: "#5593f7" }} onClick={this.handleAudio}>
								{this.state.audio === true ? <MicIcon /> : <MicOffIcon />}
							</IconButton>

							{this.state.screenAvailable === true ?
								<IconButton style={{ marginLeft: "20px", color: "white", backgroundColor: "#5593f7" }} onClick={this.handleScreen}>
									{this.state.screen === true ? <ScreenShareIcon /> : <StopScreenShareIcon />}
								</IconButton>
								: null}

							<Badge badgeContent={this.state.newmessages} max={999} color="secondary" onClick={this.openChat}>
								<IconButton style={{ marginLeft: "20px", color: "white", backgroundColor: "#5593f7" }} onClick={this.openChat}>
									<ChatIcon />
								</IconButton>
							</Badge>
						</div>

						<Modal show={this.state.showModal} onHide={this.closeChat} style={{ zIndex: "999999" }}>
							<Modal.Header closeButton>
								<Modal.Title>Chat Room</Modal.Title>
							</Modal.Header>
							<Modal.Body style={{ overflow: "auto", overflowY: "auto", height: "400px", textAlign: "left" }} >
								{this.state.messages.length > 0 ? this.state.messages.map((item, index) => (
									<>
										{item.sender === this.state.username ?
											<div className='flex items-end mb-[35px] justify-end  '>
												<p style={{ marginBottom: "-10px" }}><b>You</b></p>
												<div className=' ml-2 bg-[#f2f2f2]  text-black p-3 rounded-t-[10px] rounded-br-[10px] text-[20px] font-normal w-fit' key={index} style={{ textAlign: "right" }}>

													<p className='text-left break-words '>{item.data}</p>
												</div>
											</div> :
											<div className='flex items-end mb-[35px]'>
												<div className='bg-[#31D0F4]  text-white p-3 rounded-t-[10px] rounded-bl-[10px] text-[20px] font-normal w-fit ' key={index} style={{ textAlign: "left" }}>
													<p className='text-left break-words ' >{item.data}</p>
												</div>
												<p style={{ marginBottom: "-10px" }} className='ml-2'><b>{item.sender}</b></p>
											</div>
										}
									</>
								)) : <p>Messages can only be seen by people in the call and are deleted when the call ends.</p>}
								{this.state.showEmojis === true ? <EmojiPicker
									onEmojiClick={this.onEmojiClick} /> : ""}
							</Modal.Body>
							<Modal.Footer className="div-send-msg">
								{this.state.showEmojis === true ?
									<div className='flex items-center justify-center '>
										<IconButton className='w-[40px] h-[40px]' onClick={this.handleEmoji}>
											<Clear />
										</IconButton>
										<IconButton onClick={this.handleEmoji} className=' ml-2 w-[40px] h-[40px]' style={{ color: "#ffd11a" }} >
											<EmojiEmotionsOutlined />
										</IconButton>
									</div> :
									<IconButton onClick={this.handleEmoji} className='w-[40px] h-[40px]' style={{ color: "#cccccc" }} >
										<EmojiEmotionsOutlined />
									</IconButton>
								}
								<Input id='messageInput' placeholder="Write a message" value={this.state.message} onChange={e => this.handleMessage(e)} />
								<IconButton id='messageButton' style={{ color: "white", backgroundColor: "#5593f7" }}
									onClick={this.sendMessage}>
									<Send />
								</IconButton>
							</Modal.Footer>
						</Modal>


						<div className="container">
							<div style={{ paddingTop: "5px" }}>
								<Input value={window.location.href} disable="true"></Input>
								<Button style={{
									backgroundColor: "#5593f7", color: "white", marginLeft: "20px",
									marginTop: "10px", fontSize: "12px"
								}} onClick={this.copyUrl}>Copy invite link</Button>
							</div>

							<div id="main" className="flex flex-wrap items-center justify-center flex-container" style={{ margin: 0, paddingBottom: "64px" }}>
								<div className='relative z-0 rounded-lg border-solid border-2 border-[#bdbdbd] bg-black bg-cover w-[80%] sm:w-[50%] lg:w-[45%] xl:w-[40%] h-[50vh] sm:h-[55vh]' id="my-video" style={{ margin: "10px", padding: "0px" }} >
									<video className='rounded-lg' ref={this.localVideoref} autoPlay muted style={{
										padding: "0px", objectFit: "fill",
										width: "100%", height: "100%"
									}}></video>
									<VideoText profile={profile} username={this.state.username} />
								</div>
							</div>
						</div>
					</div>
				}
			</div>
		)
	}
}

export default Video