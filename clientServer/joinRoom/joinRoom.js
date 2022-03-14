const { removeClientFromChatRoom, joinClientNewChatRoom } = require("../../chatRoomManager/chatRoomManager");
const { getLocalChatRoom } = require("../../data/serverChatRooms");
const { getClientForSocket } = require("../../data/serverClients");
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
            util.broadcast(getLocalChatRoom(clientPrevChatRoomId).clients, approveMessage);
            util.broadcast(getLocalChatRoom(roomId).clients, approveMessage);

            console.log("room changed");

        } else {
            approveMessage = {
                "type": "roomchange",
                "identity": client.clientIdentity,
                "former": client.chatRoom,
                "roomid": client.chatRoom
            };
            socket.write(util.jsonEncode(approveMessage));

            console.log("room changed failed");
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
    let roomOwner = getLocalChatRoom(roomId).owner;
    return (client == roomOwner);
}

/*
 
    if chatRoom is authentic and client is owner
        return true
    else
        reutrn false
 
*/
function checkRoomIsAuthentic(client, roomId) {
    if (typeof getLocalChatRoom(roomId) != "boolean") {
        if (!checkClientIsOwner(client, roomId)) {
            return true;
        }
    } else {
        return false;
    }
}