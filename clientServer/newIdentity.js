const { serverClients, serverChatRooms, checkClientIdentityExist, getChatRoom, joinClientNewChatRoom } = require("../chatRoomManager/chatRoomManager");
const util = require("../util/util");
const { isClientIdUsed } = require("../data/globalClients");
const { getServerId, getCoordinator } = require("../data/serverDetails");
const { reply } = require("../serverManager/serverMessage");
const { beginElection } = require("../serverManager/leaderElection");
const { getCoordinatorIdentityApproval } = require("../serverManager/coordinatorCommunication");
const { addLocalClient } = require("../data/serverClients");
const { getLocalChatRoom, getMainHallID } = require("../data/serverChatRooms");

module.exports = {
    newidentity: function (socket, identity) {
        let newIdentityAck;
        let mainHallMoveAck;

        if (checkAvailability(identity)) {
            let clientObject = {
                clientIdentity: identity,
                socket: socket,
                chatRoom: getMainHallID()
            };

            // adding the client to the server client list
            addLocalClient(clientObject);

            // adding the client into MainHall
            joinClientNewChatRoom(getMainHallID(), clientObject);

            newIdentityAck = { "type": "newidentity", "approved": "true" };
            mainHallMoveAck = { "type": "roomchange", "identity": identity, "former": "", "roomid": getMainHallID() };

            socket.write(util.jsonEncode(newIdentityAck));
            util.broadcast(getLocalChatRoom(getMainHallID()).clients, mainHallMoveAck);

            console.log('new client added to the server');
        } else {
            newIdentityAck = { "type": "newidentity", "approved": "false" };
            socket.write(util.jsonEncode(newIdentityAck));

            console.log('new client addition failed')
        }
    }

};

/*
    if identity is already exists
        return false
    else 
        return true
*/
function checkAvailability(identity) {
    // because in js (0==false)-> true
    if (util.checkAlphaNumeric(identity)) {
        return getCoordinatorIdentityApproval(identity).idapproved;
    }
    return false;
};

