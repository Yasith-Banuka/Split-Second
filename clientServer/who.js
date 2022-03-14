const { getLocalChatRoom } = require("../data/serverChatRooms");
const { getClientForSocket } = require("../data/serverClients");
const util = require("../util/util");

module.exports = {
    sendwho: function (socket) {

        let room = getClientForSocket(socket).chatRoom;
        let roomDetails = getLocalChatRoom(room);
        let clients = roomDetails.clients;
        let owner = (roomDetails.owner == null) ? "" : roomDetails.owner.clientIdentity;
        let whoReply;
        whoReply = {
            "type": "roomcontents",
            "roomid": room,
            "identities": getClientIdentities(clients),
            "owner": owner
        };

        socket.write(util.jsonEncode(whoReply));
    }
}

/*

    return the list of client identites of given client list

*/
function getClientIdentities(clients) {
    let arrayLength = clients.length;
    let clientIdentites = [];
    for (var i = 0; i < arrayLength; i++) {
        clientIdentites.push(clients[i].clientIdentity);
    }
    return clientIdentites;
}