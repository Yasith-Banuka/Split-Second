const { getChatRooms } = require("../chatRoomManager/chatRoomManager");
const util = require("../util/util");

module.exports = {
    sendlist: function (socket) {
        let sendListReply;
        let rooms = getChatRooms();
        sendListReply = {
            "type" : "roomlist",
            "rooms" : rooms
            };
        socket.write(util.jsonEncode(sendListReply));
    }
}



