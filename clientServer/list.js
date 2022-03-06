const { serverClients, serverChatRooms } = require("../chatRoomManager/chatRoomManager");
const util = require("../util/util");

module.exports = {
    sendlist: function (socket) {
        let sendListReply;
        sendListReply = {
            "type" : "roomlist",
            "rooms" : ["MainHall-s1", "MainHall-s2", "jokes"]
            };
        socket.write(util.jsonEncode(sendListReply));
    }
}



