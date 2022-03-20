const { serverClients, serverChatRooms, checkClientIdentityExist, getChatRoom, joinClientNewChatRoom } = require("../chatRoomManager/chatRoomManager");
const util = require("../util/util");
const { isClientIdUsed } = require("../data/globalClients");
const { getServerId} = require("../data/serverDetails");
const { getCoordinatorIdentityApproval } = require("../serverManager/coordinatorCommunication");
const { addLocalClient } = require("../data/serverClients");
const { getLocalChatRoom, getMainHallID } = require("../data/serverChatRooms");
const { broadcastNewClient } = require("../serverManager/broadcastCommunication");

module.exports = {
    newidentity: async function (socket, identity) {
        let newIdentityAck;
        let mainHallMoveAck;
        let availabile = await checkAvailability(identity);
        if(availabile) {
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

            // broadcast new client to the other servers
            broadcastNewClient(identity);

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
async function checkAvailability(identity) {
    if (util.checkAlphaNumeric(identity) && (!isClientIdUsed(identity))) {
        return await getCoordinatorIdentityApproval(identity, getServerId())
    }
    return false;
};
    

