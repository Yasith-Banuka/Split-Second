module.exports = {
    createRoom: function (socket, roomId) {
        let client = getClientForSocket(socket);

        let message = {
            "type": "message",
            "identity": client.clientIdentity,
            "content": content
        };

        util.broadcast(getClientsChatRoom(client.chatRoom), message);
    }
}