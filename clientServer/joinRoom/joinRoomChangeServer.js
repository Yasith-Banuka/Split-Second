const { getRoomServer } = require("../../data/globalChatRooms")
const { getServerInfo } = require("../../data/globalServerDetails");
const { removeClientFromServer } = require("../../data/serverClients");
const { jsonEncode } = require("../../util/util");

module.exports = {
    joinRoomChangeServer: function (socket, roomId, client) {
        let changeServerInfo = getServerInfo(getRoomServer(roomId));

        let routeMessage = {
            "type": "route",
            "roomid": roomId,
            "host": changeServerInfo["address"],
            "port": changeServerInfo["clientPort"]
        }

        socket.write(jsonEncode(routeMessage));

        removeClientFromServer(client);

        console.log("joinRoomChangeServer called");

    }
}