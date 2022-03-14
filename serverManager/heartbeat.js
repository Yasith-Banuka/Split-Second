const util = require("../util/util");


/* 

includes heartbeat counter details.
[ 
{
	“serverID” : “s2”,
	“heartbeatCounter” : 1024,
	“Timestamp” : xxxx
},...
]


*/
var heartbeatCounterList = [];

/*
{
	"type" : “heartbeat_ack”,
	"from" : s2,
	"counter" : 1024
}
*/

//increase counter after receiving 

function receiveHeartbeat() {
    
}

/*
{
	"type" : “heartbeat”,
	"from" : s1,
	"counter" : 1024
}
*/

function sendHeartbeat() {
    
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