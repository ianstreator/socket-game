const express = require('express')
const app = express()
const path = require('path')

app.use(express.static(path.join(__dirname, './client')))

const PORT = process.env.PORT || 4000
const server = app.listen(PORT, () => {
    console.log(`server listening on port ${PORT}...`)
})

const io = require('socket.io')(server);

class Player {
    constructor(x, y, r, color, name, directions, hasMoved, hasBall) {
        this.x = x,
            this.y = y,
            this.r = r,
            this.color = color,
            this.name = name,
            this.directions = directions,
            this.hasMoved = hasMoved,
            this.hasBall = hasBall
    }
}

const players = {}
const userNames = {}
io.on('connection', socket => {

    //......RECIEVING USER INFO FROM CLIENT (EITHER ACCEPTED OR REJECTED).....
    const { name, color } = socket.handshake.query
    if (userNames[name]) {
        socket.emit('response', false)
        socket.disconnect()
        return
    }
    socket.emit('response', true)
    const player = new Player(100, 100, 10, color, name, {}, false, false)
    players[socket.id] = player
    userNames[name] = true
    const playerInfo = Object.values(players)
    io.emit('all player info', playerInfo)
    io.emit('game info', playerInfo)

    //.......CLIENT KEYBOARD INPUTS TO CONTROL CANVAS CHARACTER......
    socket.on('player go', data => {
        const player = players[socket.id]
        player.directions[data] = true
    })
    socket.on('player stop', data => {
        const player = players[socket.id]
        delete player.directions[data]
    })
    socket.on('take ball', data => {
        const player = players[socket.id]
        if (player.hasBall === false) {
            io.emit('take ball true', `${player.name} has taken the ball!`)
        }
    })

    //.......RECIEVING CLIENT CHAT MESSAGES AND RE-EMITTING THEM TO ALL CLIENTS..........
    const messageLimiter = []
    socket.on('chat message to server', message => {
        const player = players[socket.id]
        // const regex = new RegExp(process.env.CHAT_FILTER, "i")
        // if (regex.test(message)) {
        //     console.log('could not send this message')
        //     return
        // }
        let currentTime = Date.now()
        messageLimiter.unshift(currentTime)
        messageLimiter.splice(2, 1)
        if (messageLimiter[0] - messageLimiter[1] < 1000) {
            socket.emit('server spam alert', 'spam is annoying.')
            return
        }
        io.emit('chat message to all users', [message, player.color, player.name])
    })

    //........USER RESIZING WINDOW........
    socket.on('resize game', data => {
        const [canWidth, canHeight] = data
        console.log(canWidth, canHeight)
        const player = players[socket.id]
        player.sizing['width'] = canWidth
        player.sizing['height'] = canHeight
    })

    //.....CLIENT DISCONNECTING FROM THE SERVER..........
    socket.on('disconnect', () => {
        delete userNames[players[socket.id].name]
        delete players[socket.id]
        const playerInfo = Object.values(players)
        io.emit('all player info', playerInfo)
        io.emit('game info', playerInfo)
    })
})

setInterval(() => {
    const playerInfo = Object.values(players)
    playerInfo.forEach(e => {
        e.hasMoved = false
        let x = 0
        let y = 0
        if (e.directions.w && e.y - e.r > 0) y -= 5
        if (e.directions.a && e.x - e.r > 0) x -= 5
        if (e.directions.s && e.y + e.r < 400) y += 5
        if (e.directions.d && e.x + e.r < 400) x += 5
        e.y += y
        e.x += x
        e.hasMoved = x || y
    })
    const playersMoving = playerInfo.filter(e => e.hasMoved)

    if (playersMoving[0] !== undefined) {
        io.emit('game info', playersMoving)
    }
}, 10);