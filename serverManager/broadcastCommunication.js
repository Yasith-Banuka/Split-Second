const { multicast } = require('./serverMessage');
const { getCoordinator } = require('../data/serverDetails');
const { getAllServerInfo } = require("../data/globalServerDetails");
const { addClient, removeClient } = require('../data/globalClients');
const { addChatroom, removeChatroom } = require('../data/globalChatRooms');



function broadcastNewClient(serverId, clientId) {
    let message = { type: "newclient", clientid: clientId, serverid: serverId };

    let multicastServerIds = getServerIdsExcludingLeader();
    multicast(multicastServerIds, message);
}

function uponReceiveNewClient(serverId, clientId) {
    addClient(serverId, clientId);
}

function broadcastClientDeletion(clientId) {
    let message = { type: "endclient", clientid: clientId };
    let multicastServerIds = getServerIdsExcludingLeader();
    multicast(multicastServerIds, message);
}

function uponReceiveClientDeletion(clientId) {
    removeClient(clientId)
}

function broadcastNewChatroom(serverId, roomId) {
    let message = { type: "newroom", roomid: roomId, serverid: serverId };
    let multicastServerIds = getServerIdsExcludingLeader();
    multicast(multicastServerIds, message);
}

function uponReceiveNewChatroom(serverId, roomId) {
    addChatroom(serverId, roomId)
}

function broadcastChatroomDeletion(roomId) {
    let message = { type: "endroom", roomid: roomId };
    let multicastServerIds = getServerIdsExcludingLeader();
    multicast(multicastServerIds, message);
}

function uponReceiveChatroomDeletion(roomId) {
    removeChatroom(roomId);
}

function getServerIdsExcludingLeader() {
    let coordinatorId = getCoordinator();
    let allServersInfo = getAllServerInfo();

    let serverIdsExcludingLeader = [];
    for (var i = 0; i < allServersInfo.length; i++) {
        if (allServersInfo[i]["serverId"] != coordinatorId) {
            serverIdsExcludingLeader.push(allServersInfo[i]["serverId"]);
        }
    }

    return serverIdsExcludingLeader;
}

module.exports = {
    broadcastNewClient,
    uponReceiveNewClient,
    broadcastClientDeletion,
    uponReceiveClientDeletion,
    broadcastNewChatroom,
    uponReceiveNewChatroom,
    broadcastChatroomDeletion,
    uponReceiveChatroomDeletion
}