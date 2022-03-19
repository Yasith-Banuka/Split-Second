var gloablChatrooms = {}; // Store the chatroom id // {'roomId': 's1'}

function isChatroomIdUsed(roomId){
    return gloablChatrooms.hasOwnProperty(roomId); 
}

function addChatroom(serverId, roomId){
    gloablChatrooms[roomId] = serverId;
}
    
function removeChatroom(roomId){
    delete gloablChatrooms[roomId];
}

function getRoomServer(roomId) {
    return gloablChatrooms[roomId];
}

function updateRooms(serverId, roomList) {
    for(let i=0;i<roomList.length;i++) {
        gloablChatrooms[roomList[i]] = serverId;
    }
}

module.exports = {isChatroomIdUsed, addChatroom, removeChatroom, getRoomServer, updateRooms}