const { joinClientNewChatRoom } = require("../../chatRoomManager/chatRoomManager");
const { updateClientServer } = require("../../data/globalClients");
const { getLocalChatRoom, getMainHallID, addLocalChatRoom } = require("../../data/serverChatRooms");
const { addLocalClient } = require("../../data/serverClients");
const { getServerId } = require("../../data/serverDetails");
const { broadcastClientUpdation } = require("../../serverManager/broadcastCommunication");
const util = require("../../util/util");
const { jsonEncode } = require("../../util/util");

module.exports = {
    moveJoin: function (socket, roomId, former, clientIdentity) {

        let getChatRoom = getLocalChatRoom(roomId);

        if (typeof getChatRoom != "boolean") {

            // send serverChange message to the client
            let serverChange = {
                "type": "serverchange",
                "approved": "true",
                "serverid": getServerId()
            }


            socket.write(jsonEncode(serverChange));

            localMoveJoin(socket, roomId, former, clientIdentity);

            //console.log(serverChange);

            // update client server id
            updateClientServer(getServerId(), clientIdentity);

            // broadcast clients move to the new server to other servers
            broadcastClientUpdation(getServerId(), clientIdentity);

            console.log("move join called - client add to the " + roomId);


        } else {

            // move to the MainHall of the server
            localMoveJoin(socket, getMainHallID(), former, clientIdentity);

            console.log("move join called - client add to the " + getMainHallID());

        }



    }
}

// common parts of the moveJoin
function localMoveJoin(socket, roomId, former, clientIdentity) {
    let clientObject = {
        clientIdentity: clientIdentity,
        socket: socket,
        chatRoom: roomId
    };

    let approveMessage = {
        "type": "roomchange",
        "identity": clientIdentity,
        "former": former,
        "roomid": roomId
    };

    // adding the client to the server client list
    addLocalClient(clientObject);

    // adding the client into room
    joinClientNewChatRoom(roomId, clientObject);

    util.broadcast(getLocalChatRoom(roomId).clients, approveMessage);
}