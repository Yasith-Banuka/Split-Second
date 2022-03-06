const { serverClients, serverChatRooms } = require("../chatRoomManager/chatRoomManager");
const util = require("../util/util");

module.exports = {
    sendwho: function (socket) {
        let sendWhoReply;
        sendWhoReply = {
            "type" : "roomcontents",
            "roomid" : "jokes",
            "identities" : ["Adel","Chenhao","Maria"],
            "owner" : "Adel"
            };
        socket.write(util.jsonEncode(sendWhoReply));
    }
}