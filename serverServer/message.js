const util = require("../util/util");
const {getSocketForServer} = require("../serverManager/serverManager")

module.exports = {
    message: function (serverId, message) {
        let socket = getSocketForServer(serverId);
        socket.write(util.jsonEncode(message));
    }
}