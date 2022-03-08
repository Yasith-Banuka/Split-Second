const { getClientForSocket, getChatRoom } = require("../chatRoomManager/chatRoomManager");
const util = require("../util/util");

module.exports = {
    sendwho: function (socket) {
        let room = getClientForSocket(socket).chatRoom; 
        let roomDetails = getChatRoom(room);
        let identities = roomDetails.clients;
        let owner = roomDetails.owner;
        let sendWhoReply;
        sendWhoReply = {
            "type" : "roomcontents",
            "roomid" : room,
            "identities" : identities,
            "owner" : owner
            };
        socket.write(util.jsonEncode(sendWhoReply));
    }
}