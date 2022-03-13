const heap = require('heap-js');

const constants = require('./util/constants');

const {message, broadcast, multicast} = require("./serverServer/message")

const {getLowerPriorityServers, getHigherPriorityServers, serverDetails} = require("./serverManager/serverManager")

const answers = new heap.Heap();
var inProcess = false;
var acceptingAnswers = false;
var acceptingNominations = false;
var acceptingCoordinators = false;
var acceptingViews = false;

var beginElection = () => {
    //send election msgs to all processes with higher priority
    sendElection();
    acceptingAnswers = true;
    inProcess = true;

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
    let electionMsg = {“type” : “bully”, “subtype” : “election”, “serverid” : serverDetails.id}
    multicast(getHigherPriorityServers(),electionMsg)
}

var receiveElection = (serverPriority) => {
    //if the priority of server that sent the msg is lower, send answer msg
    if(serverPriority < serverDetails.priority) {
        sendAnswer("s" + serverPriority);
    }
    
}

var sendAnswer = (serverId) => {
    let answerMsg = {“type” : “bully”, “subtype” : “answer”, “serverid” : serverDetails.id}
    message(serverId, answerMsg);
}

var receiveAnswer = (serverPriority) => {
    if(acceptingAnswers) {
        answers.push(serverPriority);
    }
    
}

var sendCoordinator = () => {
    //to all servers with lower priority
    let coordinatorMsg = {“type” : “bully”, “subtype” : “coordinator”, “serverid” : serverDetails.id}
    multicast(getLowerPriorityServers, coordinatorMsg);
}

var receiveCoordinator = (serverPriority) => {
    // if sender has higher priority, set sender as new coordinator
    if(serverPriority > serverDetails.priority) {

    }
}

const sendNominationTimeout = null;
var sendNomination = () => {
    if(answers.length()>0)  { //if answer array not empty, pick highest priority and send nomination msg and wait for coordinator for T3
        const nominationId = "s"+answers.pop();
        //nominationMsg = {“type” : “bully”, “subtype” : “nomination”, “serverid” : “s3”}
        message(nominationId,nominationMsg);
        sendNominationTimeout = setTimeout(sendNomination, constants.T3)  //repeat every T3 until coordinator msg received
    } else { //else restart election
        beginElection();
    }
    
}

var receiveNomination = (serverPriority) => {
    //check if serverID less than own and send coordinator
    if(serverPriority < serverDetails.priority) {
        
        sendCoordinator();
        inProcess = false;
    }
}

var sendIamup = () => {
    //send messages to all
    acceptingViews = true;
    setTimeout(()=> {
        acceptingViews = false;
    },constants.T2);
}

var receiveIamup = () => {
    sendView();
}

var sendView = () => {

}

var receiveView = () => {
    //compare with current and update
}

//block clients until all servers up
//values for t1, t2
//at start, set leader