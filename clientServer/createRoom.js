const util = require("../util/util");
const { isChatroomIdUsed, addChatroom } = require("../data/globalChatRooms");
const { getServerId } = require("../data/serverDetails");

const { getCoordinatorRoomIdApproval } = require("../serverManager/coordinatorCommunication");
const { getClientForSocket, checkClientIdentityExist, serverClients } = require("../data/serverClients");
const { removeClientFromChatRoom } = require("../chatRoomManager/chatRoomManager");
const { getLocalChatRoom, addLocalChatRoom } = require("../data/serverChatRooms");
const { broadcastNewChatroom } = require("../serverManager/broadcastCommunication");
module.exports = {
    createRoom: async function (socket, roomId) {
        let client = getClientForSocket(socket);

        let approveMessage;
        let roomChange = {
            "type": "roomchange",
            "identity": client.clientIdentity,
            "former": client.chatRoom,
            "roomid": roomId
        };
        let previousChatRoom = client.chatRoom;
        let available = await checkAvailability(roomId);
        if ((!checkClientIsOwner(client)) && available) {

            // remove client from previous chatRoom
            removeClientFromChatRoom(previousChatRoom, client);

            // change the clients chatRoom id in the serverClients list
            let clientArrayIndex = serverClients.findIndex((x) => x == client);
            client.chatRoom = roomId;
            serverClients[clientArrayIndex] = client;

            // create new chatRoom
            let newChatRoom = {
                chatRoomIdentity: roomId,
                owner: client,
                clients: [client]
            }
            addLocalChatRoom(newChatRoom);
            addChatroom(getServerId(), roomId);

            approveMessage = { "type": "createroom", "roomid": roomId, "approved": "true" };
            socket.write(util.jsonEncode(approveMessage));
            socket.write(util.jsonEncode(roomChange));
            util.broadcast(getLocalChatRoom(previousChatRoom).clients, roomChange);

            // broadcast new chatroom to the other servers
            broadcastNewChatroom(getServerId(), roomId);

            console.log(roomId," chatroom created");
        } else {
            approveMessage = { "type": "createroom", "roomid": roomId, "approved": "false" };
            socket.write(util.jsonEncode(approveMessage));

            console.log(roomId,"chatroom created failed");
        }
    }
}

/*
    if roomId is already exists
        return false
    else 
        return true
*/
async function checkAvailability(roomId) {

    if (util.checkAlphaNumeric(roomId) && (!(isChatroomIdUsed(roomId)))) {
        return await getCoordinatorRoomIdApproval(roomId, getServerId());
    }
    return false;
};



/*

    if client is an owner
        return true
    else
        reutrn false

*/
function checkClientIsOwner(client) {
    let clientChatRoomId = checkClientIdentityExist(client.clientIdentity).chatRoom;
    let clientChatRoom = getLocalChatRoom(clientChatRoomId);

    return (clientChatRoom.owner == client);

}
