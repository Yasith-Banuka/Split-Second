const { createRoom } = require("./createRoom");
const { deleteRoom } = require("./deleteRoom");
const { joinRoom } = require("./joinRoom/joinRoom");
const { sendlist } = require("./list");
const { message } = require("./message");
const { newidentity } = require("./newIdentity");
const { sendwho } = require("./who");
const { quit } = require("./quit");
const { moveJoin } = require("./joinRoom/moveJoin");

module.exports = {
    clientServer: function (socket, json) {
        switch (json["type"]) {
            case "newidentity":
                newidentity(socket, json["identity"]);
                break;
            case "list":
                sendlist(socket);
                break;
            case "who":
                sendwho(socket);
                break;
            case "createroom":
                createRoom(socket, json["roomid"]);
                break;
            case "joinroom":
                joinRoom(socket, json["roomid"]);
                break;
            case "movejoin":
                moveJoin(socket, json["roomid"], json["former"], json["identity"]);
                break;
            case "deleteroom":
                deleteRoom(socket, json["roomid"]);
                break;
            case "message":
                message(socket, json["content"]);
                break;
            case "quit":
                quit(socket);
                break;
            default:
                console.log(`\nERROR: Message received from client is wrong.\nPlease check and try again\n` + JSON.stringify(json));
        }
    }
}