const heap = require('heap-js');
const constants = require('../util/constants');
const {message, broadcast, multicast} = require("./serverMessage")
const {getAllServerInfo} = require("../data/globalServerDetails")
const {getPriority, getServerId, setCoordinator} = require("../data/serverDetails")
const {getLocalClientIds} = require("../data/serverClients")
const {getLocalChatRooms} = require("../data/serverChatRooms")
const {updateRooms} = require("../data/globalChatRooms")
const {updateClients} = require("../data/globalClients")

const answers = new heap.Heap();
var inProcess = false;
var acceptingAnswers = false;
var acceptingNominations = false;
var acceptingCoordinators = false;
var acceptingViews = false;


var bullyManager = (json) => {
    switch (json.subtype) {

        case "iamup":
            receiveIamup(json.serverid);
            break; 

        case "view":
            receiveView(json);
            break;
        case "election":
            receiveElection(json.serverid);
            break;
        case "answer":
            receiveAnswer(json.serverid);
            break;
        case "nomination":
            receiveNomination(json.serverid);
            break;
        case "coordinator":
            receiveCoordinator(json.serverid);
            break;
    }
}

var beginElection = () => {
    //send election msgs to all processes with higher priority
    sendElection();
    acceptingAnswers = true;
    inProcess = true;
    setCoordinator(null);
    setTimeout(() => {
        acceptingAnswers = false;
        if(answers.length()>0) {  //if answer array not empty, pick highest priority and send nomination msg and wait for coordinator for T3
            sendNomination();
            acceptingNominations = true;
        } else {  //else, send coordinator msgs to all processes wih lower priority
            sendCoordinator();
        }

    }, constants.T2);
}

var sendElection = () => {
    let electionMsg = {type : "bully", subtype : "election", serverid : getServerId()};
    multicast(getHigherPriorityServers(),electionMsg);
}

var receiveElectionTimeout = null;
var receiveElection = (serverId) => {
    setCoordinator(null);
    //if the priority of server that sent the msg is lower, send answer msg
    let serverPriority = parseInt(serverId.slice(1));
    if(serverPriority < getPriority()) {
        sendAnswer(serverId);
        receiveElectionTimeout = setTimeout(() => {
            beginElection();
        }, constants.T4);
    }
}

var sendAnswer = (serverId) => {
    let answerMsg = {type : "bully", subtype : "answer", serverid : getServerId()}
    message(serverId, answerMsg);
}

var receiveAnswer = (serverId) => {
    if(acceptingAnswers) {
        answers.push(parseInt(serverId.slice(1)));
    }
    
}

var sendCoordinator = () => {
    //to all servers with lower priority
    let coordinatorMsg = {type : "bully", subtype : "coordinator", serverid : getServerId()}
    multicast(getLowerPriorityServers, coordinatorMsg);
}

var receiveCoordinator = (serverId) => {
    if(receiveElectionTimeout!=null) {
        clearTimeout(receiveElectionTimeout);
        receiveElectionTimeout = null;
    }
    let serverPriority = parseInt(serverId.slice(1));
    // if sender has higher priority, set sender as new coordinator
    if(serverId===currentNomination) {
        clearTimeout(sendNominationTimeout);
        setCoordinator(serverId);
    }
    if(serverPriority > getPriority()) {
        setCoordinator(serverId);
    }
}

var sendNominationTimeout = null;
var currentNomination;
var sendNomination = () => {
    if(answers.length()>0)  { //if answer array not empty, pick highest priority and send nomination msg and wait for coordinator for T3
        currentNomination = "s"+answers.pop();
        let nominationMsg = {type : "bully", subtype : "nomination", serverid : getServerId()}
        message(currentNomination, nominationMsg);
        sendNominationTimeout = setTimeout(sendNomination, constants.T3)  //repeat every T3 until coordinator msg received
    } else { //else restart election
        beginElection();
    }
    
}

var receiveNomination = (serverId) => {
    if(receiveElectionTimeout!=null) {
        clearTimeout(receiveElectionTimeout);
        receiveElectionTimeout = null;
    }
    //check if serverID less than own and send coordinator
    let serverPriority = parseInt(serverId.slice(1));
    if(serverPriority < getPriority()) {
        
        sendCoordinator();
        inProcess = false;
    }
}
var viewMsgPriorities = []
var sendIamup = () => {
    let iamupMsg = {type : "bully", subtype : "iamup", serverid : getServerId()}
    broadcast(iamupMsg);
    acceptingViews = true;
    setTimeout(()=> {
        acceptingViews = false;
        if(viewMsgPriorities.length==0) {
            setCoordinator(getServerId());
        } else {
            if(Math.min(viewMsgPriorities)>getServerId()) {
                setCoordinator(getServerId());
                sendCoordinator();
            } else {
                setCoordinator("s" + Math.min(viewMsgPriorities));
            }
        }
    },constants.T2);
}

var receiveIamup = (serverId) => {
    sendView(serverId);
}

var sendView = (serverId) => {
    let viewMsg = {type : "bully", subtype : "view", serverpriority : getPriority(), clientlist : getLocalClientIds(), roomlist : getLocalChatRooms()}
    message(serverId, viewMsg);
}

var receiveView = (viewMsg) => {
    if(acceptingViews) {
        viewMsgPriorities.push(viewMsg.serverpriority);
        updateClients(viewMsg.clientlist);
        updateRooms(viewMsg.roomlist, "s"+viewMsg.serverpriority);
    }
}

function getHigherPriorityServers() {
    let results = [];
    let globalServerInfo = getAllServerInfo();
    let serverPriority = getPriority();
    for (var i = 0; i < globalServerInfo.length; i++) {
        if ((serverPriority.priority < globalServerInfo[i].priority) && globalServerInfo[i].active == true) {
            results.push(globalServerInfo[i].serverId);
        }
    } 
    return results;
}

function getLowerPriorityServers() {
    let results = [];
    let globalServerInfo = getAllServerInfo();
    let serverPriority = getPriority();
    for (var i = 0; i < globalServerInfo.length; i++) {
        if ((serverPriority.priority > globalServerInfo[i].priority) && globalServerInfo[i].active == true) {
            results.push(globalServerInfo[i].serverId);
        }
    } 
    return results;
}

module.exports = {bullyManager, beginElection, sendIamup}
//block clients until all servers up
//values for t1, t2
//at start, set leader