const { getServerId } = require("../data/serverDetails");
const util = require("../util/util");
const { unicast, broadcast } = require("./serverMessage");
const { getCoordinator } = require("../data/serverDetails");
const { getServerInfo, markFailedServer, getAllServerInfo } = require("../data/globalServerDetails");
const { getChatRoomOfServer, removeChatroom } = require("../data/globalChatRooms");
const { removeAllClientsOfAServer } = require("../data/globalClients");
const { beginElection } = require("./leaderElection");

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
				"heartbeatCounter": 1,
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
// called after Iam up message inside leader election
function addHearbeatCounterObject(serverId) {

	let arraySize = heartbeatCounterList.length;
	let serverExists = false;
	for (let i = 0; i < arraySize; i++) {
		if (heartbeatCounterList[i]["serverId"] == serverId) {
			serverExists = true;
			break;
		}
	}
	if (!serverExists) {
		let heartbeatCounterObject = {
			"serverId": serverId,
			"heartbeatCounter": 1,
			"failedCounter": 0
		}

		let heartbeatReceiveCounterObject = {
			"serverId": serverId,
			"heartbeatCounter": 0,
		}
		heartbeatCounterList.push(heartbeatCounterObject);
		heartbeatReceiveCounterList.push(heartbeatReceiveCounterObject);
		console.log(serverId, " added to heartbeat");
	}
}

/*

	if heartbeatCounterObject exsists
		remove the object from the heartbeatCounterList and heartbeatCounterRecievedList
	else	
		return false

*/
function removeHeartbeatCounterObject(failedServerId) {
	let arraySize = heartbeatCounterList.length;
	for (let i = 0; i < arraySize; i++) {
		if (heartbeatCounterList[i]["serverId"] == failedServerId) {
			heartbeatCounterListIndex = i;
			break;
		}
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

	addHearbeatCounterObject(identity);

	let arrayLength = heartbeatReceiveCounterList.length;
	let currentCounter;
	let fromServerIndex;
	let availableInCounterList = false;
	for (var i = 0; i < arrayLength; i++) {
		if (heartbeatReceiveCounterList[i]["serverId"] == identity) {
			currentCounter = heartbeatReceiveCounterList[i]["heartbeatCounter"];
			fromServerIndex = i;
			availableInCounterList = true;
			break
		}
	}
	if(!availableInCounterList) {
		addHearbeatCounterObject(identity);
		receiveHeartbeat(identity, receivedCounter);
		return
	}
	if (receivedCounter > currentCounter) {


		heartbeatReceiveCounterList[fromServerIndex]["heartbeatCounter"] = heartbeatReceiveCounterList[fromServerIndex]["heartbeatCounter"] + 1;

		let heartbeatAckMessage = {
			"type": "heartbeat_ack",
			"from": getServerId(),
			"counter": heartbeatReceiveCounterList[fromServerIndex]["heartbeatCounter"]
		};

		// sernd the heartbeat message to the particular server
		unicast(identity, heartbeatAckMessage);
	}

}

//increase heartbeat counter after receiving heartbeat ack message

function receiveHeartbeatAck(identity, counter) {

	let arrayLength = heartbeatCounterList.length;

	for (var i = 0; i < arrayLength; i++) {
		if (heartbeatCounterList[i]["serverId"] == identity) {
			heartbeatCounterList[i]["heartbeatCounter"]++;
			break;
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
		"counter": heartbeatCounterObject["heartbeatCounter"]
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
	let failureMsg = {
		"type": "heartbeat_fail",
		"fail_serverid": serverid
	};

	console.log(leaderid);

	if (serverid == leaderid) {
		// remove the heartbeat counter object of the failed server
		removeHeartbeatCounterObject(serverid);
		beginElection();
	}
	else {
		// check if the current server is the leader
		if (leaderid == getServerId()) {
			leaderActionForFailedServer(serverid)
		} else {
			unicast(leaderid, failureMsg);
		}
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

	console.log(`${failedServerID} is removed from the server lists`)
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
	//console.log("heartbeating");
	let arraySize = heartbeatCounterList.length;

	for (let i = 0; i < arraySize; i++) {
		// failure counter - when hit 3 inform leader about the failed serverId
		let failureCounter = 0;
		let prevHeartbeatCounter = heartbeatCounterList[i]["heartbeatCounter"];

		// send heartbeat to external servers
		sendHeartbeat(heartbeatCounterList[i]);

		// if a ack do not return in 3s try again for 3 times

		let intervalVar = setInterval(() => {

			if (heartbeatCounterList[i] == undefined) {
				clearInterval(intervalVar);
			} else {
				let currentCounter = heartbeatCounterList[i]["heartbeatCounter"] - 1;
				if (prevHeartbeatCounter >= currentCounter) {

					failureCounter = failureCounter + 1;

					// if the heartBeatAck has not return back send the heatbeat again
					sendHeartbeat(heartbeatCounterList[i]);

					console.log(failureCounter);
					console.log(heartbeatCounterList[i]["serverId"] + " heart beat failed. Trying Again");
				} else {
					// to break the failureCounter while loop
					failureCounter = 5;
					//console.log(heartbeatCounterList[i]["serverId"] + " heart beat success " + heartbeatCounterList[i]["heartbeatCounter"]);
				}

				// if failureCounter == 3 inform the leader about the failed Server
				if (failureCounter == 2) {
					informFailure(heartbeatCounterList[i]["serverId"]);
				}

				if (failureCounter > 1) {
					clearInterval(intervalVar);
				}
			}

		}, 3000);

	}
}

module.exports = { initHeartbeat, heartbeat, receiveHeartbeat, receiveHeartbeatAck, leaderActionForFailedServer, serverActionForFailedServer }