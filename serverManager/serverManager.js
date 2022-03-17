const {uponReceiveNewClient,uponReceiveNewChatroom,uponReceiveClientDeletion,uponReceiveChatroomDeletion} = require('./broadcastCommunication');
const { handleIdentityRequestMsg, handleRoomRequestMsg } = require('./coordinatorCommunication');
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
                uponReceiveNewClient(json["clientid"]);
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

            case "heartbeat":
                // code block
                break;
            case "suspectfailed":
                // code block
                break;
                
            default:
                console.log(`\nERROR: Message received from server is wrong.\nPlease check and try again\n` + JSON.stringify(json));
        }
    }
}
