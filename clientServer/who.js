const { getClientsChatRoom, getChatRoomOwner } = require("../chatRoomManager/chatRoomManager");
const util = require("../util/util");

module.exports = {
    sendwho: function (socket) {
        let room = getChatRoom(); //how to get room
        let identities = getClientsChatRoom(room);
        let owner = getChatRoomOwner(room);
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