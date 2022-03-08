const { getClientForSocket, getChatRoom } = require("../chatRoomManager/chatRoomManager");
const util = require("../util/util");

module.exports = {
    quit: function (socket) {

        let client = getClientForSocket(socket);
        let room = client.chatRoom;
        let roomDetails = getChatRoom(room);
        let roomOwner = roomDetails.owner;

        //send room change msg with null string as new room
        quitReply = {
            "type" : "roomchange", 
            "identity" : client.clientIdentity, 
            "former" : room, 
            "roomid" : ""
        };

        socket.write(util.jsonEncode(quitReply));

        removeClientFromChatRoom(room, client.clientIdentity);

        // check if client is the chat room owner
        roomOwner = getChatRoomOwner();

        if (client.clientIdentity == roomOwner){
            //delete room
        }
        
    }
    

}