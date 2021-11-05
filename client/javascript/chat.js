import {socket} from './sign-in.js'
const chatBox = document.getElementById('chat-box')
const input = document.getElementById('chat-input')
const chatMessages = document.getElementById('messages')

const socketChatInput = input.addEventListener('keydown', e => {
    if (input.value === '') return
    if (e.key === 'Enter') {
        socket.emit('chat message to server', input.value)
        input.value = ''
    }
})

const socketChatOutput = () => socket.on('chat message to all users', data => {
    const [socketMessage, color, name] = data
    if(chatMessages.childElementCount >= 20) chatMessages.children[0].remove()
    const messageDiv = document.createElement('div')
    messageDiv.id = 'message'
    messageDiv.style.cssText = `color:${color}`
    messageDiv.append(`[ ${name} ] : ${socketMessage}`)
    chatMessages.append(messageDiv)
})

export { socketChatOutput }