const { beginElection } = require("./leaderElection");
const { isCoordinator, isCoordinatorAvailable, getCoordinator } = require('../data/serverDetails');
const { isChatroomIdUsed, addChatroom } = require('../data/globalChatRooms');
const { isClientIdUsed, addClient } = require('../data/globalClients');
const { reply } = require('./serverMessage');
const constants = require('../util/constants');
const { jsonEncode } = require("../util/util");

async function getCoordinatorRoomIdApproval(roomId, serverId) {

    if (!isCoordinatorAvailable) {
        return false;
    }
    if (isCoordinator()) {
        let isRoomApproved = !isChatroomIdUsed(roomId);
        if (isRoomApproved) {
            addChatroom(serverId, roomId);
        }

        return isRoomApproved;
    }
    let roomRequestMsg = { type: "roomrequest", roomid: roomId, serverid: serverId }
    response = await reply(getCoordinator(), roomRequestMsg, constants.T1)
    if (response.type == "serverfailure") {
        beginElection();
        return false;
    }

    if (response.type === "roomconfirm" && response.roomid === roomId) {

        if (response.type === "roomconfirm" && response.roomid === roomId) {
            if (response.roomapproved) {
                addChatroom(serverId, roomId);
            }
            return response.roomapproved;
        }
    }
    return false;
};

async function getCoordinatorIdentityApproval(identity, serverId) {
    if (!isCoordinatorAvailable) {
        return false;
    }
    if (isCoordinator()) {
        let isClientApproved = !isClientIdUsed(identity);
        if (isClientApproved) {
            addClient(serverId, identity);
        }

        return isClientApproved;
    }
    let identityRequestMsg = { type: "clientrequest", clientid: identity, serverid: serverId }
    response = await reply(getCoordinator(), identityRequestMsg, constants.T1)
    if (response.type == "serverfailure") {
        beginElection();
        return false;
    }
    if (response.type === "clientconfirm" && response.clientid === identity) {
        if (response.idapproved) {
            addClient(serverId, identity)
        }
        return response.idapproved;

    }
    return false;
}

async function handleIdentityRequestMsg(socket, message) {
    let approval = await getCoordinatorIdentityApproval(message.clientid, message.serverid);
    let identityApprovalMsg = { type: "clientconfirm", clientid: message.clientid, idapproved: approval };
    socket.write(jsonEncode(identityApprovalMsg));
    socket.destroy();
}

async function handleRoomRequestMsg(socket, message) {
    let approval = await getCoordinatorRoomIdApproval(message.roomid, message.serverid);
    let roomApprovalMsg = { type: "roomconfirm", roomid: message.roomid, roomapproved: approval }
    socket.write(jsonEncode(roomApprovalMsg));
    socket.destroy();
}

module.exports = { getCoordinatorIdentityApproval, getCoordinatorRoomIdApproval, handleIdentityRequestMsg, handleRoomRequestMsg }