const { serverClients, serverChatRooms, checkClientIdentityExist, getClientsChatRoom } = require("../chatRoomManager/chatRoomManager");
const util = require("../util/util");

module.exports = {
    newidentity: function (socket, identity) {
        let newIdentityAck;
        let mainHallMoveAck;

        if (checkAvailability(identity)) {
            // adding the client to the clients in the server list

            let clientObject = {
                clientIdentity: identity,
                socket: socket,
                chatRoom: serverChatRooms[0].chatRoomIdentity
            };

            // adding the client to the server client list
            serverClients.push(clientObject);

            // adding the client into MainHall
            serverChatRooms[0].clients.push(clientObject);

            newIdentityAck = { "type": "newidentity", "approved": "true" };
            mainHallMoveAck = { "type": "roomchange", "identity": identity, "former": "", "roomid": serverChatRooms[0].chatRoomIdentity };

            socket.write(util.jsonEncode(newIdentityAck));
            util.broadcast(getClientsChatRoom(serverChatRooms[0].chatRoomIdentity), mainHallMoveAck);

            console.log('new client added to the server');
        } else {
            newIdentityAck = { "type": "newidentity", "approved": "false" };
            socket.write(util.jsonEncode(newIdentityAck));

            console.log('new client addition failed')
        }
    }

}

/*
    if identity is already exists
        return false
    else 
        return true
*/
function checkAvailability(identity) {
    let regEx = new RegExp('^[a-z][a-z0-9]{2,16}$', 'i');

    // because in js (0==false)-> true
    if ((regEx.test(identity)) && (typeof checkClientIdentityExist(identity) == "boolean")) {
        return true;
    }
    return false;
}
