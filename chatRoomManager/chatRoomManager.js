const { serverChatRooms, getLocalChatRoom, getMainHallID } = require("../data/serverChatRooms");

/*

    remove given client from the chatRoom

*/
function removeClientFromChatRoom(chatRoomIdentity, client) {
    let chatRoom = getLocalChatRoom(chatRoomIdentity);
    let chatRoomArrayIndex = serverChatRooms.findIndex((x) => x == chatRoom);

    console.log(client);
    console.log(chatRoom);

    let clientList = chatRoom.clients;
    let clientArrayIndex = clientList.findIndex((x) => x == client);
    clientList.splice(clientArrayIndex, 1);

    chatRoom.clients = clientList;
    serverChatRooms[chatRoomArrayIndex] = chatRoom;
}

/*

    join a client to the chatroom

*/
function joinClientNewChatRoom(chatRoomIdentity, client) {
    
    console.log("Inside joint chatromm (roomid, client) : " , chatRoomIdentity, client);
    if (chatRoomIdentity == getMainHallID()) {
        serverChatRooms[0].clients.push(client);
    } else {
        let chatRoom = getLocalChatRoom(chatRoomIdentity);
        let chatRoomArrayIndex = serverChatRooms.findIndex((x) => x == chatRoom);
        chatRoom.clients.push(client);

        serverChatRooms[chatRoomArrayIndex] = chatRoom;
    }
}

module.exports = { removeClientFromChatRoom, joinClientNewChatRoom }
