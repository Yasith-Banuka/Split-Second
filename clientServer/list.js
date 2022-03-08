const { serverChatRooms } = require("../chatRoomManager/chatRoomManager");
const util = require("../util/util");

module.exports = {
    sendlist: function (socket) {
        
        let listReply;
        let rooms=[];
        let arrayLength = serverChatRooms.length;

        for (var i = 0; i < arrayLength; i++) {
            rooms.push(serverChatRooms.chatRoomIdentity);
        }

        listReply = {
            "type" : "roomlist",
            "rooms" : rooms
            };

        socket.write(util.jsonEncode(listReply));
    }
}



