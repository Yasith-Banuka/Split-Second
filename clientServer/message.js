const { getClientForSocket, getChatRoom } = require("../chatRoomManager/chatRoomManager");
const util = require("../util/util");

module.exports = {
    message: function (socket, content) {
        let client = getClientForSocket(socket);

        let message = {
            "type": "message",
            "identity": client.clientIdentity,
            "content": content
        };

        util.broadcast(getChatRoom(client.chatRoom).clients, message);
    }
}