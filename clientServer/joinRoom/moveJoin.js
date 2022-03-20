const { getLocalChatRoom, getMainHallID } = require("../../data/serverChatRooms");
const { jsonEncode } = require("../../util/util");

module.exports = {
    moveJoin: function (socket, roomId, former, clientIdentity) {

        let getChatRoom = getLocalChatRoom(roomId);

        if (typeof getChatRoom != "boolean") {

            localMoveJoin(socket, roomId, former, clientIdentity);

            // send serverChange message to the client
            let serverChange = {
                "type": "serverchange",
                "approved": "true",
                "serverid": "s2"
            };

            socket.write(jsonEncode(serverChange));

            // update client server id
            // todo: update client's server id

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