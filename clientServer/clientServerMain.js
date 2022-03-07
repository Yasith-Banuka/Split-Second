const { createRoom } = require("./createRoom");
const { deleteRoom } = require("./deleteRoom");
const { joinRoom } = require("./joinRoom/joinRoom");
const { message } = require("./message");
const { newidentity } = require("./newIdentity");

module.exports = {
    clientServer: function (socket, json) {
        switch (json["type"]) {
            case "newidentity":
                newidentity(socket, json["identity"]);
                break;
            case "list":
                // code block
                break;
            case "who":
                // code block
                break;
            case "createroom":
                createRoom(socket, json["roomid"]);
                break;
            case "joinroom":
                joinRoom(socket, json["roomid"]);
                break;
            case "deleteroom":
                deleteRoom(socket, json["roomid"]);
                break;
            case "message":
                message(socket, json["content"]);
                break;
            case "quit":
                // code block
                break;
            default:
                console.log(`\nERROR: Message received from client is wrong.\nPlease check and try again\n` + JSON.stringify(json));
        }
    }
}