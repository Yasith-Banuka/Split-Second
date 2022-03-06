const util = require("../util/util");

module.exports = {
    quit: function (socket) {
        socket.sendEndMessage();
    }

}