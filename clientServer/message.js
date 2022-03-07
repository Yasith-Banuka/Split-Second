const { getClientForSocket, getClientsChatRoom } = require("../chatRoomManager/chatRoomManager");
const util = require("../util/util");

module.exports = {
    message: function (socket, content) {
        let client = getClientForSocket(socket);

        let message = {
            "type": "message",
            "identity": client.clientIdentity,
            "content": content
        };

        util.broadcast(getClientsChatRoom(client.chatRoom), message);
    }
}