const {beginElection} = require("./leaderElection");
const {isCoordinator, isCoordinatorAvailable, getCoordinator} = require('../data/serverDetails');
const {isChatroomIdUsed,addChatroom} = require('../data/globalChatRooms');
const {isClientIdUsed, addClient} = require('../data/globalClients');
const {reply} = require('./serverMessage');
const constants = require('../util/constants');
const { jsonEncode } = require("../util/util");

function getCoordinatorRoomIdApproval(roomId, serverId) {

    if (!isCoordinatorAvailable) {
        return false;
    }
    if(isCoordinator()) {
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

async function getCoordinatorIdentityApproval(identity, serverId) {
    if (!isCoordinatorAvailable) {
        return false;
    }
    if(isCoordinator()) {
        let isClientApproved = !isClientIdUsed(identity);
        if(isClientApproved) {
            addClient(serverId, identity);
        }
        
        return isClientApproved;
    }
    let identityRequestMsg = {type : "clientrequest", clientid : identity, serverid : serverId }
    try {
        response = await reply(getCoordinator() , identityRequestMsg, constants.T1)
    } catch (e) {
        beginElection();
        return false;
    }
    if(response.type === "clientconfirm" && response.clientid === identity) {
        return response.idapproved;
    }
    return false;
}

async function handleIdentityRequestMsg(socket, message) {
    let approval = await getCoordinatorIdentityApproval(message.clientid, message.serverid);
    let identityApprovalMsg = {type : "clientconfirm", clientid : message.clientid, idapproved : approval};
    socket.write(jsonEncode(identityApprovalMsg));
    socket.destroy();
}

function handleRoomRequestMsg(socket, message) {
    let approval = getCoordinatorRoomIdApproval(message.roomid, message.serverid);
    let roomApprovalMsg = {type : "roomconfirm", roomid : message.roomid, roomapproved : approval}
    socket.write(jsonEncode(roomApprovalMsg));
    socket.destroy();
}

module.exports = {getCoordinatorIdentityApproval, getCoordinatorRoomIdApproval, handleIdentityRequestMsg, handleRoomRequestMsg}