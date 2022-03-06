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
        owner : // owner's client ID
        identities : [clients in the chat room]     
    },
    ....
]

-- IMPORTANT!! --

* ALWAYS KEEP THE MAINHALL AS THE FIRST ELEMENT : serverChatRooms[0] = MainHall

* serverChatRooms CANNOT BE EMPTY

*/
var serverChatRooms = [];

module.exports = { serverClients, serverChatRooms }