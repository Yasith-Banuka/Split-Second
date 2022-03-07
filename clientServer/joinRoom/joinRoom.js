const { removeClientFromChatRoom, joinClientNewChatRoom, getClientForSocket, getChatRoom } = require("../../chatRoomManager/chatRoomManager");
const util = require("../../util/util");

// todo: need to implment the multi server part

module.exports = {
    joinRoom: function (socket, roomId) {
        let client = getClientForSocket(socket);
        let clientPrevChatRoomId = client.chatRoom;

        let approveMessage;

        if (checkRoomIsAuthentic(client, roomId)) {
            approveMessage = {
                "type": "roomchange",
                "identity": client.clientIdentity,
                "former": clientPrevChatRoomId,
                "roomid": roomId
            };

            removeClientFromChatRoom(clientPrevChatRoomId, client);

            client.chatRoom = roomId;

            joinClientNewChatRoom(roomId, client);

            // send neccessary messages
            util.broadcast(getChatRoom(clientPrevChatRoomId).clients, approveMessage);
            util.broadcast(getChatRoom(roomId).clients, approveMessage);

            console.log("room changed");

        } else {
            approveMessage = {
                "type": "roomchange",
                "identity": client.clientIdentity,
                "former": client.chatRoom,
                "roomid": client.chatRoom
            };
            socket.write(util.jsonEncode(approveMessage));

        }
    }
}

/*

    if client is the owner of the room
        return true
    else
        return false

 */
function checkClientIsOwner(client, roomId) {
    let roomOwner = getChatRoom(roomId).owner;
    return (client == roomOwner);
}

/*
 
    if chatRoom is authentic and client is owner
        return true
    else
        reutrn false
 
*/
function checkRoomIsAuthentic(client, roomId) {
    if (typeof getChatRoom(roomId) != "boolean") {
        if (!checkClientIsOwner(client, roomId)) {
            return true;
        }
    } else {
        return false;
    }
}