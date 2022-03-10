const util = require("../util/util");
const {getSocketsForServers, getAllSockets} = require("../serverManager/serverManager")

module.exports = {
    message: function (serverId, message) {
        let socket = getSocketsForServers(serverId);
        socket.write(util.jsonEncode(message));
    },

    broadcast: function(message) {
        let sockets = getAllSockets();
        for (let i=0;i<sockets.length;i++) {
            sockets[i].write(util.jsonEncode(message));
        }
     },

    multicast: function(serverIds, message) {
        let sockets = getSocketsForServers(serverIds);
        for (let i=0;i<sockets.length;i++) {
            sockets[i].write(util.jsonEncode(message));
        }
    }   
}