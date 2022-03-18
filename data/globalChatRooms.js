
var serverChatrooms = {}; // Store the chatroom id // {'roomId': 'serverID'} 

function isChatroomIdUsed(roomId) {
    return serverChatrooms.hasOwnProperty(roomId);
}

function addChatroom(serverId, roomId) {
    serverChatrooms[roomId] = serverId;
}

function removeChatroom(roomId) {
    delete serverChatrooms[roomId];
}

function getRoomServer(roomId) {
    return serverChatrooms[roomId];
}

function updateRooms(serverId, roomList) {
    for (let i = 0; i < roomList.length; i++) {
        serverChatrooms[roomList[i]] = serverId;
    }
}

/*

    return the list of chat rooms for a server

*/
function getChatRoomOfServer(serverId) {
    let chatRooms = [];

    for (var roomId in serverChatrooms) {
        if (getRoomServer(roomId) == serverId) {
            chatRooms.push(roomId);
        }
    }

    return chatRooms;
}

module.exports = { isChatroomIdUsed, addChatroom, removeChatroom, getRoomServer, updateRooms, getChatRoomOfServer }