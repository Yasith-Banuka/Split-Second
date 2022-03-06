const { serverClients, serverChatRooms } = require("../chatRoomManager/chatRoomManager");
const util = require("../util/util");

module.exports = {
    newidentity: function (socket, identity) {
        let newIdentityAck;
        let mainHallMoveAck;

        if (checkAvailability(identity)) {
            // adding the client to the clients in the server list
            serverClients.push({
                clientIdentity: identity,
                socket: socket
            });

            // adding the client into MainHall
            serverChatRooms[0].identities.push(identity);

            newIdentityAck = { "type": "newidentity", "approved": "true" };
            mainHallMoveAck = { "type": "roomchange", "identity": identity, "former": "", "roomid": serverChatRooms[0].chatRoomIdentity };

            socket.write(util.jsonEncode(newIdentityAck), () => console.log("Client Added Successfully "));
            socket.write(util.jsonEncode(mainHallMoveAck));
        } else {
            newIdentityAck = { "type": "newidentity", "approved": "false" };
            socket.write(util.jsonEncode(newIdentityAck));
        }
    }

}

function checkAvailability(identity) {
    let regEx = new RegExp('^[a-z][a-z0-9]{2,16}$', 'i');
    if (regEx.test(identity)) {
        return true;
    }

    return false;
}
