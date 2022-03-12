const { serverClients, serverChatRooms, checkClientIdentityExist, getChatRoom } = require("../chatRoomManager/chatRoomManager");
const util = require("../util/util");
const {isClientIdUnique} = require("../data/globalClients");
const {getServerId, getCoordinator}= require("../data/serverDetails");
const {reply} = require("../serverToServer/message");
const {beginElection} = require("../leaderElection");
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
        return getCoordinatorIdentityApproval(identity);  
    }
    return false;
};

function getCoordinatorIdentityApproval(identity) {
    if(getServerId===getCoordinator) {

        return (!isClientIdUnique(identity));
    }
    identityRequestMsg = {"type" : "clientrequest", "clientid" : identity, "serverid" : getServerId}
    reply(getCoordinator, identityRequestMsg)
        .then(json => {
            if(json.clientid === identity) {
                return json.idApproved;
            }
            return false;
        })
        .catch(error => beginElection())
};