/* 

inculdes client details.
[
    {   
        clientIdentity : // clientIdentity
        socket : // associate socket object of the client
        chatRoom: // chat room of the client
    },
    ....
]

*/
var serverClients = [];

/* 

inculdes chat rooms details inculded in the server
[
    {   
        chatRoomIdentity: // chatRoomIdentity
        owner : // owner(client) object
        clients : [objects of clients - same as the object in the serverClients]     
    },
    ....
]

-- IMPORTANT!! --

* ALWAYS KEEP THE MAINHALL AS THE FIRST ELEMENT : serverChatRooms[0] = MainHall

* serverChatRooms CANNOT BE EMPTY

*/
var serverChatRooms = [];

/*

    check if the client identity already exists and 
        if do
            returns the client
        else
            returns false

*/
function checkClientIdentityExist(identity) {
    let arrayLength = serverClients.length;
    for (var i = 0; i < arrayLength; i++) {
        if (serverClients[i].clientIdentity == identity) {
            return serverClients[i];
        }
    }
    return false;
}

/*

    get identities of the chatRoom 
        if chatRoom exists
            returns the chatRoomObject
        else
            returns false

*/
function getChatRoom(chatRoomIdentity) {
    let arrayLength = serverChatRooms.length;
    for (var i = 0; i < arrayLength; i++) {
        if (serverChatRooms[i].chatRoomIdentity == chatRoomIdentity) {
            return serverChatRooms[i];
        }
    }
    return false;
}

/*

    return the client details for the given socket

*/
function getClientForSocket(socket) {
    let arrayLength = serverClients.length;
    for (var i = 0; i < arrayLength; i++) {
        if (serverClients[i].socket == socket) {
            return serverClients[i];
        }
    }
    return false;
}

/*

    remove given client from the chatRoom

*/
function removeClientFromChatRoom(chatRoomIdentity, client) {
    let chatRoom = getChatRoom(chatRoomIdentity);
    let chatRoomArrayIndex = serverChatRooms.findIndex((x) => x == chatRoom);

    let clientList = chatRoom.clients;
    let clientArrayIndex = clientList.findIndex((x) => x == client);
    clientList.splice(clientArrayIndex, 1);

    chatRoom.clients = clientList;
    serverChatRooms[chatRoomArrayIndex] = chatRoom;
}

/*

    remove given client from the server

*/
function removeClientFromServer(client) {
    
    let clientArrayIndex = serverClients.findIndex((x) => x == client);
    
    serverClients.splice(clientArrayIndex, 1);

}

/*

    join a client to the chatroom

*/
function joinClientNewChatRoom(chatRoomIdentity, client) {
    let chatRoom = getChatRoom(chatRoomIdentity);
    let chatRoomArrayIndex = serverChatRooms.findIndex((x) => x == chatRoom);
    chatRoom.clients.push(client);

    serverChatRooms[chatRoomArrayIndex] = chatRoom;
}

/*

    return all server chat rooms 

*/
function getChatRooms() {
    let arrayLength = serverChatRooms.length;
    let chatRooms = [];
    for (var i = 0; i < arrayLength; i++) {
        chatRooms.push(serverChatRooms.chatRoomIdentity);
    }
    return chatRooms;
}

module.exports = { serverClients, serverChatRooms, checkClientIdentityExist, getChatRoom, getClientForSocket, removeClientFromChatRoom, getChatRooms, joinClientNewChatRoom, removeClientFromServer }
