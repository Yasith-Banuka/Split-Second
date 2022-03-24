const { uponReceiveNewClient, uponReceiveNewChatroom, uponReceiveClientDeletion, uponReceiveChatroomDeletion, uponReceiveClientUpdation } = require('./broadcastCommunication');
const { handleIdentityRequestMsg, handleRoomRequestMsg } = require('./coordinatorCommunication');
const { receiveHeartbeat, receiveHeartbeatAck, informFailure, leaderActionForFailedServer, serverActionForFailedServer } = require('./heartbeat');
const { bullyManager } = require('./leaderElection');

module.exports = {
    serverManager: function (socket, json) {
        switch (json["type"]) {

            case "clientrequest":
                handleIdentityRequestMsg(socket, json);
                break;

            case "roomrequest":
                handleRoomRequestMsg(socket, json);
                break;

            case "newclient":
                uponReceiveNewClient(json["serverid"], json["clientid"]);
                break;

            case "updateclient":
                uponReceiveClientUpdation(json["newServerid"], json["clientid"]);
                break;

            case "endclient":
                uponReceiveClientDeletion(json["clientid"]);
                break;

            case "newroom":
                uponReceiveNewChatroom(json["serverid"], json["roomid"])
                break;

            case "endroom":
                uponReceiveChatroomDeletion(json["roomid"]);
                break;

            case "joinroom":
                // code block
                break;

            case "bully":
                bullyManager(json);
                break;

            // hearbeat protocol functionality

            case "heartbeat":
                receiveHeartbeat(json["from"], json["counter"]);
                break;

            case "heartbeat_ack":
                receiveHeartbeatAck(json["from"], json["counter"]);
                break;

            case "heartbeat_fail":
                leaderActionForFailedServer(json["fail_serverid"]);
                break;

            case "heartbeat_fail_broadcast":
                serverActionForFailedServer(json["fail_serverid"]);
                break;

            default:
                console.log(`\nERROR: Message received from server is wrong.\nPlease check and try again\n` + JSON.stringify(json));
        }
    }
}