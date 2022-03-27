const { removeClientFromChatRoom, joinClientNewChatRoom } = require("../chatRoomManager/chatRoomManager");
const { removeClient } = require("../data/globalClients");
const { getLocalChatRoom, serverChatRooms } = require("../data/serverChatRooms");
const { getClientForSocket, removeClientFromServer, serverClients } = require("../data/serverClients");
const { broadcastClientDeletion } = require("../serverManager/broadcastCommunication");
const util = require("../util/util");
const { removeChatroom } = require("../data/globalChatRooms");
const { broadcastChatroomDeletion } = require("../serverManager/broadcastCommunication");

module.exports = {
    quit: function (socket) {

        let client = getClientForSocket(socket);
        let room = client.chatRoom;
        let roomDetails = getLocalChatRoom(room);
        let owner = (roomDetails.owner == null) ? "" : roomDetails.owner.clientIdentity;
        let clientList = roomDetails.clients

        //send room change msg with null string as new room
        quitReply = {
            "type": "roomchange",
            "identity": client.clientIdentity,
            "former": room,
            "roomid": ""
        };

        socket.write(util.jsonEncode(quitReply));

        removeClientFromChatRoom(room, client);
        removeClientFromServer(client);
        removeClient(client.clientIdentity)

        util.broadcast(clientList, quitReply);


        if (client.clientIdentity == owner) {

            let roomChange = {
                "type": "roomchange",
                "identity": "",
                "former": room,
                "roomid": serverChatRooms[0].chatRoomIdentity
            };

            //get new client list without the owner
            let chatRoom = getLocalChatRoom(room);
            let clientListForChatRoom = chatRoom.clients;
            let clientListForMainHall = serverChatRooms[0].clients;
            let arrayLength = clientListForChatRoom.length;

            // send "roomchange" command to the clients in the room to change them to the MainHall
            for (var i = 0; i < arrayLength; i++) {
                let clientArrayIndex = serverClients.findIndex((x) => x == clientListForChatRoom[i]);
                clientListForChatRoom[i].chatRoom = serverChatRooms[0].chatRoomIdentity;
                serverClients[clientArrayIndex] = clientListForChatRoom[i];

                roomChange.identity = clientListForChatRoom[i].clientIdentity;

                // send necessary commands
                clientListForChatRoom[i].socket.write(util.jsonEncode(roomChange));
                util.broadcast(clientListForMainHall, roomChange);

                // move the client to MainHall
                joinClientNewChatRoom(serverChatRooms[0].chatRoomIdentity, clientListForChatRoom[i]);
//                 clientListForMainHall.push(clientListForChatRoom[i]);
            }

            //delete room
            // remove chatRoom from serverChatRooms
            let chatRoomArrayIndex = serverChatRooms.findIndex((x) => x == chatRoom);
            serverChatRooms.splice(chatRoomArrayIndex, 1);

            // send deleteRoom approve message to the client
            approveMessage = {
                "type": "deleteroom",
                "roomid": room,
                "approved": "true"
            };
            socket.write(util.jsonEncode(approveMessage));

            // broadcast deletion of chatroom to the other servers
            removeChatroom(room);
            broadcastChatroomDeletion(room);

            console.log(room, " chatroom deleted");

        }

        socket.destroy();

        // broadcast client deletion to the other servers
        broadcastClientDeletion(client.clientIdentity);

        console.log(client.clientIdentity, " removed")
    }
}
