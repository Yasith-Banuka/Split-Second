/* 

inculdes client details.
[
    {   
        clientIdentity : // clientIdentity
        socket : // associate socket object of the client
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
        owner : // owner object
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
            returns the array of clients
        else
            returns false

*/
function getClientsChatRoom(chatRoomIdentity) {
    let arrayLength = serverChatRooms.length;
    for (var i = 0; i < arrayLength; i++) {
        if (serverChatRooms[i].chatRoomIdentity == chatRoomIdentity) {
            return serverChatRooms[i].clients;
        }
    }
    return false;
}

module.exports = { serverClients, serverChatRooms, checkClientIdentityExist, getClientsChatRoom }