const { removeClientFromChatRoom, joinClientNewChatRoom } = require("../../chatRoomManager/chatRoomManager");
const { isClientIdUsed } = require("../../data/globalClients");
const { getLocalChatRoom } = require("../../data/serverChatRooms");
const { getClientForSocket } = require("../../data/serverClients");
const util = require("../../util/util");
const { joinRoomChangeServer } = require("./joinRoomChangeServer");

module.exports = {
    joinRoom: function (socket, roomId) {
        let client = getClientForSocket(socket);
        let clientPrevChatRoomId = client.chatRoom;

        let approveMessage;

        if (checkRoomIsAuthentic(client, roomId)) {

            removeClientFromChatRoom(clientPrevChatRoomId, client);

            // handle seperately - when the chat room in a different server
            if (isClientIdUsed(roomId)) {

                joinRoomChangeServer(socket, roomId, client);

            } else {

                // when chat room in the same server

                approveMessage = {
                    "type": "roomchange",
                    "identity": client.clientIdentity,
                    "former": clientPrevChatRoomId,
                    "roomid": roomId
                };


                client.chatRoom = roomId;

                joinClientNewChatRoom(roomId, client);

                // send neccessary messages
                util.broadcast(getLocalChatRoom(roomId).clients, approveMessage);


            }

            // send neccessary messages - this is common for the both cases
            util.broadcast(getLocalChatRoom(clientPrevChatRoomId).clients, approveMessage);
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
function checkClientIsOwner(client) {
    let roomOwner = getLocalChatRoom(client.chatRoom).owner;
    return (client == roomOwner);
}

/*
 
    if chatRoom is authentic and client is owner
        return true
    else
        reutrn false
 
*/
function checkRoomIsAuthentic(client, roomId) {
    if ((typeof getLocalChatRoom(roomId) != "boolean") || isChatroomIdUsed(roomId)) {
        if (!checkClientIsOwner(client)) {
            return true;
        }
    } else {
        return false;
    }
}