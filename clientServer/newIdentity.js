const { serverClients, serverChatRooms } = require("../chatRoomManager/chatRoomManager");
const util = require("../util/util");

module.exports = {
    newidentity: function (socket, identity) {
        let newIdentityAck;
        let mainHallMoveAck;
        let buf = util.jsonEncode(obj);
        console.log(socket.remotePort);

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

            socket.write(JSON.stringify(obj) + "\n", () => console.log("Completed"));
            socket.write(JSON.stringify(obj1) + "\n");
        } else {
            obj = { "type": "newidentity", "approved": "false" };
            buf = util.jsonEncode(obj);
            socket.sendMessage(buf);
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
