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
            returns the array index of the client
        else
            returns false

*/
function checkClientIdentityExist(identity) {
    let arrayLength = serverClients.length;
    for (var i = 0; i < arrayLength; i++) {
        if (serverClients[i].clientIdentity == identity) {
            return i;
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

    delete client from a chat room 

*/
function deleteClient(chatRoomIdentity) {
    let arrayLength = serverChatRooms.length;
    for (var i = 0; i < arrayLength; i++) {
        if (serverChatRooms[i].chatRoomIdentity == chatRoomIdentity) {
            serverChatRooms.splice(i);
        }
    }
    return false;
}

module.exports = { serverClients, serverChatRooms, checkClientIdentityExist, getChatRoom, getClientForSocket, deleteClient }
