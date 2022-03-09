const heap = require('heap-js');

const constants = require('./util/constants');


const answers = new heap.Heap();
var inProcess = False;
var acceptingAnswers = false;
var acceptingNominations = false;
var acceptingCoordinators = false;
var acceptingViews = false;

var beginElection = () => {
    //send election msgs to all servers with higher priority
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
    
}

var receiveElection = () => {
    //if the priority of server that sent the msg is lower, send answer msg
    
}

var sendAnswer = () => {

}

var receiveAnswer = () => {
    if(acceptingAnswers) {
        //add to answer array
    }
    
}

var sendCoordinator = () => {
    //to all servers with lower priority

    
    

}

var receiveCoordinator = () => {
    // if sender has higher priority, set sender as new coordinator
}
const sendNominationTimeout = null;
var sendNomination = () => {
    if(answers.length()>0)  { //if answer array not empty, pick highest priority and send nomination msg and wait for coordinator for T3
        const coordinator = answers.pop();
        sendNominationTimeout = setTimeout(sendNomination, constants.T3)  //repeat every T3 until coordinator msg received
    } else { //else restart election
        beginElection();
    }
    
}

var receiveNomination = (serverID) => {
    if(receiveNomination) {
        //check if serverID less than own
        sendCoordinator();
        inProcess = false;
    }
    //send_coordinator
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
