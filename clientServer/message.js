const { getLocalChatRoom } = require("../data/serverChatRooms");
const { getClientForSocket } = require("../data/serverClients");
const util = require("../util/util");

module.exports = {
    message: function (socket, content) {
        let client = getClientForSocket(socket);

        let message = {
            "type": "message",
            "identity": client.clientIdentity,
            "content": content
        };

        util.broadcast(getLocalChatRoom(client.chatRoom).clients, message);
    }
}