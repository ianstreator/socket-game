import { main } from './index.js'
import { canWidth, canHeight } from './canvas.js'

const join = document.getElementById('join')
const colors = document.getElementsByClassName('color-btn')
const createAccountModal = document.getElementById('create-account-modal')
const userName = document.getElementById('user-name')
let socket

let color = null
const Colors = Object.values(colors)

Colors.forEach(button => {
    button.addEventListener('click', () => {
        color = button.value
        join.style.cssText = `background-color:${button.value}`
    })
})

const requestServerToJoinSocketConnection = join.addEventListener('click', async e => {
    e.preventDefault()
    if (userName.value === '' || color === null) return
    const name = userName.value
    socket = io(undefined, {
        query: { color, name, canWidth, canHeight }
    })
    socketConnectionResponse()
    main()
})

const socketConnectionResponse = () => {
    socket.on('response', data => {
        data ? createAccountModal.remove() : window.alert('that name has already been taken.. try another name.')
    })
}

export { socket, socketConnectionResponse }