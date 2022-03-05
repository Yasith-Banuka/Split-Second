/* 

inculdes client details.
[
    clientIdentity : {
        socket : // associate socket object of the client
    },
    ....
]

*/
var serverClients = [];

/* 

inculdes chat rooms details inculded in the server
[
    chatRoomIdentity : {
        owner : // owner's client ID
        identities : [clients in the chat room]     
    },
    ....
]

*/
var serverChatRooms = [];

module.exports = { serverClients, serverChatRooms }