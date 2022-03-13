const { getChatRoom, serverClients, removeClientFromChatRoom, serverChatRooms, getClientForSocket, checkClientIdentityExist } = require("../chatRoomManager/chatRoomManager");
const util = require("../util/util");
const {isChatroomIdUnique} = require("../data/globalChatRooms");
const {getServerId, getCoordinator}= require("../data/serverDetails");
const {reply} = require("../serverToServer/message");
const {beginElection} = require("../leaderElection");

module.exports = {
    createRoom: function (socket, roomId) {
        let client = getClientForSocket(socket);

        let approveMessage;
        let roomChange = {
            "type": "roomchange",
            "identity": client.clientIdentity,
            "former": client.chatRoom,
            "roomid": roomId
        };
        let previousChatRoom = client.chatRoom;

        if ((!checkClientIsOwner(client)) && checkAvailability(roomId)) {

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
            serverChatRooms.push(newChatRoom);

            approveMessage = { "type": "createroom", "roomid": roomId, "approved": "true" };
            socket.write(util.jsonEncode(approveMessage));
            socket.write(util.jsonEncode(roomChange));
            util.broadcast(getChatRoom(previousChatRoom).clients, roomChange);

            console.log("room created");
        } else {
            approveMessage = { "type": "createroom", "roomid": roomId, "approved": "false" };
            socket.write(util.jsonEncode(approveMessage));

            console.log("room created failed");
        }
    }
}

/*
    if roomId is already exists
        return false
    else 
        return true
*/
function checkAvailability(roomId) {
    // because in js (0==false)-> true
    if (util.checkAlphaNumeric(roomId)) {        
        return getCoordinatorRoomIdApproval(roomId);  
    }
    return false;
};

function getCoordinatorRoomIdApproval(roomId) {
    if(getServerId===getCoordinator) {

        return (!isChatroomIdUnique(roomId));
    }
    roomRequestMsg = {"type" : "roomrequest", "roomid" : roomId, "serverid" : getServerId}
    reply(getCoordinator, roomRequestMsg)
        .then(json => {
            if(json.type === "roomconfirm" && json.roomid === roomId) {
                return json.roomApproved;
            }
            return false;
        })
        .catch(error => beginElection())
};

/*

    if client is an owner
        return true
    else
        reutrn false

*/
function checkClientIsOwner(client) {
    let clientChatRoomId = checkClientIdentityExist(client.clientIdentity).chatRoom;
    let clientChatRoom = getChatRoom(clientChatRoomId);

    return (clientChatRoom.owner == client);

}
