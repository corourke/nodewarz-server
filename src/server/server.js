import Server from 'socket.io'
import { setUserId } from '../reducers/game'
import { makeStore } from '../store/configureStore'

var nextUser = 1; // TODO: Temporary user assignment

export function startServer(store) {
    const io = new Server().attach(7000)

    io.on('connection', (socket) => {
        // A new user has connected
        console.log('A user connected. Socket #' + socket.id)

        socket.on('message', function(msg) {
                console.log('message: ' + msg)
                io.emit('chat', msg)
        })

        socket.on('login', function(msg) {
            console.log('user login: ' + msg)
            socket.emit('action', setUserId(nextUser))
            nextUser++
        })

        socket.on('sync', function() {
            console.log('sync')
            // TODO: don't broadcast state -- it should be requested from client as needed
            io.emit('state', store.getState().toJS())
        })

        socket.on('action', function(action) {
            try {
                store.dispatch(action)
            } catch (e) {
                console.log("Error with action: " + e)
            }
        })

    })

    console.log("Server listening")

    return io
}
