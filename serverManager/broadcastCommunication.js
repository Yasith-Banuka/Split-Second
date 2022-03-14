const {broadcast} = require('./serverMessage');
const {addClient, removeClient} = require('../data/globalClients');
const {addChatroom, removeChatroom} = require('../data/globalChatRooms');


function broadcastNewClient (clientId){}
    let message = {type : "newclient", clientid : clientId};
    broadcast(message);


function uponReceiveNewClient (clientId) {
    addClient(clientId);
}

function broadcastClientDeletion () {
    let message = {type : "endclient", clientid : clientId};
    broadcast(message);
}

function uponReceiveClientDeletion (clientId) {
    removeClient(clientId)
}

function broadcastNewChatroom (serverId, roomId){
    let message = {type : "newroom", roomid : roomId, serverid: serverId};
    broadcast(message);
}

function uponReceiveNewChatroom (serverId, roomId) {
    addChatroom(serverId, roomId)
}

function broadcastChatroomDeletion (roomId) {
    let message = {type : "endroom", roomid : roomId};
    broadcast(message);
}

function uponReceiveChatroomDeletion (roomId) {
    removeChatroom(roomId);
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