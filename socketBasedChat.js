const http = require('http')
const ioLib = require('socket.io')

module.exports = {
    setUpSocketBasedChat: (app) => {
        const server = http.Server(app)
        const io = ioLib(server)

        const users = {};
        const roomName = 'chat';

        app.get('/chat', (req, res) => {
            res.render('chat/room')
        })

        io.on('connection', socket => {
            socket.on('new-user', (room, name) => {
                socket.join(room)
                users[socket.id] = name
                socket.to(room).broadcast.emit('user-connected', name)
            })
            socket.on('send-chat-message', (room, message) => {
                socket.to(room).broadcast.emit('chat-message', { message: message, name: users[socket.id] })
            })
            socket.on('disconnect', () => {
                socket.to(roomName).broadcast.emit('user-disconnected', users[socket.id])
                delete users[socket.id]
            })
        })

        return server;
    }
}
