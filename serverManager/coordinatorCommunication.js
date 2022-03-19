const {beginElection} = require("./leaderElection");
const {isCoordinator, isCoordinatorAvailable} = require('../data/serverDetails');
const {isChatroomIdUsed,addChatroom} = require('../data/globalChatRooms');
const {isClientIdUsed, addClient} = require('../data/globalClients');
const {reply} = require('./serverMessage');
const constants = require('../util/constants')

function getCoordinatorRoomIdApproval(roomId, serverId) {
    if (!isCoordinatorAvailable) {
        return false;
    }
    if(isCoordinator) {
        let isRoomApproved = !isChatroomIdUsed(roomId);
        if(isRoomApproved) {
            addChatroom(serverId, roomId);
        }
        
        return isRoomApproved;
    }
    let roomRequestMsg = {type : "roomrequest", roomid : roomId, serverid : serverId}
    reply(getCoordinator(), roomRequestMsg, constants.T1)
        .then(json => {
            if(json.type === "roomconfirm" && json.roomid === roomId) {
                return json.roomapproved;
            }
            return false;
        })
        .catch(error => {
            beginElection();
            return false;
        })
};

function getCoordinatorIdentityApproval(identity, serverId) {
    if (!isCoordinatorAvailable) {
        return false;
    }
    if(isCoordinator) {
        let isClientApproved = !isClientIdUsed(identity);
        if(isClientApproved) {
            addClient(identity);
        }
        
        return isClientApproved;
    }
    let identityRequestMsg = {type : "clientrequest", clientid : identity, serverid : serverId }
    reply(getCoordinator() , identityRequestMsg, constants.T1)
        .then(json => {
            if(json.type === "clientconfirm" && json.clientid === identity) {
                return json.idapproved;
            }
            return false;
        })
        .catch(error => {
            beginElection();
            return false;
        })
};

function handleIdentityRequestMsg(socket, message) {
    let approval = getCoordinatorIdentityApproval(message.clientid, message.serverid);
    let identityApprovalMsg = {type : "clientconfirm", clientid : identity, idapproved : approval};
    socket.write(util.jsonEncode(identityApprovalMsg));
    socket.destroy();
}

function handleRoomRequestMsg(socket, message) {
    let approval = getCoordinatorRoomIdApproval(message.roomid, message.serverid);
    let roomApprovalMsg = {type : "roomconfirm", roomid : roomId, roomapproved : approval}
    socket.write(util.jsonEncode(roomApprovalMsg));
    socket.destroy();
}

module.exports = {getCoordinatorIdentityApproval, getCoordinatorRoomIdApproval, handleIdentityRequestMsg, handleRoomRequestMsg}