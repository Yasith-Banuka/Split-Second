const { serverClients, serverChatRooms, checkClientIdentityExist, getChatRoom } = require("../chatRoomManager/chatRoomManager");
const util = require("../util/util");

module.exports = {
    newidentity: function (socket, identity) {
        let newIdentityAck;
        let mainHallMoveAck;

        if (checkAvailability(identity)) {
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
            util.broadcast(getChatRoom(serverChatRooms[0].chatRoomIdentity).clients, mainHallMoveAck);

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
async function checkAvailability(identity) {
    // because in js (0==false)-> true
    if (util.checkAlphaNumeric(identity) && (typeof checkClientIdentityExist(identity) == "boolean")) {
        //if not coordinator
        let coordinatorApproved = await getCoordinatorIdentityApproval(identity);
        if (coordinatorApproved) {
            return true;
        }        
    }
    return false;
}
