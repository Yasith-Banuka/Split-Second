const { getLocalChatRoom } = require("../data/serverChatRooms");
const { getClientForSocket } = require("../data/serverClients");
const util = require("../util/util");

/*
Send  

{
	"type" : “heartbeat”,
	"from" : s1,
	"counter" : 1024
}

Receive 

{
	"type" : “heartbeat_ack”,
	"from" : s2,
	"ounter" : 1024
}
After receiving -  Counter++

Failure Duration - 3s

Check 3 times

Then send to leader

Leader_Send

{
	“Type” : “heartbeat_fail”,
	“Fail_serverid” : s2,
}

If the leader failed? Call leader election


*/

module.exports = {
    heartbeat: function (socket) {
        //java -jar client.jar -h server_address [-p server_port] -i identity [-d]

//>cd D:\Aca Sem 08\Distributed Systems\project
    }
}