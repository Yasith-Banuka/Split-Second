const { getServerId } = require("../data/serverDetails");
const util = require("../util/util");
const { unicast, broadcast } = require("./serverMessage");
const { beginElection } = require("./leaderElection")
const { getCoordinator } = require("../data/serverDetails");
const { getServerInfo, markFailedServer, getAllServerInfo } = require("../data/globalServerDetails");
const { getChatRoomOfServer, removeChatroom } = require("../data/globalChatRooms");
const { removeAllClientsOfAServer } = require("../data/globalClients");

/* 

includes heartbeat counter details.

[ 

{
	“serverId” : “s2”,
	“heartbeatCounter” : 1024,
	“failedCounter” : 0
},...

]

*/
var heartbeatCounterList = [];

/* 

includes received heartbeat counter details.

*/

var heartbeatReceiveCounterList = [];

/*

	Initalize heartbeatCounter lists

*/

function initHeartbeat() {
	let globalServerList = getAllServerInfo();
	let arrayLength = globalServerList.length;

	for (var i = 0; i < arrayLength; i++) {
		if (globalServerList[i]["active"] == true) {
			let heartbeatCounterObject = {
				"serverId": globalServerList[i]["serverId"],
				"heartbeatCounter": 0,
				"failedCounter": 0
			}

			let heartbeatRecieveCounterObject = {
				"serverId": globalServerList[i]["serverId"],
				"heartbeatCounter": 0,
			}
			heartbeatCounterList.push(heartbeatCounterObject);
			heartbeatReceiveCounterList.push(heartbeatRecieveCounterObject);
		}
	}
}

// add given heartbeatCounterObject to the heartbeatCounterList and heartbeatCounterRecievedList
function addHearbeatCounterObject(heartbeatCounterObject) {
	heartbeatCounterList.push(heartbeatCounterObject);
	heartbeatReceiveCounterList.push(heartbeatCounterObject);
}

/*

	if heartbeatCounterObject exsists
		remove the object from the heartbeatCounterList and heartbeatCounterRecievedList
	else	
		return false

*/
function removeHeartbeatCounterObject(heartbeatCounterObject) {
	let arraySize = heartbeatCounterList.length;
	for (let i = 0; i < arraySize; i++) {
		if (heartbeatCounterList[i]["serverId"] == heartbeatCounterObject["serverId"]) {
			heartbeatCounterListIndex = i;
		}
		return false
	}

	heartbeatCounterList.splice(heartbeatCounterListIndex, 1);
	heartbeatReceiveCounterList.splice(heartbeatCounterListIndex, 1);
}

/*

	if serverId exists
		return heartbeatCounterObject
	else
		return false

*/
function getHearbeatCounterObjectForServerId(serverId) {
	let arraySize = heartbeatCounterList.length;
	for (let i = 0; i < arraySize; i++) {
		if (heartbeatCounterList[i]["serverId"] == serverId) {
			return heartbeatCounterList[i];
		}
		return false
	}

}

/*
{
	"type" : “heartbeat_ack”,
	"from" : s2,
	"counter" : 1024
}
*/

//increase heartbeatReceive counter after receiving heartbeat and send ack message

function receiveHeartbeat(identity, receivedCounter) {

	let arrayLength = heartbeatReceiveCounterList.length;
	let currentCounter;
	let fromServerIndex;
	for (var i = 0; i < arrayLength; i++) {
		if (heartbeatReceiveCounterList[i]["serverId"] == identity) {
			currentCounter = heartbeatReceiveCounterList[i].counter;
			fromServerIndex = i;
			break
		}
	}

	if (receivedCounter > currentCounter) {


		heartbeatReceiveCounterList[fromServerIndex].counter = heartbeatReceiveCounterList[fromServerIndex].counter + 1;

		let heartbeatAckMessage = {
			"type": "heartbeat_ack",
			"from": getServerId(),
			"counter": heartbeatCounterObject[heartbeatCounter]++
		};

		// sernd the heartbeat message to the particular server
		unicast(identity, heartbeatAckMessage);
	}

}

//increase heartbeat counter after receiving heartbeat ack message

