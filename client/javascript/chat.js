import { socket } from './sign-in.js'
const chatBox = document.getElementById('chat-box')
const input = document.getElementById('chat-input')
const chatMessages = document.getElementById('messages')

const createMessageContent = (socketMessage, color, name) => {
    const messageContainer = document.createElement('div')
    messageContainer.id = 'messageContainer'

    const nameDiv = document.createElement('div')
    nameDiv.id = 'nameDiv'
    nameDiv.style.cssText = `color:${color}`

    const timeDiv = document.createElement('div')
    timeDiv.id = 'timeDiv'

    const messageDiv = document.createElement('div')
    messageDiv.id = 'messageDiv'

    nameDiv.append(`[ ${name} ]`)
    timeDiv.append(timeOfDay())
    messageDiv.append(socketMessage)

    messageContainer.append(nameDiv, messageDiv, timeDiv)

    chatMessages.append(messageContainer)
}

let isFocused = false

window.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
        if (isFocused && !input.value) {
            input.setAttribute('disabled', true)
            input.blur()
            isFocused = false
            input.placeholder = 'Press "enter" to chat'
        } else {
            input.removeAttribute('disabled')
            input.focus()
            isFocused = true
            input.placeholder = 'You are chatting...  (Press "enter" to exit)'
        }
        if (isFocused && input.value) {
            socket.emit('chat message to server', input.value)
            input.value = ''
        }
    }
})
window.addEventListener('click', e => {
    if (isFocused) {
        input.setAttribute('disabled', true)
        isFocused = false
        input.blur()
        input.value = ''
        input.placeholder = 'Press "enter" to chat'
    }
})


const timeOfDay = () => {
    let date = new Date
    let hours = date.getHours()
    let minutes = date.getMinutes()
    const am_pm = hours < 12 ? 'AM' : 'PM'
    if (minutes < 10) minutes = `0${+minutes}`
    if (hours > 12) hours = hours - 12
    const time = `${hours}:${minutes} ${am_pm}`
    return time
}
const serverSpamResponse = () => socket.on('server spam alert', data => {
    const socketMessage = data
    createMessageContent(socketMessage, 'grey', 'Server')
    setTimeout(() => chatMessages.scrollTop = chatMessages.scrollHeight, 200)
})
const socketChatOutput = () => socket.on('chat message to all users', data => {
    const [socketMessage, color, name] = data
    if (chatMessages.childElementCount >= 20) chatMessages.children[0].remove()
    createMessageContent(socketMessage, color, name)
    setTimeout(() => chatMessages.scrollTop = chatMessages.scrollHeight, 200)
})

export { socketChatOutput, isFocused, serverSpamResponse }