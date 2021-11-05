import { socket } from './sign-in.js'
const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

const canWidth = canvas.width = 400
const canHeight = canvas.height = 400

const keyDownEvent = () => window.addEventListener('keydown', e => {
    socket.emit('player go', [e.key])
})
const keyUpEvent = () => window.addEventListener('keyup', e => {
    socket.emit('player stop', [e.key])
})


let players

const staticPlayerInfo = () => socket.on('all player info', data => {
    players = data
    console.log(players)
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
        c.fill()
        c.font = '18px bold'
        c.fillStyle = 'black'
        c.fillText(e.name, e.x, e.y)
    })
})


export { gameInfo, staticPlayerInfo, keyDownEvent, keyUpEvent }