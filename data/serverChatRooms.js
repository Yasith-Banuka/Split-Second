const { getServerId } = require("./serverDetails");

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

function getMainHallID() {
    return "MainHall-" + getServerId();
}


// add a client object to the serverClients list
function addLocalChatRoom(chatRoomObject) {
    serverChatRooms.push(chatRoomObject);
}

/*

    get identities of the chatRoom 
        if chatRoom exists
            returns the chatRoomObject
        else
            returns false

*/
function getLocalChatRoom(chatRoomIdentity) {

    if (chatRoomIdentity == getMainHallID()) {
        return serverChatRooms[0];
    } else {
        let arrayLength = serverChatRooms.length;
        for (var i = 0; i < arrayLength; i++) {
            if (serverChatRooms[i].chatRoomIdentity == chatRoomIdentity) {
                return serverChatRooms[i];
            }
        }
    }
    return false;
}

/*

    return all server chat rooms 

*/
function getLocalChatRooms() {
    return serverChatRooms.map(chatroom => chatroom.chatRoomIdentity);
}

module.exports = { serverChatRooms, getMainHallID, addLocalChatRoom, getLocalChatRoom, getLocalChatRooms }