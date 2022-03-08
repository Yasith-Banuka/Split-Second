const { getClientForSocket, getChatRoom, removeClientFromServer } = require("../chatRoomManager/chatRoomManager");
const util = require("../util/util");
const { deleteRoom } = require("./deleteRoom");

module.exports = {
    quit: function (socket) {

        let client = getClientForSocket(socket);
        let room = client.chatRoom;
        let roomDetails = getChatRoom(room);
        let owner = (roomDetails.owner == null) ? "" : roomDetails.owner.clientIdentity;
        let clientList = roomDetails.clients

        //send room change msg with null string as new room
        quitReply = {
            "type" : "roomchange", 
            "identity" : client.clientIdentity, 
            "former" : room, 
            "roomid" : ""
        };

        socket.write(util.jsonEncode(quitReply));

        removeClientFromChatRoom(room, client.clientIdentity);
        removeClientFromServer(client.clientIdentity);
        
        util.broadcast(clientList, quitReply);
        

        if (client.clientIdentity == owner){
            //delete room
            deleteRoom(socket, room);
        }
        
    }
    

}
