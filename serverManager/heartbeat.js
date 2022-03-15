const util = require("../util/util");
const {message, broadcast, multicast} = require("./serverMessage")
const {beginElection} = require("./leaderElection")
const {getCoordinator} = require("../data/serverDetails")
/* 

includes heartbeat counter details.
[ 
{
	“serverID” : “s2”,
	“heartbeatCounter” : 1024,
	“timestamp” : xxxx
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

function receiveHeartbeat(identity) {

    let arrayLength = heartbeatCounterList.length;
    for (var i = 0; i < arrayLength; i++) {
        if (heartbeatCounterList[i].serverid == identity) {
            heartbeatCounterList[i].counter = heartbeatCounterList[i].counter + 1;
        }
    }

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
	“type” : “heartbeat_fail”,
	“fail_serverid” : s2,
}
*/

function informFailure(serverid) {
	leaderid = getCoordinator();
	if (serverid==leaderid){
		beginElection();
	}
	else{
		let failureMsg = {type : "heartbeat_fail", fail_serverid : serverid};
		message(leaderid, failureMsg);
	}
    
}

function heartbeat() {
    
}

module.exports = {heartbeat}