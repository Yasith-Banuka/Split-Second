const { getClientsChatRoom, getChatRoomOwner, deleteClient } = require("../chatRoomManager/chatRoomManager");
const util = require("../util/util");

module.exports = {
    quit: function (socket, identity) {
        //get chat room and pass it to getChatRoomOwner function and set to former
        sendQuitReply = {
            "type" : "roomchange", 
            "identity" : identity, 
            "former" : "jokes", 
            "roomid" : ""};
        socket.write(util.jsonEncode(sendQuitReply));
        
        // check if client is the chat room owner
        roomOwner = getChatRoomOwner();
        if (identity == roomOwner){
            //delete room
        }
        else{
            deleteClient(identity);
        }
    }
    

}