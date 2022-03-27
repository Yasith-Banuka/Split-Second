const { gloablChatrooms } = require("../data/globalChatRooms");
const util = require("../util/util");

module.exports = {
    sendlist: function (socket) {
        let listReply;
        let rooms = [];

        for (var key in gloablChatrooms) {
            if (gloablChatrooms.hasOwnProperty(key)){
                rooms.push(key);
            }
            
        }

        listReply = {
            "type": "roomlist",
            "rooms": rooms
        };

        socket.write(util.jsonEncode(listReply));
    }
}



