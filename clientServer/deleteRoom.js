const { joinClientNewChatRoom } = require("../chatRoomManager/chatRoomManager");
const { getLocalChatRoom, getMainHallID, serverChatRooms } = require("../data/serverChatRooms");
const { serverClients, getClientForSocket } = require("../data/serverClients");
const util = require("../util/util");

// todo: If successfully deleted, s1 informs other servers by sending the message

module.exports = {
    deleteRoom: function (socket, roomId) {
        let client = getClientForSocket(socket);

        let approveMessage;

        if (checkRoomIsAuthentic(client, roomId)) {
            let roomChange = {
                "type": "roomchange",
                "identity": "",
                "former": roomId,
                "roomid": getMainHallID()
            };

            let chatRoom = getLocalChatRoom(roomId);
            let clientListForChatRoom = chatRoom.clients;
            let clientListForMainHall = serverChatRooms[0].clients;
            let arrayLength = clientListForChatRoom.length;

            // send "roomchange" command to the clients in the room to change them to the MainHall
            for (var i = 0; i < arrayLength; i++) {
                let clientArrayIndex = serverClients.findIndex((x) => x == clientListForChatRoom[i]);
                clientListForChatRoom[i].chatRoom = serverChatRooms[0].chatRoomIdentity;
                serverClients[clientArrayIndex] = clientListForChatRoom[i];

                roomChange.identity = clientListForChatRoom[i].clientIdentity;

                // send necessary commands
                clientListForChatRoom[i].socket.write(util.jsonEncode(roomChange));
                util.broadcast(clientListForMainHall, roomChange);

                // move the client to MainHall
                joinClientNewChatRoom(serverChatRooms[0].chatRoomIdentity, clientListForChatRoom[i]);
            }

            // remove chatRoom from serverChatRooms
            let chatRoomArrayIndex = serverChatRooms.findIndex((x) => x == chatRoom);
            serverChatRooms.splice(chatRoomArrayIndex, 1);

            // send deleteRoom approve message to the client
            approveMessage = {
                "type": "deleteroom",
                "roomid": roomId,
                "approved": "true"
            };
            socket.write(util.jsonEncode(approveMessage));

            console.log("room deleted");

        } else {
            approveMessage = {
                "type": "deleteroom",
                "roomid": roomId,
                "approved": "false"
            };
            socket.write(util.jsonEncode(approveMessage));

            console.log("room deleted failed");
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
        if (checkClientIsOwner(client, roomId)) {
            return true;
        }
    } else {
        return false;
    }
}