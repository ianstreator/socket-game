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

}


export { main };
