const { getServerId } = require("../data/serverDetails");
const util = require("../util/util");
const { message, broadcast } = require("./serverMessage");
const { beginElection } = require("./leaderElection")
const { getCoordinator } = require("../data/serverDetails");
const { getServerInfo, markFailedServer } = require("../data/globalServerDetails");
const { getChatRoomOfServer, removeChatroom } = require("../data/globalChatRooms");

/* 

includes heartbeat counter details.

[ 

{
	“serverID” : “s2”,
	“heartbeatCounter” : 1024,
	“timestamp” : xxxx
},...

]

* Use Date.now() to calculate the current timestamp

*/
var heartbeatCounterList = [
	{
		serverID: "s2",
		heartbeatCounter: 1024,
		Timestamp: 1647282451457
	}
];

var heartbeatReceiveCounterList = [
	{
		serverID: "s2",
		heartbeatCounter: 1024,
		Timestamp: 1647282451457
	}
];

// add given heartbeatCounterObject to the heartbeatCounterList
function addHearbeatCounterObject(heartbeatCounterObject) {
	heartbeatCounterList.push(heartbeatCounterObject);
}

/*

	if heartbeatCounterObject exsists
		remove the object from the heartbeatCounterList
	else	
		return false

*/
function removeHeartbeatCounterObject(heartbeatCounterObject) {
	let heartbeatCounterListIndex = heartbeatCounterList.findIndex((x) => x == heartbeatCounterObject);
	if (heartbeatCounterListIndex == -1) {
		let arraySize = heartbeatCounterList.length;
		for (let i = 0; i < arraySize; i++) {
			if (heartbeatCounterList[i].serverId == heartbeatCounterObject.serverID) {
				heartbeatCounterListIndex = i;
			}
			return false
		}
	}

	heartbeatCounterList.splice(heartbeatCounterListIndex, 1);
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
		if (heartbeatCounterList[i].serverId == serverId) {
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

	for (var i = 0; i < arrayLength; i++) {
		if (heartbeatReceiveCounterList[i].serverid == identity) {
			currentCounter = heartbeatReceiveCounterList[i].counter;
			break
		}
	}

	if (receivedCounter > currentCounter) {

		let arrayLength = heartbeatCounterList.length;

		for (var i = 0; i < arrayLength; i++) {
			if (heartbeatCounterList[i].serverid == identity) {
				heartbeatCounterList[i].counter = heartbeatCounterList[i].counter + 1;
				break
			}
		}

		let heartbeatAckMessage = {
			"type": "heartbeat_ack",
			"from": getServerId(),
			"counter": heartbeatCounterObject[heartbeatCounter]++
		};

		// sernd the heartbeat message to the particular server
		message(identity, heartbeatAckMessage);
	}

}

//increase heartbeat counter after receiving heartbeat ack message

function receiveHeartbeatAck(identity) {

	let arrayLength = heartbeatReceiveCounterList.length;

	for (var i = 0; i < arrayLength; i++) {
		if (heartbeatReceiveCounterList[i].serverid == identity) {
			heartbeatReceiveCounterList[i].counter = heartbeatReceiveCounterList[i].counter + 1;
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
		"counter": heartbeatCounterObject[heartbeatCounter]++
	};

	// sernd the heartbeat message to the particular server
	message(serverId, heartbeatMessage);
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
	if (serverid == leaderid) {
		beginElection();
	}
	else {
		let failureMsg = {
			"type": "heartbeat_fail",
			"fail_serverid": serverid
		};
		message(leaderid, failureMsg);
	}
}

/*

	general server action for failed server

*/
function serverActionForFailedServer(failedServerID) {
	// mark the server as a failed on its global server list
	markFailedServer(failedServerID);

	let chatRoomForFailedServer = getChatRoomOfServer(failedServerID);

	for (var i = 0; i < chatRoomForFailedServer.length; i++) {
		removeChatroom(chatRoomForFailedServer[i]);
	}

	//todo: remove its clients from global client list
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
	while (true) {

		let arraySize = heartbeatCounterList.length;
		for (let i = 0; i < arraySize; i++) {

			// failure counter - when hit 3 inform leader about the failed serverId
			let failureCounter = 0;
			let prevHeartbeatCounter = heartbeatCounterList[i].heartbeatCounter;

			// send heartbeat to external servers
			sendHeartbeat(heartbeatCounterList[i]);

			// if a ack do not return in 3s try again for 3 times
			while (failureCounter < 3) {
				new Promise(resolve => {
					setTimeout(() => {
						if (prevHeartbeatCounter != heartbeatCounterList[i].heartbeatCounter--) {

							// if the heartBeatAck has not return back send the heatbeat again
							sendHeartbeat(heartbeatCounterList[i]);
							failureCounter++;

							console.log(heartbeatCounterList[i].serverID + " heart beat failed. Trying Again");
						} else {
							// to break the failureCounter while loop
							failureCounter = 5;
						}
					}, 3000);
				});
			}

			// if failureCounter == 3 inform the leader about the failed Server
			if (failureCounter == 3) {
				informFailure(heartbeatCounterList[i].serverID);
			}

			return false
		}
	}
}

module.exports = { heartbeat, receiveHeartbeat, leaderActionForFailedServer, serverActionForFailedServer }