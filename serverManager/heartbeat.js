const { getLocalChatRoom } = require("../data/serverChatRooms");
const { getClientForSocket } = require("../data/serverClients");
const util = require("../util/util");


/* 

includes client details.
[
    {   
        clientIdentity : // clientIdentity
        socket : // associate socket object of the client
        chatRoom: // chat room of the client
    },
    ....
]

*/
var variable1 = [];

/*
{
	"type" : “heartbeat_ack”,
	"from" : s2,
	"counter" : 1024
}
*/

//increase counter after receiving 

function receiveAnswer() {
    
}

/*
{
	"type" : “heartbeat”,
	"from" : s1,
	"counter" : 1024
}
*/

function sendAnswer() {
    
}

//inform leader about failure
//if failed server is the leader, call leader election

/*

{
	“Type” : “heartbeat_fail”,
	“Fail_serverid” : s2,
}
*/

function informFailure() {
    
}

function heartbeat() {
    
}

module.exports = {heartbeat}