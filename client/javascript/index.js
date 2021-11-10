import * as canvas from './canvas.js'
import * as chat from './chat.js'
import * as sign_in from './sign-in.js'

/*....main() is called inside of the sign-in.js file
......where the socket is initiated and user credentials
......are submitted...*/
function main() {

    //....canvas funcs..
    canvas.keyDownEvent()
    canvas.keyUpEvent()
    canvas.staticPlayerInfo()
    canvas.gameInfo()
    canvas.takeBallResponse()

    //....chat funcs..
    chat.socketChatOutput()
    chat.serverSpamResponse()

    //...sign-in funcs..
    sign_in.socketConnectionResponse()

    // response('d278542dfc0d27975e2e9247d396c7e5')
    // process.env.WEATHER_API_KEY
    // console.log((Date.now()/1000)/60/60/24/365)
    
}
// const response = async (key) => await fetch(`http://api.weatherstack.com/current?access_key=${key}&query=fetch:ip&units=f`).then(res => res.json()).then(console.log)
export { main };