function receiveHeartbeatAck(identity) {

	let arrayLength = heartbeatCounterList.length;

	for (var i = 0; i < arrayLength; i++) {
		if (heartbeatCounterList[i]["serverId"] == identity) {
			heartbeatCounterList[i].counter = heartbeatCounterList[i].counter + 1;
		}
	}

}

/*

Send heartbeat message to the given serverId
{
	"type" : “heartbeat”,
	"from" : s1,
	"counter" : 1024
}

*/

function sendHeartbeat(heartbeatCounterObject) {
	let heartbeatMessage = {
		"type": "heartbeat",
		"from": getServerId(),
		"counter": heartbeatCounterObject["heartbeatCounter"]++
	};

	// sernd the heartbeat unicast to the particular server
	unicast(heartbeatCounterObject["serverId"], heartbeatMessage);
}

//inform leader about failure
//if failed server is the leader, call leader election

/*

	inform the leader about the failed server

	{
		“type” : “heartbeat_fail”,
		“fail_serverid” : s2,
	}
*/
function informFailure(serverid) {
	leaderid = getCoordinator();
	if (serverid == leaderid) {
		beginElection();
	}
	else {
		let failureMsg = {
			"type": "heartbeat_fail",
			"fail_serverid": serverid
		};
		unicast(leaderid, failureMsg);
	}
}

/*

	general server action for failed server

*/
function serverActionForFailedServer(failedServerID) {
	// mark the server as a failed on its global server list
	markFailedServer(failedServerID);

	let chatRoomForFailedServer = getChatRoomOfServer(failedServerID);

	// remove chat rooms of the failed server
	for (var i = 0; i < chatRoomForFailedServer.length; i++) {
		removeChatroom(chatRoomForFailedServer[i]);
	}

	// remove clients of the failed server
	removeAllClientsOfAServer(failedServerID);

	// remove the heartbeat counter object of the failed server
	removeHeartbeatCounterObject(failedServerID);
}

/*

	leader action when a failed server encountered

*/
function leaderActionForFailedServer(failedServerID) {
	let failedServerInfo = getServerInfo(failedServerID);

	if (failedServerInfo["active"] == true) {

		let broadcastMessage = {
			"type": "heartbeat_fail_broadcast",
			"fail_serverid": failedServerID
		};

		serverActionForFailedServer(failedServerID)

		// broadcast the message to remove the failedServer from there globale server list
		broadcast(broadcastMessage);
	}
	// else disregrad the request, because it's already been handled by the leader.

}

async function heartbeat() {
	console.log("heartbeating");
	let arraySize = heartbeatCounterList.length;
	for (let i = 0; i < arraySize; i++) {
		// failure counter - when hit 3 inform leader about the failed serverId
		var failureCounter = 0;
		let prevHeartbeatCounter = heartbeatCounterList[i].heartbeatCounter;

		// send heartbeat to external servers
		sendHeartbeat(heartbeatCounterList[i]);

		// if a ack do not return in 3s try again for 3 times

		let intervalVar = setInterval(() => {
			if (prevHeartbeatCounter != heartbeatCounterList[i].heartbeatCounter--) {

				// if the heartBeatAck has not return back send the heatbeat again
				sendHeartbeat(heartbeatCounterList[i]);
				failureCounter++;

				console.log(heartbeatCounterList[i]["serverId"] + " heart beat failed. Trying Again");
			} else {
				// to break the failureCounter while loop
				failureCounter = 5;
			}
			if (failureCounter > 2) {
				clearInterval(intervalVar);
			}
		}, 3000);

		console.log(failureCounter);

		// if failureCounter == 3 inform the leader about the failed Server
		if (failureCounter == 3) {
			informFailure(heartbeatCounterList[i]["serverId"]);
		} else {
			console.log(heartbeatCounterList[i]["serverId"] + " heart beat success " + heartbeatCounterList[i]["heartbeatCounter"]);
		}
	}
}

module.exports = { initHeartbeat, heartbeat, receiveHeartbeat, receiveHeartbeatAck, leaderActionForFailedServer, serverActionForFailedServer }