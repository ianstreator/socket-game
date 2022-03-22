import { socket } from './sign-in.js'
import { isFocused } from './chat.js'
const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')
window.addEventListener('contextmenu', e => e.preventDefault())
const canWidth = canvas.width = 600
const canHeight = canvas.height = 600

const keyDownEvent = () => window.addEventListener('keydown', e => {
    if (isFocused) return
    socket.emit('player go', [e.key])
})
const keyUpEvent = () => window.addEventListener('keyup', e => {
    if (isFocused) return
    socket.emit('player stop', [e.key])
})

const takeBallResponse = () => {
    canvas.addEventListener('contextmenu', e => {
        e.preventDefault()
        socket.emit('take flag', null)
    })
    socket.on('take flag true', data => swal(data))
}
let players

const staticPlayerInfo = () => socket.on('all player info', data => {
    players = data
})

const gameInfo = () => socket.on('game info', data => {

    c.clearRect(0, 0, canWidth, canHeight)
    players.forEach(e => {
        data.forEach(e2 => {
            if (e2.name === e.name) {
                e.x = e2.x
                e.y = e2.y
            }
        })
        c.beginPath()
        c.arc(e.x, e.y, e.r, 0, Math.PI * 2)
        c.fillStyle = e.color
        c.shadowColor = e.color
        c.shadowBlur = e.r * .75
        c.fill()
        c.font = '14px bold'
        c.fillStyle = 'black'
        c.textAlign = 'center'
        c.fillText(e.name, e.x, e.y)
    })
})


export { gameInfo, staticPlayerInfo, keyDownEvent, keyUpEvent, takeBallResponse, canWidth, canHeight }